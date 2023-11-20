import { EMITTYPE, ParticleEffect, SPAWNTYPE } from "pixi-particle-lib";

class EffectManager {
    constructor(core, container) {
        this.core = core;
        this.effects = {};
        this.effectPrims = {};
        this.container = container;
    }

    async add(_effects = {}) {
        // fetch操作を行うPromiseの配列を作成します
        const fetchPromises = Object.keys(_effects).map(async key => { // asyncを追加
            const { path, imageId } = _effects[key];
            try {
                const response = await fetch(path); // awaitを追加
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = await response.json(); // awaitを追加
                return { key, json, imageId }; // 正常に解決されたJSONデータを返す
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                return { key, json: null, imageId: null }; // エラーが発生した場合は、キーとともにnullを返す
            }
        });
        // Promise.allで全てのプロミスを同時に実行し、結果を待ちます
        const results = await Promise.all(fetchPromises);
        // 各JSONデータを処理します
        results.forEach(({ key, json, imageId }) => {
            if (json !== null) { // nullでない場合のみ設定
                json.imageId = imageId;
                this.effects[key] = json;
            }
        });
    }

    getParam(key) {
        return this.effects[key];
    }

    setEffectPrim({ key, x, y }) {
        const param = this.getParam(key);
        if (!(key in this.effectPrims)) this.effectPrims[key] = [];
        const effectPrim = new ParticleEffect({
            param,
            textures: this.core.textures.tx_main,
            x, y,
            isAutoDeserialize: true
        });
        this.effectPrims[key].push(effectPrim);
        this.container.addChild(effectPrim.getPrim());
        return effectPrim;
    }

    update(delta) {
        const keys = Object.keys(this.effectPrims);
        keys.forEach(key => {
            this.effectPrims[key].forEach(effect => effect.update(delta));
            this.effectPrims[key] = this.effectPrims[key].filter(effect => effect.isDead == false);
        });
    }

}
export default EffectManager;