import { CELL_SIZE, HP_MAX_DIGITS, LV_MAX_DIGITS, MAX_NAME_LENGTH, MP_MAX_DIGITS } from "../define";
import { Graphics, Text } from 'pixi.js';

import UI_Window from "./UI_Window";
import { calculateModifier } from "../tools/Calc";
import { padEnd } from '../tools/Formatter'

class UI_StatusWindow extends UI_Window {
    constructor({ core, scene, x = 0, y = 0 }) {
        super({
            core,
            scene,
            x, y,
            w: CELL_SIZE * 20,
            h: CELL_SIZE * 15,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.isOpen && this.scene.uiWindowManager.closeStatusWindow(),
        };
        this.action = _ => { }
    }

    // override
    open() {
        const status = this.scene.getPlayerStatus();
        const { armour, weapon, ring, shield } = status.equipments;
        const itemText =
            `レベル：${padEnd(status.lv, LV_MAX_DIGITS, " ")} 名前：${padEnd(status.name, MAX_NAME_LENGTH)}
HP：${padEnd(status.hp, HP_MAX_DIGITS, " ")}/${padEnd(status.maxHp, HP_MAX_DIGITS, " ")} MP：${padEnd(status.mp, MP_MAX_DIGITS, " ")}/${padEnd(status.maxMp, MP_MAX_DIGITS, " ")}
強さ:${status.str}(${calculateModifier(status.str, status.modifiers.str)})
俊敏さ:${status.dex}(${calculateModifier(status.dex, status.modifiers.dex)})
強靭さ:${status.con}(${calculateModifier(status.con, status.modifiers.con)})
知性:${status.intl}(${calculateModifier(status.intl, status.modifiers.intl)})
知恵:${status.wiz}(${calculateModifier(status.wiz, status.modifiers.wiz)})
カリスマ:${status.cha}(${calculateModifier(status.cha, status.modifiers.cha)})

  武器：${weapon.itemName}
  鎧  ：${armour.itemName}
  盾  ：${shield.itemName}
  指輪：${ring.itemName}

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

}

export default UI_StatusWindow;