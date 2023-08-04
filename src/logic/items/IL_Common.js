
class IL_Common {
    constructor(core, item) {
        this.item = item; // アイテム名
        this.core = core; // アイテム名
        this.use.bind(this);
    }

    use(/*target*/) {
        const { itemName } = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    eqipment() {
        const { itemName } = this.item;
        this.addText(`${itemName}を装備したぞ！`);
    }

    addText = text => this.core.addText(text);
}

export default IL_Common;