import UI_Window from "./UI_Window";

class UI_ItemWindow extends UI_Window {
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

    closeMenu = _ => this.isOpen && this.core.uiWindowManager.closeItemMenu()

    open() {
        const items = this.core.player.items();
        const menu = items.length ? items.map((item, index) => ({
            label: item.itemName,
            action: _ => {
                this.core.uiWindowManager.openItemStatusWindow(this, () => {
                    const logic = new item.itemLogicClass(this.core, item);
                    const used = logic.use(this.core.getPlayer());
                    if (used) this.core.player.itemUsed(item, index);
                    this.closeMenu();
                }, item);
            }
        })) : [{
            label: "なにも持っていない！",
            action: _ => {
                console.log("なにも持っていない！");
                const { core: { uiWindowManager } } = this;
                uiWindowManager.closeItemMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
        if (items.length) this.selected();
    }

    update = delta => {
        super.update(delta);
        // もう構造が複雑なのでウインドウ系は組みなおす！これはその場しのぎ！
        this.core.uiWindowManager.itemStatusWindow.update(delta);
    }


}

export default UI_ItemWindow;