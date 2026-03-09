import { Room, Client } from "colyseus";
import { v4 as uuidv4 } from "uuid";
import {
    GameState, PlayerState, MonsterState, FloorState
} from "../schemas/GameState";
import { getMonsterDefsForFloor } from "../data/MonsterData";

const MAX_PLAYERS = 4;
const TICK_MS = 1000;           // 基本アクション間隔（1秒）
const MAX_DUNGEON_LEVEL = 9;
const MAX_MONSTERS_PER_FLOOR = 20;
const MONSTER_SPAWN_PER_TICK = 3;
const DETECTION_RANGE = 15;

interface RoomData {
    x: number; y: number; width: number; height: number;
}

interface FloorMapData {
    rooms: RoomData[];
    blocked: boolean[][];   // [y][x]
    width: number;
    height: number;
}

type ActionType = 'move' | 'attack' | 'stay' | 'changeFloor';

interface PlayerAction {
    type: ActionType;
    direction?: string;         // 'l'|'r'|'u'|'d'
    targetId?: string;          // PK対象のsessionId
    floorDir?: 'up' | 'down';
}

export class DungeonRoom extends Room<GameState> {
    private tickTimer: ReturnType<typeof setInterval> | null = null;
    private floorMaps: (FloorMapData | null)[] = Array(MAX_DUNGEON_LEVEL).fill(null);
    private pendingActions: Map<string, PlayerAction> = new Map();
    private tickEvents: object[] = [];
    private currentTick = 0;

    maxClients = MAX_PLAYERS;

    onCreate(_options: any) {
        this.setState(new GameState());
        for (let i = 0; i < MAX_DUNGEON_LEVEL; i++) {
            this.state.floors.push(new FloorState());
        }

        // マップシードを生成して全クライアントに送る
        this.state.mapSeed = Math.floor(Math.random() * 2147483647);

        // プレイヤーアクション受信
        this.onMessage("action", (client, action: PlayerAction) => {
            this.pendingActions.set(client.sessionId, action);
        });

        // ホストからのマップデータ受信（ブロック情報と部屋情報）
        this.onMessage("mapData", (client, data: { floor: number; mapData: FloorMapData }) => {
            if (client.sessionId !== this.state.hostSessionId) return;
            this.floorMaps[data.floor] = data.mapData;
            this.state.floors[data.floor].mapReady = true;
            // 新規クライアントにはスポーン時に送信
        });

        this.tickTimer = setInterval(() => this.gameTick(), TICK_MS);
        console.log(`[DungeonRoom] created, seed=${this.state.mapSeed}`);
    }

    onJoin(client: Client, options: any) {
        const isFirstPlayer = this.state.players.size === 0;

        const player = new PlayerState();
        player.sessionId = client.sessionId;
        player.name = options?.name ?? `Player${this.clients.length}`;
        player.skin = options?.skin ?? "human";
        player.mapX = 5;
        player.mapY = 5;
        player.floor = 0;
        player.isHost = isFirstPlayer;

        if (isFirstPlayer) {
            this.state.hostSessionId = client.sessionId;
        }

        this.state.players.set(client.sessionId, player);

        // シードを送る（クライアントはこれでマップ生成）
        client.send("seed", { mapSeed: this.state.mapSeed });

        // 既存のマップデータを新規クライアントに転送
        for (let i = 0; i < MAX_DUNGEON_LEVEL; i++) {
            if (this.floorMaps[i]) {
                client.send("mapData", { floor: i, mapData: this.floorMaps[i] });
            }
        }

        // 既存モンスター情報を送信
        client.send("syncMonsters", this.serializeMonsters());

        console.log(`[DungeonRoom] ${player.name} joined (host=${isFirstPlayer})`);
    }

    onLeave(client: Client, _consented: boolean) {
        this.state.players.delete(client.sessionId);

        // ホスト交代
        if (client.sessionId === this.state.hostSessionId) {
            const next = this.clients.find(c => c.sessionId !== client.sessionId);
            if (next) {
                this.state.hostSessionId = next.sessionId;
                const nextPlayer = this.state.players.get(next.sessionId);
                if (nextPlayer) nextPlayer.isHost = true;
                next.send("becameHost", {});
            }
        }
        console.log(`[DungeonRoom] ${client.sessionId} left`);
    }

    private gameTick() {
        this.currentTick++;
        this.state.tick = this.currentTick;
        this.tickEvents = [];

        // プレイヤーアクション処理
        for (const [sessionId, action] of this.pendingActions) {
            const player = this.state.players.get(sessionId);
            if (!player || player.isDead) continue;
            this.processPlayerAction(sessionId, player, action);
        }
        this.pendingActions.clear();

        // モンスターAI
        this.processMonsterAI();

        // モンスタースポーン
        this.ensureMonsterSpawn();

        // イベントブロードキャスト
        if (this.tickEvents.length > 0) {
            this.broadcast("tickEvents", this.tickEvents);
        }
    }

