import { ITEM_TYPE } from "../data/MS_Item";
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
        const items = this.core.player.items().filter(({ itemType }) => [
            ITEM_TYPE.armour,
            ITEM_TYPE.weapon,
            ITEM_TYPE.ring,
            ITEM_TYPE.shield
        ].includes(itemType));
        const menu = items.length ? items.map((item, index) => ({
            label: item.itemName,
            action: _ => {
                this.core.uiWindowManager.openConfirmWindow(this, () => {
                    const logic = new item.itemLogicClass(this.core, item);
                    const used = logic.equipment(this.core.getPlayer());
                    if (used) this.core.player.equipment(item, index);
                    this.closeMenu();
                });
            }
        })) : [{
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