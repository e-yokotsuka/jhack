import UI_Window from "./UI_Window";

class UI_ItemWindow extends UI_Window {
    constructor({ core ,x=0,y=0}) {
        super({
            core,
            x,y,
            maxlabels:10,
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

    closeMenu = _ => this.isOpen && this.core.uiWindowManager.closeItemMenu()

    open(){
        const items = this.core.player.getItems();
        const menu = items.length? items.map((item,index) => ({
            label:item.itemName,
            action: _ => {
                this.core.uiWindowManager.openConfirmWindow(this,()=>{
                    const logic = new item.itemLogicClass(this.core,item);
                    const used = logic.use(this.core.getPlayer());
                    if(used) this.core.player.itemUsed(item,index);
                    this.closeMenu();
                });
            }
        })):[{
            label:"なにも持っていない！",
            action: _ => {
                console.log("なにも持っていない！");
                const {core:{uiWindowManager}} = this;
                uiWindowManager.closeItemMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
    }

    update = delta => super.update(delta);
    

}

export default UI_ItemWindow;