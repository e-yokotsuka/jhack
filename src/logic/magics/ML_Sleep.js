import ML_Common from "./ML_Common";
import { calculateMinMax } from "../../tools/Calc"

class ML_Sleep extends ML_Common {
    constructor(core, scene, magic) {
        super(core, scene, magic);
        this.use.bind(this);
        this.logicHandler = _ => {
            const { value, mp, range } = this.magic;
            // あとで敵も使えるように
            const self = scene.getPlayer();
            this.addText(`${self.characterName} は、眠りの魔法を使った！`);
            this.addText(`効果範囲：${range}`);
            const enemys = scene.getEnemiesInRange(self, range);
            for (const enemy of enemys) {
                const hit = scene.savingThrow({
                    offense: self,
                    defense: enemy,
                    offenseDiceText: value,
                    defenseDiceText: '1d4+intl'
                })
                scene.showEffect({ key: 'fireboll', x: enemy.cx, y: enemy.cy })
                if (!hit) continue;
                enemy.doSleep(); // 眠った
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

export default ML_Sleep;