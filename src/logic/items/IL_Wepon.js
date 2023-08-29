import MS_Item, { ITEM_TYPE } from "../../data/MS_Item";

import { EMPTY_ITEM_INDEX } from "../../define"
import IL_Common from "./IL_Common";
import { calculateMinMax } from "../../tools/Calc"

class IL_Wepon extends IL_Common {
    constructor(core, scene, item) {
        super(core, scene, item);
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
            actor.equipment(MS_Item[EMPTY_ITEM_INDEX], ITEM_TYPE.weapon);
            this.addText(`${itemName}を外した！`);
        } else {
            actor.equipment(equipItem);
            this.addText(`${itemName}を装備したぞ！`);
        }
    }

    getStringValue(status) {
        const { item } = this;
        const minmax = calculateMinMax({ diceText: item.value, status });
        return `${minmax.minValue}～${minmax.maxValue}`;
    }

}

export default IL_Wepon;