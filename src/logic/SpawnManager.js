import { Container, } from 'pixi.js';
import { MAX_DUNGEON_LEVEL } from "../define";
import MS_Monster from '../data/MS_Monster';
import MS_NPC from '../data/MS_NPC';
import SP_Monster from '../sprites/SP_Monster';
import SP_NPC from '../sprites/SP_NPC';

const MAX_CHARACTERS = 20;

class SpawnManager {

    constructor(gameScene) {
        this.gameScene = gameScene;
        this.layer = new Container();
        this.contianerMonster = new Container();
        this.contianerTrace = new Container();
        this.containerNpc = new Container();
        this.levelMsMonster = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.levelMonster = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.levelTrace = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.levelNpcs = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this._npcSpawned = Array(MAX_DUNGEON_LEVEL).fill(false);
        this.layer.addChild(this.contianerMonster);
        this.layer.addChild(this.contianerTrace);
        this.layer.addChild(this.containerNpc);
        for (let level = 0; level < MAX_DUNGEON_LEVEL; level++) {
            this.levelMsMonster[level] = MS_Monster.filter(
                ({ spawnStartLv, spawnEndLv }) => level >= spawnStartLv && level <= spawnEndLv
            );
        }
    }

    getPrim = _ => this.layer;

    spawnEnemy = _ => {
        const { core, level } = this.gameScene;
        const monsters = this.levelMonster[level];
        const scene = this.gameScene;
        if (monsters.length >= MAX_CHARACTERS) return;
        Array.from({ length: 5 }, _ => {
            const numMonsters = this.levelMsMonster[level].length;
            if (numMonsters < 1) return;
            const monsterSetting = this.levelMsMonster[level][Math.floor(Math.random() * numMonsters)];
            const monster = new SP_Monster({ core, scene, monsterSetting });
            monster.respawn();
            this.levelMonster[level].push(monster);
        });
        this.reset(level)
    }

    addTrace = trace => this.contianerTrace.addChild(trace.getPrim());

    reset = (level = 0) => {
        this.setLevelMonster(level);
    }

    refreshMonsters() {
        const { level } = this.gameScene;
        const deadMonster = this.levelMonster[level].filter(m => m.isDie);
        const deadMonsterIds = deadMonster.map(({ uuid }) => uuid);
        this.levelMonster[level] = this.levelMonster[level].filter(m => !m.isDie);
        this.levelTrace[level] = this.levelTrace[level].filter(m => !m.isDie);
        if (deadMonsterIds.length) {
            this.levelMonster[level].forEach(m => {
                // 死んだ敵をターゲットから削除
                m.applyTargetsIds(deadMonsterIds);
            })
        }
        this.reset(level);
    }

    refreshNPCs() {
        const { level } = this.gameScene;
        this.levelNpcs[level] = this.levelNpcs[level].filter(n => !n.isDie);
        this.reset(level);
    }

    getNpcs = () => this.levelNpcs[this.gameScene.level];

    // フロアのNPCを初回のみ生成する（遅延初期化）
    _initNpcsForLevel(level) {
        if (this._npcSpawned[level]) return;
        this._npcSpawned[level] = true;
        const { core } = this.gameScene;
        const scene = this.gameScene;
        MS_NPC.filter(npcSetting => npcSetting.spawnConfig.floor === level).forEach(npcSetting => {
            const npc = new SP_NPC({ core, scene, npcSetting });
            npc.spawn();
            this.levelNpcs[level].push(npc);
        });
    }

    setLevelMonster = level => {
        this.contianerMonster.removeChildren();
        this.contianerTrace.removeChildren();
        this.containerNpc.removeChildren();
        this._initNpcsForLevel(level);
        const monsters = this.levelMonster[level];
        const traces = this.levelTrace[level];
        const npcs = this.levelNpcs[level];
        monsters.forEach(monster => {
            monster.makePrim(); // プリミティブ再生成
            this.contianerMonster.addChild(monster.getPrim())
        });
        traces.forEach(trace => {
            trace.makePrim(); // プリミティブ再生成
            this.contianerTrace.addChild(trace.getPrim())
        });
        npcs.forEach(npc => {
            npc.makePrim(); // プリミティブ再生成
            this.containerNpc.addChild(npc.getPrim());
        });
        this.gameScene.monsters = this.levelMonster[level];
        this.gameScene.traces = this.levelTrace[level];
        this.gameScene.npcs = this.levelNpcs[level];
    };
}

export default SpawnManager;
