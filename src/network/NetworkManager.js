import * as Colyseus from "colyseus.js";

const SERVER_URL = "ws://localhost:2567";

/**
 * NetworkManager
 * Colyseus サーバーとの通信を管理する。
 * GameScene から参照され、マルチプレイ時はここ経由でアクションを送受信する。
 */
class NetworkManager {
    constructor() {
        this.client = null;
        this.room = null;
        this.isConnected = false;
        this.isHost = false;
        this.mapSeed = null;
        this.sessionId = null;

        // コールバック（GameScene が登録する）
        this.onSeedReceived = null;     // (seed) => void
        this.onPlayerJoined = null;     // (sessionId, playerState) => void
        this.onPlayerLeft = null;       // (sessionId) => void
        this.onStateChange = null;      // (state) => void
        this.onTickEvents = null;       // (events) => void
        this.onMapData = null;          // (floor, mapData) => void
        this.onBecameHost = null;       // () => void
    }

    async connect(serverUrl, playerName, skin) {
        const url = serverUrl || SERVER_URL;
        this.client = new Colyseus.Client(url);
        try {
            this.room = await this.client.joinOrCreate("dungeon", { name: playerName, skin });
            this.sessionId = this.room.sessionId;
            this.isConnected = true;
            this._setupHandlers();
            console.log("[NetworkManager] connected, sessionId=", this.sessionId);
            return true;
        } catch (e) {
            console.error("[NetworkManager] connection failed:", e);
            return false;
        }
    }

    disconnect() {
        if (this.room) this.room.leave();
        this.isConnected = false;
        this.room = null;
    }

    _setupHandlers() {
        const { room } = this;

        // シード受信（マップ生成用）
        room.onMessage("seed", ({ mapSeed }) => {
            this.mapSeed = mapSeed;
            if (this.onSeedReceived) this.onSeedReceived(mapSeed);
        });

        // ホストになった通知
        room.onMessage("becameHost", () => {
            this.isHost = true;
            if (this.onBecameHost) this.onBecameHost();
        });

        // ゲームイベント（戦闘結果・死亡・レベルアップなど）
        room.onMessage("tickEvents", events => {
            if (this.onTickEvents) this.onTickEvents(events);
        });

        // マップデータ（新規参加時にホストから転送されたデータ）
        room.onMessage("mapData", ({ floor, mapData }) => {
            if (this.onMapData) this.onMapData(floor, mapData);
        });

        // モンスター初期同期
        room.onMessage("syncMonsters", _data => {
            // 現状はサーバー state で管理するので不使用
        });

        // 状態変更（Colyseus の差分同期）
        room.onStateChange(state => {
            if (this.onStateChange) this.onStateChange(state);
        });

        // プレイヤー追加
        room.state.players.onAdd((playerState, sessionId) => {
            this.isHost = playerState.isHost && sessionId === this.sessionId;
            if (this.onPlayerJoined) this.onPlayerJoined(sessionId, playerState);
        });

        // プレイヤー削除
        room.state.players.onRemove((_playerState, sessionId) => {
            if (this.onPlayerLeft) this.onPlayerLeft(sessionId);
        });

        room.onLeave(() => {
            console.log("[NetworkManager] disconnected from room");
            this.isConnected = false;
        });
    }

    // プレイヤーアクション送信
    sendAction(action) {
        if (!this.isConnected || !this.room) return;
        this.room.send("action", action);
    }

    sendMove(direction) {
        this.sendAction({ type: 'move', direction });
    }

    sendChangeFloor(floorDir) {
        this.sendAction({ type: 'changeFloor', floorDir });
    }

    sendAttack(targetId) {
        this.sendAction({ type: 'attack', targetId });
    }

    // ホストがマップデータをサーバーに送る
    sendMapData(floor, mapData) {
        if (!this.isConnected || !this.room) return;
        this.room.send("mapData", { floor, mapData });
    }

    getState() {
        return this.room?.state ?? null;
    }

    getPlayers() {
        return this.room?.state?.players ?? null;
    }

    getFloors() {
        return this.room?.state?.floors ?? null;
    }
}

export default NetworkManager;
