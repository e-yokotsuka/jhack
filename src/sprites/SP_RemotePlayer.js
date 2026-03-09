import { CELL_SIZE } from "../define";
import { Container, Sprite, Text } from "pixi.js";
import UI_ProgressBar from "../ui/UI_ProgressBar";

/**
 * SP_RemotePlayer
 * 他プレイヤーをレンダリングするスプライト。
 * 位置・HP は NetworkManager 経由でサーバーから受け取る。
 */
class SP_RemotePlayer {
    constructor({ core, scene, sessionId, playerState }) {
        this.core = core;
        this.scene = scene;
        this.sessionId = sessionId;
        this.playerState = playerState;

        this.mapX = playerState.mapX;
        this.mapY = playerState.mapY;
        this.floor = playerState.floor;
        this.isDead = false;

        this._buildPrim();

        // サーバー状態変化を監視
        playerState.onChange(() => this._onStateChange());
    }

    _buildPrim() {
        const { core, playerState } = this;
        const { textures: { tx_main } } = core;

        const container = new Container();
        const sprite = new Sprite(tx_main[playerState.skin ?? 'human']);
        sprite.eventMode = 'auto';

        // 名前ラベル
        const nameLabel = new Text(playerState.name ?? '', {
            fontSize: 10,
            fill: 0x00FFFF,
            align: 'center',
        });
        nameLabel.x = CELL_SIZE / 2 - nameLabel.width / 2;
        nameLabel.y = -14;

        // HPバー
        this.progressHp = new UI_ProgressBar({
            core,
            y: 32,
            borderColor: "#000000",
            width: 33,
            height: 3,
        });

        container.addChild(sprite);
        container.addChild(nameLabel);
        container.addChild(this.progressHp.getPrim());

        this.container = container;
        this._updateHpBar();
    }

    _onStateChange() {
        const { playerState } = this;
        this.mapX = playerState.mapX;
        this.mapY = playerState.mapY;
        this.floor = playerState.floor;
        this.isDead = playerState.isDead;
        this._updateHpBar();
    }

    _updateHpBar() {
        const { playerState } = this;
        if (!this.progressHp) return;
        const pct = playerState.maxHp > 0 ? (playerState.hp / playerState.maxHp) * 100 : 0;
        this.progressHp.setValue(pct);
    }

    getPrim() {
        return this.container;
    }

    update(_delta) {
        const { scene, mapX, mapY, floor, container } = this;
        const mainMap = scene.mainMap;

        // 同じフロアにいるときだけ表示
        const sameFloor = floor === scene.level;
        container.visible = sameFloor && !this.isDead;

        if (sameFloor && mainMap) {
            container.x = mainMap.mapContainer.x + mapX * CELL_SIZE;
            container.y = mainMap.mapContainer.y + mapY * CELL_SIZE;
        }
    }
}

export default SP_RemotePlayer;
