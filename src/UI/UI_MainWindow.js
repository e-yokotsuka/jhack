import UI_ItemWindow from "./UI_ItemWindow";
import UI_Window from "./UI_Window";

class UI_MainWindow extends UI_Window {
    constructor({ core }) {
        super({
            x: 32,
            y: 32,
            core
        });
        this.setMenu(
            [
                {
                    label: "どうぐ", action: this.selectItemMenu
                },
                {
                    label: "まほう", action: _ => {
                        console.log("まほう")
                    }
                },
                {
                    label: "そうび", action: _ => {
                        console.log("そうび")
                    }
                },
                {
                    label: "つよさ", action: _ => {
                        console.log("つよさ")
                    }
                },
                {
                    label: "すてる", action: _ => {
                        console.log("すてる")
                    }
                },
                {
                    label: "セーブ", action: _ => {
                        console.log("セーブ")
                    }
                },
            ]
        );
    }

    selectItemMenu = _ => {
        this.lock(true);
        console.log("どうぐ")
        const itemWindow = new UI_ItemWindow({ x:this.leftSideX() + 4 ,y:this.y,core: this.core,parent:this });
        this.addChild(itemWindow);
        itemWindow.open();
    }

    open(){
        const { core: { windowOpen }} = this;
        super.open();
        // coreにMainWindowの開閉状態を通知しておく
        windowOpen(this.isOpen);
    }

    close(){
        const { windowOpen } = this.core;
        super.close();
        // coreにMainWindowの開閉状態を通知しておく
        windowOpen(this.isOpen);
    }
}

export default UI_MainWindow;