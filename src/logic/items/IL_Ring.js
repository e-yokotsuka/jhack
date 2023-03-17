
class IL_Ring {
    constructor(core,item) {
        this.item = item; // アイテム名
        this.core = core; // アイテム名
        this.use.bind(this);
    }

    use(/*target*/){
        const {itemName} = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    addText  = text => this.core.addText(text);
}

export default IL_Ring;