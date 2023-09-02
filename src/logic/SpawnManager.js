import { Container, } from 'pixi.js';
import SP_Monster from '../sprites/SP_Monster';

const MAX_CHARACTERS = 20;

class SpawnManager {

    constructor(gameScene) {
        this.gameScene = gameScene;
        this.contianer = new Container();
        this.levelMonster = [];
        const { sceneContainer } = gameScene;
        sceneContainer.addChild(this.contianer);
    }

    spawnEnemy = _ => {
        const { core,/* level, */monsters } = this.gameScene;
        const scene = this.gameScene;
        if (monsters.length >= MAX_CHARACTERS) return;
        Array.from({ length: 5 }, _ => {
            const monster = new SP_Monster({ core, scene });
            monster.respawn();
            monsters.push(monster);
            this.contianer.addChild(monster.getPrim());
        });
    }

    resetEnemy = _ => {
        this.contianer.removeChildren();
        this.gameScene.monsters = [];
    }
}

export default SpawnManager;