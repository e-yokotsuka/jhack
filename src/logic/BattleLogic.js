import { diceRoll } from "../tools/Calc";
import { sound } from '@pixi/sound';

class BattleLogic {
    constructor(core) {
        this.core = core;
    }

    // イニシアティブを決める関数
    determineInitiative(acters) {
        return acters.sort((a, b) => {
            const rollA = diceRoll({ diceText: `1d20+dex`, status: a }); // 1d20 + 敏捷性修正値
            const rollB = diceRoll({ diceText: `1d20+dex`, status: b }); // 1d20 + 敏捷性修正値
            return rollB - rollA; // 降順にソート
        });
    }

    // 武器の攻撃判定
    checkHit({ offense, defense }) {
        const oDexRoll = diceRoll({ diceText: `1d20+dex`, status: offense });
        const dDexRoll = diceRoll({ diceText: `1d20+dex`, status: defense });
        return oDexRoll >= dDexRoll
    }

    // 魔法の攻撃判定
    checkMagicHit({ offense, defense }) {
        const oDexRoll = diceRoll({ diceText: `1d20+intl`, status: offense });
        const dDexRoll = diceRoll({ diceText: `1d20+intl`, status: defense });
        return oDexRoll >= dDexRoll
    }

    weponAttack({ offense, defense }) {
        const {
            weapon: oWepon,
            //ring: oRing,
        } = offense.equipments;
        const {
            armour: dArmour,
            //ring: sRing,
            shield: sShield,
        } = defense.equipments;
        offense.beforeAttack(oWepon, defense);
        const isHit = this.checkHit({ offense, defense });
        if (!isHit) {// 攻撃がはずれたら終了。
            offense.attackMissed(oWepon);
            return;
        }
        // 攻撃が当たった。
        const dmg = diceRoll({ diceText: `${oWepon.value}+str`, status: offense });
        let defenseValue = diceRoll({ diceText: `${dArmour.value}`, status: offense });
        defenseValue += diceRoll({ diceText: `${sShield.value}+con`, status: offense });
        const point = dmg - defenseValue;
        point > 0 ? defense.applyDamage({ point, target: offense }) : defense.blockAttack(offense)
    }

}

export default BattleLogic;