import IL_Common from "./IL_Common";

class IL_Armour extends IL_Common {
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
        this.addText(`${itemName}を装備したぞ！`);
    }

}

export default IL_Armour;