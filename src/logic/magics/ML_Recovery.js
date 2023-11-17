import ML_Common from "./ML_Common";
import { calculateMinMax } from "../../tools/Calc"
import { diceRoll } from "../../tools/Calc";

class ML_Recovery extends ML_Common {
    constructor(core, scene, magic) {
        super(core, scene, magic);
        this.use.bind(this);
        this.logicHandler = target => {
            const { value, mp } = this.magic;
            const { status } = target;
            if (status.maxHp <= status.hp) {
                if (Math.random() <= 0.1) {
                    target.useMp(mp);
                    this.addText(`無駄にMPを消費した！\nあなたはもっと頭を使うべきだ！`);
                    return mp;
                }
                this.addText(`残念！回復する意味がない！\nあなたはこれっぽちも傷ついていない！`);
                return 0;
            }
            const n = diceRoll({ diceText: value });
            target.healHp(n, this.magic);
            return mp;
        }
    }

    getStringValue(status) {
        const { magic } = this;
        if (magic.value.includes('%')) return magic.value;
        const minmax = calculateMinMax({ diceText: magic.value, status });
        return `${minmax.minValue}～${minmax.maxValue}`;
    }
}

export default ML_Recovery;