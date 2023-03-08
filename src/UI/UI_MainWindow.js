import UI_Window from "./UI_Window";

class UI_MainWindow extends UI_Window {
    constructor({ core }) {
        super({
            core, menu: [
                {
                    label: "どうぐ", action: _ => {
                        console.log("どうぐ")
                    }
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
        })
    }
}

export default UI_MainWindow;