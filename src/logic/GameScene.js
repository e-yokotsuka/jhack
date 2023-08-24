import { Container, Text } from 'pixi.js';

import MP_MapManager from '../map/MP_MapManager';
import { SCENE_ID } from './Core'
import SP_Player from '../sprites/SP_Player';
import SpawnManager from './SpawnManager'
import UI_MessageBox from '../ui/UI_MessageBox'
import UI_Status from '../ui/UI_Status';
import UI_WindowManager from '../ui/UI_WindowManager';

class GameScene {
    constructor({ core }) {
        this.core = core;
        this.app = core.app;
        this.input = core.input;
        this.sceneId = SCENE_ID.GAME;
        this.isWindowOpen = false;
        this.sceneContainer = new Container();
        this.mapContainer = new Container();
        this.levelMap = [];
        this.frameCounter = 0;
    }

    getSceneId = _ => this.sceneId;

    Load = async _ => await true;

    updateMap = _ => {
        this.mainMap = this.mapManager.getLevelMap(this.level);
        this.mapContainer.removeChildren();
        this.mapContainer.addChild(this.mainMap.getPrim());
    }

    Initialize = _ => {
        const { core, app } = this;
        const scene = this;
        this.sceneContainer.removeChildren();
        this.level = 0; // 階層
        this.mapManager = new MP_MapManager({ core, scene });
        this.updateMap();
        this.sceneContainer.addChild(this.mapContainer);
        this.debugTextPrim = new Text('debug key string', {
            fontSize: 20,
            fill: 0xffffff,
            align: 'center',
        });
        this.sceneContainer.addChild(this.debugTextPrim);
        this.debugTextPrim.x = 100;
        this.debugTextPrim.y = 0;

        this.player = new SP_Player({ core, scene });
        this.sceneContainer.addChild(this.player.getPrim());
        this.player.respawn();
        this.monsters = [];


        this.uiStatus = new UI_Status({ core, scene });
        this.sceneContainer.addChild(this.uiStatus.getPrim());
        this.uiMessageBox = new UI_MessageBox({ core, scene });
        this.sceneContainer.addChild(this.uiMessageBox.getPrim());

        this.uiWindowManager = new UI_WindowManager({ core, scene });
        this.sceneContainer.addChild(this.uiWindowManager.getPrim());
        app.stage.addChild(this.sceneContainer);
        this.spawnManager = new SpawnManager(this)
    }

    main(delta) {
        this.mainMap.update(delta);
        this.uiStatus.update();
        this.player.update(delta);
        this.monsters.map(({ update }) => { update(delta) });
        this.uiMessageBox.update(delta);
        this.uiWindowManager.update(delta);
        this.debugTextPrim.text = this.core.getDebugText();
        const { x, y } = this.mainMap.getPosition();
        this.core.setDebugText(1, `Monster Count:${this.monsters.length}`);
        this.core.setDebugText(2, `Counter:${this.frameCounter++}`);
        this.core.setDebugText(3, `MapX:${x},MapY:${y}`);
    }

    goto = ({ next: { x, y, level } }) => {
        console.log(`${x} ${y} ${level}`)
        this.level = level;
        this.updateMap();
        this.player.setMap(this.mainMap);
        this.player.teleportation(x, y);
        this.mainMap.center(x, y);
        this.resetEnemy();
        const { x: xx, y: yy } = this.mainMap.getPosition();
        console.log(`${xx},${yy}`);
    }

    Start = async _ => {
        const { app } = this;
        app.ticker.start();
    }

    Stop() {
        const { app } = this;
        app.ticker.stop();
    }

    resize(width, height) {
        this.uiStatus.resize(width, height);
        this.uiMessageBox.resize(width, height);
        this.mainMap.center();
    }
    windowOpen = isOpen => this.isWindowOpen = isOpen;
    addText = (text, time) => this.uiMessageBox?.addText(text, time);
    getPlayer = _ => this.player;
    getPlayerStatus = _ => this.player.status;

    getEnemys = _ => this.monsters;
    spawnEnemy = _ => this.spawnManager.spawnEnemy();
    resetEnemy = _ => this.spawnManager.resetEnemy();

    // stepが更新された
    handleStepUpdate = (/* vx, vy*/) => {
        // プレイヤーの動作を行う（移動、アイテム使用、攻撃など）
        // 敵のAIによる移動、攻撃などの動作を行う
        // 衝突判定を行い、プレイヤーと敵が衝突した場合は戦闘処理を行う
        // 新しい部屋や通路などが必要な場合は生成する
        // アイテムや敵の出現をランダムに決定する
        //actionPlayer(); // プレイヤーの動作を行う
        //moveEnemy() // 敵の移動
        //actionEnemy() // 敵のアクション

        this.spawnEnemy();
        this.monsters.map(monster => monster.doSomething());

        //    console.log(`vx:${vx}/vy:${vy}`);
    }

    save = _ => {
        const ps = this.getPlayerStatus();
        const str1 = ps.serialize();
        const str2 = this.mainMap.serialize();
        console.log(str1);
        console.log(str2);
        console.log("save game scene")
    }

    // ステータスプロパティのシンタックスシュガー

    get playerMapX() { return this.getPlayerStatus().mapX }
    get playerMapY() { return this.getPlayerStatus().mapY }


}

export default GameScene;