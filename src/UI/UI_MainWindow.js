import UI_Window from "./UI_Window";

class UI_MainWindow extends UI_Window {
    constructor({ core,scene }) {
        super({
            x: 32,
            y: 32,
            core,
            scene
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
                    label: "そうび", action: this.selectEqipmentMenu
                },
                {
                    label: "つよさ", action: this.selectStatus
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
        this.inputMap['ArrowLeft'] = _ => this.scene.uiWindowManager.close();
    }

    selectItemMenu = _ => {
        const { scene: { uiWindowManager } } = this;
        console.log("どうぐ");
        uiWindowManager.openItemMenu();
    }

    selectEqipmentMenu = _ => {
        const { scene: { uiWindowManager } } = this;
        console.log("そうび");
        uiWindowManager.openEquipmentMenu();
    }

    selectStatus = _ => {
        const { scene: { uiWindowManager } } = this;
        console.log("つよさ");
        uiWindowManager.openStatusWindow();
    }

    open() {
        const { scene: { windowOpen } } = this;
        super.open();
        // coreにMainWindowの開閉状態を通知しておく
        windowOpen(this.isOpen);
    }

    close() {
        const { windowOpen } = this.scene;
        super.close();
        // coreにMainWindowの開閉状態を通知しておく
        windowOpen(this.isOpen);
    }
}

export default UI_MainWindow;