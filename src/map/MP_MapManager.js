import { ABYSS_LEVEL_INDEX, MAX_DUNGEON_LEVEL } from "../define";

import MP_AutoMap from '../map/MP_AutoMap';

class MP_MapManager {
    constructor({ core, scene }) {
        this.isDebugViewCollision = false;
        this.core = core;
        this.scene = scene;
        this.levelMap = [];
        this.makeLevelMap();
    }

    makeLevelMap = _ => {
        const { core } = this;
        const scene = this;
        Array.from({ length: MAX_DUNGEON_LEVEL }, (_, level) => {
            this.levelMap.push(new MP_AutoMap({ core, scene, level }))
        })
        // 事後処理を行う（ダンジョンを繋ぎ合わせるなど)
        this.afterProcessing();
    }

    createAndConnectStairs = _ => {
        this.levelMap.forEach(map => map.makeStairs(this.levelMap));
    }

    afterProcessing = _ => {
        this.createAndConnectStairs();
    }

    getLevelMap = level => this.levelMap[Math.min(ABYSS_LEVEL_INDEX, Math.max(0, level))];


}
export default MP_MapManager;