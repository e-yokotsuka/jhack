class EffectManager {
    constructor(core) {
        this.core = core;
        this.effects = {};
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
                console.log(json);
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

    getPatam(key) {
        return this.effects[key];
    }

}
export default EffectManager;