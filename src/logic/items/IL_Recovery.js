import IL_Common from "./IL_Common";
import { calculateMinMax } from "../../tools/Calc"
import { diceRoll } from "../../tools/Calc";

class IL_Recovery extends IL_Common {
    constructor(core, scene, item) {
        super(core, scene, item);
        this.use.bind(this);
    }
    use = target => {
        const { value } = this.item;
        const { itemName } = this.item;
        const { status } = target;
        if (status.maxHp <= status.hp) {
            if (Math.random() <= 0.1) {
                this.addText(`無駄に${itemName}を消費した！\nあなたはもっと頭を使うべきだ！`);
                return true;
            }
            this.addText(`残念！回復する意味がない！\nあなたはこれっぽちも傷ついていない！`);
            return false;
        }
        const n = diceRoll({ diceText: value });
        target.healHp(n, this.item);
        return true;
    }

    getStringValue(status) {
        const { item } = this;
        if (item.value.includes('%')) return item.value;
        const minmax = calculateMinMax({ diceText: item.value, status });
        return `${minmax.minValue}～${minmax.maxValue}`;
    }
}

export default IL_Recovery;