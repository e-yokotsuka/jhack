import { ABYSS_LEVEL_INDEX, MAX_DUNGEON_LEVEL } from "../define";

import MP_AutoMap from '../map/MP_AutoMap';
import { generateSeed } from '../tools/SeededRandom';

class MP_MapManager {
    constructor({ core, scene, mapSeed }) {
        this.isDebugViewCollision = false;
        this.core = core;
        this.scene = scene;
        this.levelMap = [];
        // シード未指定時はランダム生成（シングルプレイ / ホスト）
        this.mapSeed = mapSeed ?? generateSeed();
        this.makeLevelMap();
    }

    makeLevelMap = _ => {
        const { core, mapSeed } = this;
        const scene = this;
        Array.from({ length: MAX_DUNGEON_LEVEL }, (_, level) => {
            this.levelMap.push(new MP_AutoMap({ core, scene, level, mapSeed }))
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