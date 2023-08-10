import MS_Item, { ITEM_TYPE } from "../../data/MS_Item";

import { EMPTY_ITEM_INDEX } from "../../define"
import IL_Common from "./IL_Common";

class IL_Armour extends IL_Common {
    constructor(core,scene, item) {
        super(core,scene, item);
    }

    use(/*target*/) {
        const { itemName } = this.item;
        this.addText(`うーん、${itemName}は使うもんじゃぁないな`);
    }

    equipment(actor) {
        const { item } = this;
        const { itemName } = item;
        let equipItem = item;
        if (actor.isItemEquipped(item)) {
            actor.equipment(MS_Item[EMPTY_ITEM_INDEX], ITEM_TYPE.armour);
            this.addText(`${itemName}を脱いだ！すっきりした！`);
        } else {
            actor.equipment(equipItem);
            this.addText(`${itemName}を装着したぞ！`);
        }
    }

    getStringValue() {
        const { item } = this;
        return `${item.value}`;
    }
}

export default IL_Armour;