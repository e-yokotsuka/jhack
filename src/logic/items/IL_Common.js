
class IL_Common {
    constructor(core,item) {
        this.item = item; // アイテム名
        this.core = core; // アイテム名
        this.use.bind(this);
    }

    use(/*target*/){
        console.warn(`Logic is not implemented. - ${this.itemName}`);
    }

    addText  = text => this.core.addText(text);
}

export default IL_Common;