    private processPlayerAction(sessionId: string, player: PlayerState, action: PlayerAction) {
        if (action.type === 'move' && action.direction) {
            const dx = action.direction === 'l' ? -1 : action.direction === 'r' ? 1 : 0;
            const dy = action.direction === 'u' ? -1 : action.direction === 'd' ? 1 : 0;
            const nx = player.mapX + dx;
            const ny = player.mapY + dy;

            // 壁チェック
            const map = this.floorMaps[player.floor];
            if (map && map.blocked[ny]?.[nx]) return;

            // PK衝突チェック
            const target = this.findPlayerAt(nx, ny, player.floor, sessionId);
            if (target) {
                this.processPK(player, target, sessionId, target.sessionId);
                return;
            }

            // モンスター衝突チェック
            const monster = this.findMonsterAt(nx, ny, player.floor);
            if (monster) {
                this.processPlayerVsMonster(player, monster, sessionId);
                return;
            }

            player.mapX = nx;
            player.mapY = ny;

        } else if (action.type === 'changeFloor') {
            const nextFloor = action.floorDir === 'down'
                ? Math.min(player.floor + 1, MAX_DUNGEON_LEVEL - 1)
                : Math.max(player.floor - 1, 0);
            player.floor = nextFloor;
            this.tickEvents.push({ type: 'floorChange', sessionId, floor: nextFloor });

        } else if (action.type === 'attack' && action.targetId) {
            const target = this.state.players.get(action.targetId);
            if (target && target.floor === player.floor) {
                this.processPK(player, target, sessionId, action.targetId);
            }
        }
    }

    private processPK(
        attacker: PlayerState, defender: PlayerState,
        attackerId: string, defenderId: string
    ) {
        const dmg = Math.max(0, this.roll(1, 10) + Math.floor(attacker.str / 10) - Math.floor(defender.con / 20));
        this.tickEvents.push({ type: 'pk', attackerId, defenderId, dmg });

        if (dmg <= 0) return;
        defender.hp = Math.max(0, defender.hp - dmg);

        if (defender.hp <= 0) {
            defender.isDead = true;
            this.tickEvents.push({ type: 'pkDeath', attackerId, defenderId });
            // リスポーン
            setTimeout(() => {
                defender.hp = defender.maxHp;
                defender.floor = 0;
                defender.mapX = 5;
                defender.mapY = 5;
                defender.isDead = false;
            }, 3000);
        }
    }

    private processPlayerVsMonster(player: PlayerState, monster: MonsterState, playerId: string) {
        // プレイヤー攻撃
        const pDmg = Math.max(0, this.roll(1, 8) + Math.floor(player.str / 10));
        monster.hp = Math.max(0, monster.hp - pDmg);
        this.tickEvents.push({ type: 'playerAttack', playerId, monsterUuid: monster.uuid, dmg: pDmg });

        if (monster.hp <= 0) {
            monster.isDead = true;
            player.exp += monster.expReward;
            this.tickEvents.push({ type: 'monsterDeath', monsterUuid: monster.uuid, floor: monster.floor });
            this.checkLevelup(player, playerId);
            return;
        }

        // モンスター反撃
        const mDmg = Math.max(0, this.roll(1, 6) - Math.floor(player.con / 20));
        if (mDmg > 0) {
            player.hp = Math.max(0, player.hp - mDmg);
            this.tickEvents.push({ type: 'monsterAttack', monsterUuid: monster.uuid, playerId, dmg: mDmg });
        }

        if (player.hp <= 0) {
            player.isDead = true;
            this.tickEvents.push({ type: 'playerDeath', playerId });
            setTimeout(() => {
                player.hp = player.maxHp;
                player.floor = 0;
                player.mapX = 5;
                player.mapY = 5;
                player.isDead = false;
            }, 3000);
        }
    }

