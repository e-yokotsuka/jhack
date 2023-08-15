import SP_Monster from '../sprites/SP_Monster';

const MAX_CHARACTERS = 20;

class SpawnManager {

    constructor(gameScene) {
        this.gameScene = gameScene;
    }

    spawnEnemy = _ => {
        const { core,/* level, */monsters, sceneContainer } = this.gameScene;
        const scene = this.gameScene;
        if (monsters.length >= MAX_CHARACTERS) return;
        Array.from({ length: 5 }, _ => {
            const monster = new SP_Monster({ core, scene });
            monster.respawn();
            monsters.push(monster);
            sceneContainer.addChild(monster.getPrim());
        });
    }
}

export default SpawnManager;