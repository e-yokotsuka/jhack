import { sound } from '@pixi/sound';

class CommonScene {
    constructor({ core, sceneId }) {
        this.core = core;
        this.app = core.app;
        this.sound = sound;
        this.input = core.input;
        this.sceneId = sceneId;
    }

    getSceneId() { return this.sceneId }

    async Load() {
        return await true;//あとで非同期処理が必要になるかもしれないので非同期関数としておく。
    }

    Initialize() { }

    main(/* delta */) { }

    async Start() { await true; }

    Stop() { }

    resize(/* width, height*/) { }

    // muteの状態が変化した時に呼ばれる
    onMute(/* isMute */) { }
}

export default CommonScene;