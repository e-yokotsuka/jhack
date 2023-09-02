import { Container, Text } from 'pixi.js';

import BattleLogic from './BattleLogic';
import MP_MapManager from '../map/MP_MapManager';
import { PLAYER_MAP_BOUNDS } from '../define';
import { SCENE_ID } from './Core'
import SP_Player from '../sprites/SP_Player';
import SpawnManager from './SpawnManager'
import UI_MessageBox from '../ui/UI_MessageBox'
import UI_Status from '../ui/UI_Status';
import UI_WindowManager from '../ui/UI_WindowManager';
import { distance } from '../tools/Calc';
import { sound } from '@pixi/sound';

class GameScene {
    constructor({ core }) {
        this.core = core;
        this.app = core.app;
        this.sound = sound;
        this.input = core.input;
        this.sceneId = SCENE_ID.GAME;
        this.isWindowOpen = false;
        this.sceneContainer = new Container();
        this.mapContainer = new Container();
        this.battleLogic = new BattleLogic(core);
        this.levelMap = [];
        this.frameCounter = 0;
        // SOUND の MUTO
        this.isMute = true;
    }

    getSceneId = _ => this.sceneId;

    Load = async _ => {

        this.sound.add('iron_door_open', './assets/sound/鉄の扉を開ける.mp3');
        this.sound.add('bow_arrow_hit', './assets/sound/弓矢が刺さる.mp3');
        this.sound.add('sword_slash_2', './assets/sound/剣で斬る2.mp3');
        this.sound.add('strike_8', './assets/sound/打撃8.mp3');
        return await true;//あとで非同期処理が必要になるかもしれないので非同期関数としておく。
    }

    updateMap = _ => {
        this.traces = [];
        this.monsters = [];
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
        this.spawnManager = new SpawnManager(this)
        this.updateMap();
        this.sceneContainer.addChild(this.mapContainer);
        this.sceneContainer.addChild(this.spawnManager.getPrim());
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
        this.traces = []; // 痕跡（血とか）

        this.uiStatus = new UI_Status({ core, scene });
        this.sceneContainer.addChild(this.uiStatus.getPrim());

        this.uiWindowManager = new UI_WindowManager({ core, scene });
        this.sceneContainer.addChild(this.uiWindowManager.getPrim());
        app.stage.addChild(this.sceneContainer);

        this.uiMessageBox = new UI_MessageBox({ core, scene });
        this.sceneContainer.addChild(this.uiMessageBox.getPrim());
    }

    refreshMonsters = _ => this.spawnManager.refreshMonsters();

    addTrace = trace => {
        this.spawnManager.addTrace(trace);
        this.traces.push(trace);
    }

    main(delta) {
        this.mainMap.update(delta);
        this.uiStatus.update();
        this.player.update(delta);
        this.traces.forEach(({ update }) => { update(delta) });
        this.monsters.forEach(({ update }) => { update(delta) });
        this.uiMessageBox.update(delta);
        this.uiWindowManager.update(delta);
        this.debugTextPrim.text = this.core.getDebugText();
        const { x, y } = this.mainMap.getPosition();
        this.core.setDebugText(1, `Monster Count:${this.monsters.length}`);
        this.core.setDebugText(2, `Counter:${this.frameCounter++}`);
        this.core.setDebugText(3, `MapX:${x},MapY:${y},isLocked:${this.isWindowOpen}`);
    }

    goto = ({ next: { x, y, level } }) => {
        console.log(`${x} ${y} ${level}`)
        this.level = level;
        this.updateMap();
        this.player.setMap(this.mainMap);
        this.player.teleportation(x, y);
        this.mainMap.center(x, y);
        this.resetSpawnManager(level);
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

    getEnemyById = uuid => this.monsters.find(m => m.uuid == uuid);
    getEnemys = _ => this.monsters;
    spawnEnemy = _ => this.spawnManager.spawnEnemy();
    resetSpawnManager = level => this.spawnManager.reset(level);

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
        this.traces.map(trace => trace.doSomething());

        //    console.log(`vx:${vx}/vy:${vy}`);
    }

    play(name, target) {
        if (this.isMute) return;
        let dis = 0;
        const { playerMapX, playerMapY } = this;
        let volume = 1;
        if (target) {
            dis = distance(target, { mapX: playerMapX, mapY: playerMapY });
            if (dis > PLAYER_MAP_BOUNDS) return;
            volume = Math.max(0, 1 - (dis / PLAYER_MAP_BOUNDS));
            console.log(`${target.characterName} : volume ${volume} : sound ${name}`)
        }
        sound.play(name, { volume })
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
    get playerUUID() { return this.getPlayerStatus().uuid }


}

export default GameScene;