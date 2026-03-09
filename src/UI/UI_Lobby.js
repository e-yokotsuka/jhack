import { Container, Graphics, Text } from "pixi.js";
import NetworkManager from "../network/NetworkManager";

const W = 420;
const H = 320;
const BG = 0x0a0a2a;
const BORDER = 0x4444cc;
const BTN_COLOR = 0x2244aa;
const BTN_HOVER = 0x3366cc;

/**
 * UI_Lobby
 * マルチプレイ参加用のロビー画面。
 * 「シングル」「マルチ（ホスト/参加）」を選択する。
 */
class UI_Lobby {
    constructor({ core, onSingle, onMulti, onConnecting = () => {}, onConnectFailed = () => {} }) {
        this.core = core;
        this.onSingle = onSingle;
        this.onMulti = onMulti;  // (networkManager) => void
        this.onConnecting = onConnecting;
        this.onConnectFailed = onConnectFailed;

        this.prim = new Container();
        this.nameValue = "Player";
        this.serverValue = "wss://jhack-server.fly.dev";
        this._build();
    }

    _build() {
        const { prim } = this;

        // 半透明オーバーレイ
        const overlay = new Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, 9999, 9999);
        overlay.endFill();
        prim.addChild(overlay);

        // パネル
        const panel = new Graphics();
        panel.lineStyle(2, BORDER);
        panel.beginFill(BG, 0.97);
        panel.drawRoundedRect(0, 0, W, H, 10);
        panel.endFill();
        this.panel = panel;
        prim.addChild(panel);

        // タイトル
        const title = new Text('jhack - マルチプレイ', {
            fontSize: 22, fill: 0xFFFFFF, fontWeight: 'bold'
        });
        title.x = W / 2 - title.width / 2;
        title.y = 18;
        panel.addChild(title);

        // プレイヤー名ラベル
        const nameLabel = new Text('プレイヤー名:', { fontSize: 14, fill: 0xCCCCCC });
        nameLabel.x = 24;
        nameLabel.y = 68;
        panel.addChild(nameLabel);

        // 名前入力（疑似入力フィールド）
        this.nameField = this._buildTextField(24, 88, W - 48, this.nameValue);
        panel.addChild(this.nameField.container);

        // サーバーURLラベル
        const urlLabel = new Text('サーバーアドレス:', { fontSize: 14, fill: 0xCCCCCC });
        urlLabel.x = 24;
        urlLabel.y = 138;
        panel.addChild(urlLabel);

        // サーバーURL入力
        this.serverField = this._buildTextField(24, 158, W - 48, this.serverValue);
        panel.addChild(this.serverField.container);

        // ボタン群
        this.singleBtn = this._buildButton(24, 218, 110, 44, 'シングル', 0x226622, () => {
            this._hide();
            this.onSingle();
        });
        this.multiBtn = this._buildButton(154, 218, 110, 44, 'マルチ参加', BTN_COLOR, () => this._joinMulti());
        this.cancelBtn = this._buildButton(W - 134, 218, 110, 44, 'キャンセル', 0x442222, () => {
            this._hide();
            this.onSingle();
        });

        panel.addChild(this.singleBtn);
        panel.addChild(this.multiBtn);
        panel.addChild(this.cancelBtn);

        // ステータステキスト
        this.statusText = new Text('', { fontSize: 12, fill: 0xFFFF44 });
        this.statusText.x = 24;
        this.statusText.y = 280;
        panel.addChild(this.statusText);

        // キーボード入力処理
        this._activeField = null;
        window.addEventListener('keydown', e => this._onKeyDown(e));
    }

    _buildTextField(x, y, w, defaultVal) {
        const container = new Container();
        const bg = new Graphics();
        bg.lineStyle(1, 0x6666cc);
        bg.beginFill(0x111133);
        bg.drawRoundedRect(0, 0, w, 32, 4);
        bg.endFill();
        bg.eventMode = 'static';
        bg.cursor = 'text';

        const txt = new Text(defaultVal, { fontSize: 13, fill: 0xFFFFFF });
        txt.x = 8;
        txt.y = 8;

        const field = { container, bg, txt, value: defaultVal };
        bg.on('click', () => { this._activeField = field; bg.lineStyle(1, 0xFFFFFF); });
        container.addChild(bg);
        container.addChild(txt);
        container.x = x;
        container.y = y;
        return field;
    }

    _buildButton(x, y, w, h, label, color, onClick) {
        const btn = new Graphics();
        btn.lineStyle(1, 0xFFFFFF, 0.5);
        btn.beginFill(color);
        btn.drawRoundedRect(0, 0, w, h, 6);
        btn.endFill();
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.x = x;
        btn.y = y;

        const lbl = new Text(label, { fontSize: 14, fill: 0xFFFFFF });
        lbl.x = w / 2 - lbl.width / 2;
        lbl.y = h / 2 - lbl.height / 2;
        btn.addChild(lbl);

        btn.on('click', onClick);
        btn.on('pointerover', () => { btn.tint = 0xCCCCCC; });
        btn.on('pointerout', () => { btn.tint = 0xFFFFFF; });
        return btn;
    }

    _onKeyDown(e) {
        if (!this.prim.visible || !this._activeField) return;
        const field = this._activeField;
        if (e.key === 'Backspace') {
            field.value = field.value.slice(0, -1);
        } else if (e.key.length === 1) {
            field.value += e.key;
        }
        field.txt.text = field.value;
    }

    async _joinMulti() {
        this.statusText.text = '接続中...';
        this.onConnecting();
        const nm = new NetworkManager();
        const ok = await nm.connect(
            this.serverField.value,
            this.nameField.value || 'Player',
            'human'
        );
        if (ok) {
            this.statusText.text = '接続成功！';
            this._hide();
            this.onMulti(nm);
        } else {
            this.statusText.text = '接続失敗。サーバーが起動しているか確認してください。';
            this.onConnectFailed();
        }
    }

    _hide() {
        this.prim.visible = false;
    }

    show() {
        this.prim.visible = true;
    }

    resize(width, height) {
        this.panel.x = Math.floor((width - W) / 2);
        this.panel.y = Math.floor((height - H) / 2);
    }

    getPrim() { return this.prim; }
}

export default UI_Lobby;
