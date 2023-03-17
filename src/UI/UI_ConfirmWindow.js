import UI_Window from "./UI_Window";

class UI_ConfirmWindow extends UI_Window {
    constructor({ core ,x=0,y=0}) {
        super({
            core,
            x,y,
            maxlabels:10,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.closeMenu(),
            'ArrowRight': _ => this.selected(),
        };
    }

    closeMenu = _ => this.isOpen && this.core.uiWindowManager.closeConfirmWindow(this)

    open(use_action=_=>{}){
        const menu = [{
            label:"←使わない　/　使う→",
            action: _ => {
                const {core:{uiWindowManager}} = this;
                use_action();
                uiWindowManager.closeConfirmWindow(this);
            }
        }];
        this.setMenu(menu);
        super.open();
    }

    update = delta => super.update(delta);

}

export default UI_ConfirmWindow;