    private processMonsterAI() {
        const playersByFloor = new Map<number, PlayerState[]>();
        this.state.players.forEach(p => {
            if (p.isDead) return;
            if (!playersByFloor.has(p.floor)) playersByFloor.set(p.floor, []);
            playersByFloor.get(p.floor)!.push(p);
        });

        this.state.floors.forEach((floorState, floorIdx) => {
            const players = playersByFloor.get(floorIdx);
            if (!players || players.length === 0) return;

            floorState.monsters.forEach(monster => {
                if (monster.isDead) return;

                // 最近傍プレイヤーを探す
                let nearest: PlayerState | null = null;
                let nearestDist = Infinity;
                for (const p of players) {
                    const d = Math.abs(p.mapX - monster.mapX) + Math.abs(p.mapY - monster.mapY);
                    if (d < nearestDist) { nearestDist = d; nearest = p; }
                }
                if (!nearest || nearestDist > DETECTION_RANGE) return;

                // 隣接 → 攻撃
                if (nearestDist <= 1) {
                    const mDmg = Math.max(0, this.roll(1, 6));
                    nearest.hp = Math.max(0, nearest.hp - mDmg);
                    this.tickEvents.push({
                        type: 'monsterAttack', monsterUuid: monster.uuid,
                        playerId: nearest.sessionId, dmg: mDmg
                    });
                    if (nearest.hp <= 0) {
                        nearest.isDead = true;
                        this.tickEvents.push({ type: 'playerDeath', playerId: nearest.sessionId });
                        setTimeout(() => {
                            nearest!.hp = nearest!.maxHp;
                            nearest!.floor = 0;
                            nearest!.mapX = 5;
                            nearest!.mapY = 5;
                            nearest!.isDead = false;
                        }, 3000);
                    }
                    return;
                }

                // 移動
                const map = this.floorMaps[floorIdx];
                let nx = monster.mapX;
                let ny = monster.mapY;
                if (Math.random() < 0.5) {
                    nx += nearest.mapX < monster.mapX ? -1 : nearest.mapX > monster.mapX ? 1 : 0;
                } else {
                    ny += nearest.mapY < monster.mapY ? -1 : nearest.mapY > monster.mapY ? 1 : 0;
                }
                if (map && map.blocked[ny]?.[nx]) return;
                if (this.findPlayerAt(nx, ny, floorIdx, '')) return; // 他プレイヤーがいる
                monster.mapX = nx;
                monster.mapY = ny;
            });
        });
    }

    private ensureMonsterSpawn() {
        for (let floor = 0; floor < MAX_DUNGEON_LEVEL; floor++) {
            // そのフロアにプレイヤーがいるか確認
            let hasPlayer = false;
            this.state.players.forEach(p => { if (p.floor === floor) hasPlayer = true; });
            if (!hasPlayer) continue;

            const map = this.floorMaps[floor];
            if (!map || map.rooms.length === 0) continue;

            const floorState = this.state.floors[floor];
            const alive = floorState.monsters.filter(m => !m.isDead).length;
            if (alive >= MAX_MONSTERS_PER_FLOOR) continue;

            const defs = getMonsterDefsForFloor(floor);
            if (defs.length === 0) continue;

            for (let i = 0; i < MONSTER_SPAWN_PER_TICK; i++) {
                const def = defs[Math.floor(Math.random() * defs.length)];
                const room = map.rooms[Math.floor(Math.random() * map.rooms.length)];
                const x = room.x + 1 + Math.floor(Math.random() * Math.max(1, room.width - 2));
                const y = room.y + 1 + Math.floor(Math.random() * Math.max(1, room.height - 2));

                const m = new MonsterState();
                m.uuid = uuidv4();
                m.skin = def.skin;
                m.characterName = def.characterName;
                m.mapX = x;
                m.mapY = y;
                m.floor = floor;
                m.hp = def.maxHp;
                m.maxHp = def.maxHp;
                m.lv = def.lv;
                m.expReward = def.expReward;
                m.currentBehavior = def.currentBehavior;
                floorState.monsters.push(m);
            }

            // 死亡モンスターを削除
            const survivors = floorState.monsters.filter(m => !m.isDead);
            floorState.monsters.clear();
            survivors.forEach(m => floorState.monsters.push(m));
        }
    }

    private findPlayerAt(x: number, y: number, floor: number, excludeId: string): PlayerState | null {
        for (const [id, p] of this.state.players.entries()) {
            if (id !== excludeId && !p.isDead && p.floor === floor && p.mapX === x && p.mapY === y) {
                return p;
            }
        }
        return null;
    }

    private findMonsterAt(x: number, y: number, floor: number): MonsterState | null {
        return this.state.floors[floor].monsters.find(
            m => !m.isDead && m.floor === floor && m.mapX === x && m.mapY === y
        ) ?? null;
    }

    private checkLevelup(player: PlayerState, playerId: string) {
        const nextExp = Math.pow(player.lv, 2) * 100;
        if (player.exp >= nextExp) {
            player.lv++;
            player.maxHp += 5;
            player.hp = Math.min(player.hp + 5, player.maxHp);
            player.str += 2;
            player.dex += 2;
            player.con += 1;
            this.tickEvents.push({ type: 'levelup', playerId, lv: player.lv });
        }
    }

    private serializeMonsters() {
        return Array.from({ length: MAX_DUNGEON_LEVEL }, (_, i) => ({
            floor: i,
            monsters: this.state.floors[i].monsters
                .filter(m => !m.isDead)
                .map(m => ({
                    uuid: m.uuid, skin: m.skin, characterName: m.characterName,
                    mapX: m.mapX, mapY: m.mapY, floor: m.floor,
                    hp: m.hp, maxHp: m.maxHp, lv: m.lv, expReward: m.expReward
                }))
        }));
    }

    private roll(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    onDispose() {
        if (this.tickTimer) clearInterval(this.tickTimer);
        console.log("[DungeonRoom] disposed");
    }
}
