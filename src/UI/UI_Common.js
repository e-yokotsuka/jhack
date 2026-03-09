import { Container, Graphics, Text } from 'pixi.js';

import { CheckBox } from '@pixi/ui';

const STATUS_CONFIG = {
    disconnected: { color: 0x888888, label: '● オフライン' },
    connecting:   { color: 0xFFDD00, label: '● 接続中...' },
    connected:    { color: 0x44FF44, label: '● オンライン' },
    error:        { color: 0xFF4444, label: '● 切断' },
};

// 全画面（シーン）共通のUI
class UI_Common {
    constructor({ core, muteSwitchCallback = _ => { } }) {
        console.assert(core);
        this.core = core;
        this.container = new Container();
        this.soundCheckBox = new CheckBox({
            text: '',
            checked: true,
            style: {
                unchecked: core.createSpriteByName('ui_sound_on'),
                checked: core.createSpriteByName('ui_sound_off'),
            }
        });
        this.soundCheckBox.onCheck.connect((checked) => muteSwitchCallback(checked));

        // 接続ステータス
        this._statusBg = new Graphics();
        this._statusText = new Text('', { fontSize: 12, fill: 0x888888 });
        this._statusText.x = 8;
        this._statusText.y = 4;
        this._statusBg.addChild(this._statusText);
        this.container.addChild(this._statusBg);
        this.setConnectionStatus('disconnected');

        this.setPosition();
        this.container.addChild(this.soundCheckBox);
    }

    setConnectionStatus(status) {
        const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected;
        this._statusText.style.fill = cfg.color;
        this._statusText.text = cfg.label;
        this._statusBg.clear();
        this._statusBg.beginFill(0x000000, 0.55);
        this._statusBg.drawRoundedRect(0, 0, this._statusText.width + 16, this._statusText.height + 8, 4);
        this._statusBg.endFill();
    }

    setPosition() {
        const size = this.core.getCanvasSize();
        this.soundCheckBox.x = size.width - this.soundCheckBox.width - 8;
        this.soundCheckBox.y = size.height - this.soundCheckBox.height - 8;
        this._statusBg.x = size.width - this._statusBg.width - 8;
        this._statusBg.y = 8;
    }

    update(/*delta*/) {
        this.setPosition();
    }

    getPrim = _ => this.container;
}


export default UI_Common;