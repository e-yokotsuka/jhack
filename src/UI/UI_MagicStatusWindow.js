import { Graphics, Text } from 'pixi.js';

import { CELL_SIZE } from "../define";
import { MAGIC_ATTRIBUTE_NAME } from '../data/MS_Magics';
import UI_Window from "./UI_Window";

class UI_MagicStatusWindow extends UI_Window {
    constructor({ core, scene, x = 0, y = 0 }) {
        super({
            core,
            scene,
            x, y,
            w: CELL_SIZE * 20,
            h: CELL_SIZE * 10,
        });
        this.inputMap = {
            'ArrowRight': _ => this.selected(),
        };
        this.action = _ => { }
        this.magic = {}
    }

    // override
    open(action = _ => { }, magic = {}) {
        const { status } = this.scene.getPlayer();
        this.action = action;
        this.magic = magic;
        const logic = new magic.magicLogicClass(this.core, this.scene, magic);
        const stringValue = logic.getStringValue(status);
        const magicText = `
魔法名：${magic.magicName}
魔法タイプ：${magic.magicTypeName}
魔法属性：${MAGIC_ATTRIBUTE_NAME[magic.magicAttribute]}
${magic.valueLabel}：${stringValue}
`.replace(/^\s+/, '');

        const container = this.prim;
        container.removeChildren();
        const text = new Text(magicText, {
            fontSize: 28,
            fill: 0xffffff,
            align: 'left',
            lineHeight: CELL_SIZE
        });
        text.setTransform(this.x + 8, this.y + 4)


        const panel = new Graphics();
        panel.lineStyle(2, 0xFFFFFF, 1);
        panel.beginFill(0x011896, 0.75);
        panel.drawRoundedRect(this.x, this.y, this.w, this.h + 4, 4);
        panel.endFill();

        container.addChild(panel)
        container.addChild(text)

        this.textPrim = text;
        this.panelPrim = panel;
        this.isOpen = true;
        // 同一フレームでウインドウのオープン処理が起きないように
        this.delayFrame = 1;
        this.unLock();
    }

    // override
    selected() {
        const { isOpen } = this;
        if (!isOpen) return;
        this.action(this.magic);
    }
}

export default UI_MagicStatusWindow;