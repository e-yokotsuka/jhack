import { Container, Text } from 'pixi.js';

import { CheckBox } from '@pixi/ui';

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
        this.setPosition();
        this.container.addChild(this.soundCheckBox);
    }

    setPosition() {
        const size = this.core.getCanvasSize();
        this.soundCheckBox.x = size.width - this.soundCheckBox.width - 8;
        this.soundCheckBox.y = size.height - this.soundCheckBox.height - 8;
    }

    update(/*delta*/) {
        this.setPosition();
    }

    getPrim = _ => this.container;
}


export default UI_Common;