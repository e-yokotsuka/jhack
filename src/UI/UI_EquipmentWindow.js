import { EQUIPPED_TEXT_COLOR } from '../define'
import UI_Window from "./UI_Window";

class UI_EquipmentWindow extends UI_Window {
    constructor({ core, scene, x = 0, y = 0 }) {
        super({
            core,
            scene,
            x, y,
            maxlabels: 10,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.closeMenu(),
            'w': _ => {
                this.up()
                this.selected();
            },
            's': _ => {
                this.down()
                this.selected();
            },
            'ArrowUp': _ => {
                this.up()
                this.selected();
            },
            'ArrowDown': _ => {
                this.down()
                this.selected();
            },
        };
    }

    closeMenu = _ => this.isOpen && this.scene.uiWindowManager.closeEquipmentMenu()

    open() {
        const player = this.scene.getPlayer();
        const items = player.equipmentItems();
        const menu = items.length ? items.map((item, index) => {
            const isEquipped = player.isItemEquipped(item);
            return {
                label: item.itemName,
                color: isEquipped ? EQUIPPED_TEXT_COLOR : super.DEFAULT_TEXT_COLOR,
                action: _ => {
                    this.scene.uiWindowManager.openItemStatusWindow(this, () => {
                        const logic = new item.itemLogicClass(this.core, this.scene, item);
                        const used = logic.equipment(player);
                        if (used) player.equipment(item, index);
                        this.closeMenu();
                    }, item);
                }
            }
        }) : [{
            label: "装備できるものがない！",
            action: _ => {
                const { scene: { uiWindowManager } } = this;
                uiWindowManager.closeEquipmentMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
        if (items.length) this.selected();
    }

}

export default UI_EquipmentWindow;