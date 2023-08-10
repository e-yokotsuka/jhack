import { EQUIPPED_TEXT_COLOR } from '../define'
import UI_Window from "./UI_Window";

class UI_EquipmentWindow extends UI_Window {
    constructor({ core, x = 0, y = 0 }) {
        super({
            core,
            x, y,
            maxlabels: 10,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.closeMenu(),
            'w': _ => this.up(),
            's': _ => this.down(),
            'ArrowRight': _ => this.selected(),
            'ArrowUp': _ => this.up(),
            'ArrowDown': _ => this.down(),
        };
    }

    closeMenu = _ => this.isOpen && this.core.uiWindowManager.closeEquipmentMenu()

    open() {
        const { player } = this.core;
        const items = player.equipmentItems();
        const menu = items.length ? items.map((item, index) => {
            const isEquipped = player.isItemEquipped(item);
            return {
                label: item.itemName,
                color: isEquipped ? EQUIPPED_TEXT_COLOR : super.DEFAULT_TEXT_COLOR,
                action: _ => {
                    this.core.uiWindowManager.openConfirmWindow(this, () => {
                        const logic = new item.itemLogicClass(this.core, item);
                        const used = logic.equipment(this.core.getPlayer());
                        if (used) this.core.player.equipment(item, index);
                        this.closeMenu();
                    });
                }
            }
        }) : [{
            label: "装備できるものがない！",
            action: _ => {
                console.log("装備できるものがない！");
                const { core: { uiWindowManager } } = this;
                uiWindowManager.closeEquipmentMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
    }

}

export default UI_EquipmentWindow;