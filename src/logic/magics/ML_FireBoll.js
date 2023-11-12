import ML_Common from "./ML_Common";
import { calculateMinMax } from "../../tools/Calc"
import { diceRoll } from "../../tools/Calc";

class ML_FireBoll extends ML_Common {
    constructor(core, scene, magic) {
        super(core, scene, magic);
        this.use.bind(this);
        this.logicHandler = target => {
            const { value, mp } = this.magic;
            // あとで敵も使えるように
            const self = scene.getPlayer();
            const enemys = scene.getEnemiesInRange(self, 10);
            console.log(enemys)
            enemys.forEach(enemy => {
                // あとでバトルロジックへ移動
                const point = diceRoll({ diceText: value });
                console.log(`${value}=${point}`)
                console.log(enemy)
                enemy.applyDamage({ point, target: self });
                this.addText(`X: ${enemy.mapX} Y:${enemy.mapY}`);
                return;
            });
            target.useMp(mp);
        }
    }

    getStringValue(status) {
        const { magic } = this;
        if (magic.value.includes('%')) return magic.value;
        const minmax = calculateMinMax({ diceText: magic.value, status });
        return `${minmax.minValue}～${minmax.maxValue}`;
    }
}

export default ML_FireBoll;