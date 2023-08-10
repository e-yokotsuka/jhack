
class IL_Common {
    constructor(core,scene, item) {
        this.item = item; // アイテム
        this.core = core;
        this.scene = scene;
        this.valueLabel = "値";
        this.use.bind(this);
    }

    use(/*target*/) {
        const { itemName } = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    equipment() {
        const { itemName } = this.item;
        this.addText(`${itemName}は、装備できない！だいじょうぶか？`);
    }

    addText = text => this.scene.addText(text);
    getStringValue() { return "" }

}

export default IL_Common;