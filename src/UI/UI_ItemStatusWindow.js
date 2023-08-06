import { Graphics, Text } from 'pixi.js';

import UI_Window from "./UI_Window";

const CELL_SIZE = 32;
class UI_ItemStatusWindow extends UI_Window {
    constructor({ core, x = 0, y = 0 }) {
        super({
            core,
            x, y,
            w: CELL_SIZE * 20,
            h: CELL_SIZE * 10,
        });
        this.inputMap = {
            'ArrowRight': _ => this.selected(),
        };
        this.action = _ => { }
        this.item = {}
    }

    // override
    open(action = _ => { }, item = {}) {
        this.action = action;
        this.item = item;

        const itemText =
            `アイテム名：${item.itemName}
アイテムタイプ：${item.itemTypeName}
${item.valueLabel}：${item.value}
`;

        const container = this.prim;
        container.removeChildren();
        const text = new Text(itemText, {
            fontSize: 28,
            fill: 0xffffff,
            align: 'left',
            lineHeight: 32
        });
        text.setTransform(this.x + 8, this.y + 4)


        const panel = new Graphics();
        panel.lineStyle(2, 0xFFFFFF, 1);
        panel.beginFill(0x650A5A, 0.25);
        panel.drawRoundedRect(this.x, this.y, this.w, this.h + 4, 4);
        panel.endFill();

        container.addChild(panel)
        container.addChild(text)

        const cursol = new Graphics();
        cursol.lineStyle(2, 0xFFFFFF, 1);
        cursol.drawRoundedRect(this.x + 2, this.y, this.w - 4, CELL_SIZE, 2);
        container.addChild(cursol)

        this.text = text;
        this.panel = panel;
        this.cursol = cursol;
        this.isOpen = true;
        this.unLock();
        this.selectUpdate(this.select);
    }

    // override
    selected() {
        const { isOpen } = this;
        if (!isOpen) return;
        this.action(this.item);
    }

    update = delta => super.update(delta);

}

export default UI_ItemStatusWindow;