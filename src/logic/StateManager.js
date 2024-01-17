import { Sprite } from 'pixi.js';

class StateManager {

    constructor(core, container) {
        this.core = core;
        this.container = container;
    }

    updateState(effects) {
        this.container.removeChildren();
        const { textures: { tx_main } } = this.core;
        effects.forEach(({ texture }) => {
            const sprite = new Sprite(tx_main[`${texture}`]);
            this.container.addChild(sprite);
        })
    }

    update(/* delta */) {
    }

}
export default StateManager;