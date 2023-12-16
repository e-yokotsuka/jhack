
class EL_Common {
    constructor(core, scene, effect) {
        this.effect = effect; // 効果
        this.core = core;
        this.scene = scene;
        this.logicHandler = () => { }
    }

    stepUpdate() { console.log("ステップが更新されるたびに呼ぶ") }
    OnDamageReaction() { console.log("ダメージを食らった時のリアクション。眠りから目覚めるなど") }


    addText = text => this.scene.addText(text);
    getStringValue() { return "" }
    effects() { console.log('ML Effects') }
}

export default EL_Common;