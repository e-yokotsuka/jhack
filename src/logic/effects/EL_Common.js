
class EL_Common {
    constructor(core, scene, effect, target) {
        this.effect = effect; // 効果
        this.core = core;
        this.scene = scene;
        this.target = target;
        this.isEffectCleared = false;
    }

    stepUpdate() { console.log("ステップが更新されるたびに呼ぶ") }
    onDamageReaction() { console.log("ダメージを食らった時のリアクション。眠りから目覚めるなど") }


    addText = text => this.scene.addText(text);
    getStringValue() { return "" }
    effects() { console.log('ML Effects') }
}

export default EL_Common;