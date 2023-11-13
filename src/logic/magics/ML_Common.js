
class ML_Common {
    constructor(core, scene, magic) {
        this.magic = magic; // 魔法
        this.core = core;
        this.scene = scene;
        this.valueLabel = "値";
        this.logicHandler = () => { }
        this.use.bind(this);
    }

    use = target => {
        const { mp } = this.magic;
        const { status } = target;
        if (status.mp <= mp) {
            this.addText(`残念！MPが足りない！`);
            return false;
        }
        const mpUsed = this.logicHandler(target);
        target.useMp(mpUsed);
        return true;
    }


    addText = text => this.scene.addText(text);
    getStringValue() { return "" }
    effects() { console.log('ML Effects') }
}

export default ML_Common;