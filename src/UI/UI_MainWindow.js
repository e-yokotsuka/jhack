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
        const {core:{uiWindowManager}} = this;
        console.log("どうぐ");
        uiWindowManager.openItemMenu();
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