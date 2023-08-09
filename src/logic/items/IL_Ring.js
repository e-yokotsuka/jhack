import IL_Common from "./IL_Common";

class IL_Ring extends IL_Common {
    constructor(core, item) {
        super(core, item);
    }

    use(/*target*/) {
        const { itemName } = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    equipment(actor) {
        const { itemName } = this.item;
        actor.equipment(this.item);
        this.addText(`${itemName}をそっと薬指にはめた。少しどきどきした。`);
    }
}

export default IL_Ring;