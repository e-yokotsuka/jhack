import EL_Common from "./EL_Common";
import { diceRoll } from "../../tools/Calc";

class EL_Sleep extends EL_Common {
    constructor(core, scene, effect, target) {
        super(core, scene, effect, target)
        this.turn = diceRoll({ diceText: effect.value });
    }

    stepUpdate() {
        const { target } = this;
        const oActorRoll = diceRoll({ diceText: `1d6+intl`, status: this.target });
        const oMagicRoll = diceRoll({ diceText: `1d20` });
        const isClear = oMagicRoll < oActorRoll || (this.turn-- <= 0);
        isClear ? this.addText(`${target.characterName}の目が覚めた！`) : this.addText(`${target.characterName}は寝ている！ぐーすかぴー(${this.turn})`)
        this.effect.isEffectCleared = isClear;
    }

    onDamageReaction() {
        const { target } = this;
        const oActorRoll = diceRoll({ diceText: `1d20+intl`, status: this.target });
        const oMagicRoll = diceRoll({ diceText: `1d10` });
        const isClear = oMagicRoll < oActorRoll;
        isClear || this.addText(`痛すぎて ${target.characterName} の目が覚めた！`)
        this.effect.isEffectCleared = isClear;
    }

    addText = text => this.scene.addText(text);
    getStringValue() { return "" }
    effects() { console.log('ML Effects') }
}

export default EL_Sleep