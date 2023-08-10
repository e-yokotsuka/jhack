import IL_Common from "./IL_Common";

class IL_Scroll extends IL_Common {
    constructor(core,scene, item) {
        super(core,scene, item);
    }

    use(/*target*/) {
        const { itemName } = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    addText = text => this.core.addText(text);

    getStringValue() {
        const { item } = this;
        return `${item.value}`;
    }
}

export default IL_Scroll;