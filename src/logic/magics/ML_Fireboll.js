import ML_Common from "./ML_Common";
import { calculateMinMax } from "../../tools/Calc"
import { diceRoll } from "../../tools/Calc";

class ML_Fireboll extends ML_Common {
    constructor(core, scene, magic) {
        super(core, scene, magic);
        this.use.bind(this);
        this.logicHandler = _ => {
            const { value, mp, range } = this.magic;
            // あとで敵も使えるように
            const self = scene.getPlayer();
            const enemys = scene.getEnemiesInRange(self, range);
            for (const enemy of enemys) {
                // あとでバトルロジックへ移動
                const point = diceRoll({ diceText: value, status: self });
                enemy.showEffect({ key: 'fireboll', x: enemy.centerX, y: enemy.centerY })
                enemy.applyDamage({ point, target: self });
                this.addText(`X: ${enemy.mapX} Y:${enemy.mapY}MP:${mp}DAMAGE:${point}`);
                break;
            }
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

export default ML_Fireboll;