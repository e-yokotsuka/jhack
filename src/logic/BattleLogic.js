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

    getRandomBonus(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateNextExp(level) {
        return Math.pow(level, 2) * 100;
    }

    levelup({ offense }) {
        const { status, addText, characterName } = offense;
        if (status.exp >= status.nextExp) {
            status.lv++;
            addText(`${characterName} は ${status.lv} にレベルアップ！`);
            status.nextExp = status.exp + this.calculateNextExp(status.lv);
            // ステータスを一定値 + ランダムな値で増やす
            const hp = 2 + this.getRandomBonus(0, 5 + status.str / 10);
            const mp = 2 + this.getRandomBonus(0, 3 + status.intl / 10);
            const str = 2 + this.getRandomBonus(0, 3);
            const dex = 2 + this.getRandomBonus(0, 3);
            const con = 2 + this.getRandomBonus(0, 3);
            const intl = 2 + this.getRandomBonus(0, 3);
            const wiz = 2 + this.getRandomBonus(0, 3);
            const cha = 2 + this.getRandomBonus(0, 3);
            status.maxHp += hp;
            status.maxMp += mp;
            status.str += str;
            status.dex += dex;
            status.con += con;
            status.intl += intl;
            status.wiz += wiz;
            status.cha += cha;
            addText(`${characterName}の HPが ${hp} あがった！`);
            addText(`${characterName}の MPが ${mp} あがった！`);
            addText(`${characterName}の 強さが ${str} あがった！`);
            addText(`${characterName}の 俊敏さが ${dex} あがった！`);
            addText(`${characterName}の 強靭さが ${con} あがった！`);
            addText(`${characterName}の 知性が ${intl} あがった！`);
            addText(`${characterName}の 知恵が ${wiz} あがった！`);
            addText(`${characterName}の カリスマが ${cha} あがった！`);
        }
    }

}

export default BattleLogic;