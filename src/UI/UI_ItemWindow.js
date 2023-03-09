import UI_Window from "./UI_Window";

class UI_ItemWindow extends UI_Window {
    constructor({ core ,x=0,y=0}) {
        super({
            core,
            x,y,
            maxlabels:10,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.isOpen && this.core.uiWindowManager.closeItemMenu(),
            'w': _ => this.up(),
            's': _ => this.down(),
            'ArrowRight': _ => this.selected(),
            'ArrowUp': _ => this.up(),
            'ArrowDown': _ => this.down(),      
        };
    }

    open(){
        const items = this.core.player.getItems();
        const menu = items.length? items.map(({itemName}) => ({
            label:itemName,
            action: _ => {
                console.log(itemName)
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

    update = (/*delta*/) => {
        const { core:{ input },inputMap } = this;   
        const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
        if (key) inputMap[key]();
    }
}

export default UI_ItemWindow;