
class IL_Common {
    constructor(core, item) {
        this.item = item; // アイテム
        this.core = core;
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

    addText = text => this.core.addText(text);
}

export default IL_Common;