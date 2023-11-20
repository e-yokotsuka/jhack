import { EQUIPPED_TEXT_COLOR } from '../define'
import UI_Window from "./UI_Window";

class UI_ItemWindow extends UI_Window {
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
            'ArrowRight': _ => _ => { },
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

    closeMenu = _ => this.isOpen && this.scene.uiWindowManager.closeItemMenu()

    open() {
        const player = this.scene.getPlayer();
        const items = player.items();
        const menu = items.length ? items.map((item, index) => {
            const isEquipped = player.isItemEquipped(item);
            return {
                label: item.itemName,
                color: isEquipped ? EQUIPPED_TEXT_COLOR : super.DEFAULT_TEXT_COLOR,
                action: _ => {
                    this.scene.uiWindowManager.openItemStatusWindow(this, () => {
                        const logic = new item.itemLogicClass(this.core, this.scene, item);
                        const used = logic.use(player);
                        if (used) this.scene.player.itemUsed(item, index);
                        this.closeMenu();
                    }, item);
                }
            }
        }) : [{
            label: "なにも持っていない！",
            action: _ => {
                const { core: { uiWindowManager } } = this;
                uiWindowManager.closeItemMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
        if (items.length) this.selected();
    }

}

export default UI_ItemWindow;