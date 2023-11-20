import { Container, } from 'pixi.js';
import { MAX_DUNGEON_LEVEL } from "../define";
import MS_Monster from '../data/MS_Monster';
import SP_Monster from '../sprites/SP_Monster';

const MAX_CHARACTERS = 20;

class SpawnManager {

    constructor(gameScene) {
        this.gameScene = gameScene;
        this.layer = new Container();
        this.contianerMonster = new Container();
        this.contianerTrace = new Container();
        this.levelMsMonster = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.levelMonster = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.levelTrace = Array(MAX_DUNGEON_LEVEL).fill().map(_ => []);
        this.layer.addChildAt(this.contianerMonster);
        this.layer.addChildAt(this.contianerTrace);
        for (let level = 0; level < MAX_DUNGEON_LEVEL; level++) {
            this.levelMsMonster[level] = MS_Monster.filter(
                ({ spawnStartLv, spawnEndLv }) => level >= spawnStartLv && level <= spawnEndLv
            );
        }
    }

    getPrim = _ => this.layer;

    spawnEnemy = _ => {
        const { core, level } = this.gameScene;
        const monsters = this.levelMonster[level];
        const scene = this.gameScene;
        if (monsters.length >= MAX_CHARACTERS) return;
        Array.from({ length: 5 }, _ => {
            const numMonsters = this.levelMsMonster[level].length;
            if (numMonsters < 1) return;
            const monsterSetting = this.levelMsMonster[level][Math.floor(Math.random() * numMonsters)];
            const monster = new SP_Monster({ core, scene, monsterSetting });
            monster.respawn();
            this.levelMonster[level].push(monster);
        });
        this.reset(level)
    }

    addTrace = trace => this.contianerTrace.addChild(trace.getPrim());

    reset = (level = 0) => {
        this.setLevelMonster(level);
    }

    refreshMonsters() {
        const { level } = this.gameScene;
        this.levelMonster[level] = this.levelMonster[level].filter(m => !m.isDie);
        this.levelTrace[level] = this.levelTrace[level].filter(m => !m.isDie);
        this.reset(level);
    }

    setLevelMonster = level => {
        this.contianerMonster.removeChildren();
        this.contianerTrace.removeChildren();
        const monsters = this.levelMonster[level];
        const traces = this.levelTrace[level];
        monsters.forEach(monster => {
            monster.makePrim(); // プリミティブ再生成
            this.contianerMonster.addChild(monster.getPrim())
        });
        traces.forEach(trace => {
            trace.makePrim(); // プリミティブ再生成
            this.contianerTrace.addChild(trace.getPrim())
        });
        this.gameScene.monsters = this.levelMonster[level];
        this.gameScene.traces = this.levelTrace[level];
    };
}

export default SpawnManager;