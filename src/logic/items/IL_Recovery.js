import IL_Common from "./IL_Common";
import { diceRoll } from "../../tools/Calc";

class IL_Recovery extends IL_Common {
    constructor(core, item) {
        super(core, item);
    }

    use = target => {
        const { value } = this.item;
        const { itemName } = this.item;
        const { status, healHp } = target;
        if (status.maxHp <= status.hp) {
            if (Math.random() <= 0.1) {
                this.addText(`無駄に${itemName}を消費した！\nあなたはもっと頭を使うべきだ！`);
                return true;
            }
            this.addText(`残念！回復する意味がない！\nあなたはこれっぽちも傷ついていない！`);
            return false;
        }
        const n = diceRoll(value);
        healHp(n, this.item);
        return true;
    }
}

export default IL_Recovery;