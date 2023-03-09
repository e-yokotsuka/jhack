import UI_Window from "./UI_Window";

class UI_ItemWindow extends UI_Window {
    constructor({ core ,x=0,y=0}) {
        const items = core.player.getItems();
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
        super({
            core,
            x,y,
            maxlabels:10,
        });
        this.setMenu(menu);
    }
}

export default UI_ItemWindow;