import { Container, Text } from 'pixi.js';

import BattleLogic from './BattleLogic';
import SaveManager from './SaveManager';
import CommonScene from './CommonScene';
import EffectManager from './EffectManager';
import MP_MapManager from '../map/MP_MapManager';
import { PLAYER_MAP_BOUNDS } from '../define';
import { SCENE_ID } from './Core'
import SP_Player from '../sprites/SP_Player';
import SpawnManager from './SpawnManager'
import UI_DialogWindow from '../ui/UI_DialogWindow';
import UI_MessageBox from '../ui/UI_MessageBox'
import UI_Status from '../ui/UI_Status';
import UI_WindowManager from '../ui/UI_WindowManager';
import { distance } from '../tools/Calc';
import { sound } from '@pixi/sound';

class GameScene extends CommonScene {
    constructor({ core }) {
        super({ core, sceneId: SCENE_ID.GAME });
        this.isWindowOpen = false;
        this.sceneContainer = new Container();
        this.mapContainer = new Container();
        this.actorContainer = new Container();
        this.effectContainer = new Container();
        this.uiContainer = new Container();
        this.battleLogic = new BattleLogic(core);
        this.effectManager = new EffectManager(core, this.effectContainer);
        this.levelMap = [];
        this.frameCounter = 0;
    }

    async Load() {
        this.sound.add({
            iron_door_open: './assets/sound/鉄の扉を開ける.mp3',
            bow_arrow_hit: './assets/sound/弓矢が刺さる.mp3',
            sword_slash_2: './assets/sound/剣で斬る2.mp3',
            strike_8: './assets/sound/打撃8.mp3',
            unmute: './assets/sound/決定ボタンを押す42.mp3',

        });
        await EffectManager.add({
            fireboll: { path: './assets/particle/fireboll.json', imageId: 'bolt04' },
            taki: { path: './assets/particle/taki.json', imageId: 'bolt04' }
        });
        return true;
    }

    updateMap = _ => {
        this.traces = [];
        this.monsters = [];
        this.npcs = [];
        this.mainMap = this.mapManager.getLevelMap(this.level);
        this.mapContainer.removeChildren();
        this.mapContainer.addChild(this.mainMap.getPrim());
    }

    Initialize() {
        const { core, app } = this;
        const scene = this;
        this.mapContainer.removeChildren();
        this.actorContainer.removeChildren();
        this.effectContainer.removeChildren();
        this.mapContainer.removeChildren();
        this.uiContainer.removeChildren();
        this.sceneContainer.removeChildren();
        this.level = 0; // 階層
        this.mapManager = new MP_MapManager({ core, scene });
        this.spawnManager = new SpawnManager(this)
        this.updateMap();
        this.sceneContainer.addChild(this.mapContainer);
        this.sceneContainer.addChild(this.actorContainer);
        this.sceneContainer.addChild(this.effectContainer);
        this.sceneContainer.addChild(this.uiContainer);

        this.actorContainer.addChild(this.spawnManager.getPrim());
        this.debugTextPrim = new Text('debug key string', {
            fontSize: 20,
            fill: 0xffffff,
            align: 'center',
        });
        this.uiContainer.addChild(this.debugTextPrim);
        this.debugTextPrim.x = 100;
        this.debugTextPrim.y = 0;

        this.player = new SP_Player({ core, scene });
        this.actorContainer.addChild(this.player.getPrim());
        this.player.respawn();
        this.monsters = [];
        this.traces = []; // 痕跡（血とか）
        this.npcs = [];

        this.uiStatus = new UI_Status({ core, scene });
        this.uiContainer.addChild(this.uiStatus.getPrim());

        this.uiWindowManager = new UI_WindowManager({ core, scene });
        this.uiContainer.addChild(this.uiWindowManager.getPrim());
        app.stage.addChild(this.sceneContainer);

        this.uiMessageBox = new UI_MessageBox({ core, scene });
        this.uiContainer.addChild(this.uiMessageBox.getPrim());

        this.npcDialogWindow = new UI_DialogWindow({ core, scene });
        this.uiContainer.addChild(this.npcDialogWindow.getPrim());

        // セーブデータがあればロード
        const saveData = SaveManager.load();
        if (saveData) this._applyLoadData(saveData);
    }

    refreshMonsters = _ => this.spawnManager.refreshMonsters();
    refreshNPCs = _ => this.spawnManager.refreshNPCs();

    addTrace = trace => {
        this.spawnManager.addTrace(trace);
        this.traces.push(trace);
    }

    main(delta) {
        this.effectManager.update(delta);
        this.mainMap.update(delta);
        this.uiStatus.update();
        this.player.update(delta);
        this.traces.forEach(({ update }) => { update(delta) });
        this.monsters.forEach(({ update }) => { update(delta) });
        this.npcs.forEach(({ update }) => { update(delta) });
        this.uiMessageBox.update(delta);
        this.uiWindowManager.update(delta);
        this.npcDialogWindow.update(delta);
        this.debugTextPrim.text = this.core.getDebugText();
        const { x, y } = this.mainMap.getPosition();
        this.core.setDebugText(1, `Monster Count:${this.monsters.length}`);
        this.core.setDebugText(2, `Counter:${this.frameCounter++}`);
        this.core.setDebugText(3, `MapX:${x},MapY:${y},isLocked:${this.isWindowOpen}`);
    }

    goto = ({ next: { x, y, level } }) => {
        this.level = level;
        this.updateMap();
        this.player.setMap(this.mainMap);
        this.player.teleportation(x, y);
        this.mainMap.center(x, y);
        this.resetSpawnManager(level);
        const { x: xx, y: yy } = this.mainMap.getPosition();
    }

    async Start() {
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
        this.npcDialogWindow.resize(width, height);
        this.mainMap.center();
    }
    windowOpen = isOpen => this.isWindowOpen = isOpen;
    windowClose = _ => this.uiWindowManager.close();
    addText = (text, time) => this.uiMessageBox?.addText(text, time);
    getPlayer = _ => this.player;
    getPlayerStatus = _ => this.player.status;
    getEnemyById = uuid => this.monsters.find(m => m.uuid == uuid);
    getEnemys = _ => this.monsters;
    getNpcs = _ => this.npcs;
    openNPCDialog = npc => this.npcDialogWindow.open(npc);
    spawnEnemy = _ => this.spawnManager.spawnEnemy();
    resetSpawnManager = level => this.spawnManager.reset(level);
    showEffect = ({ key, x, y }) => this.effectManager.setEffectPrim({ key, x, y });
    // stepが更新された
    handleStepUpdate = (/* vx, vy*/) => {
        this.spawnEnemy();
        this.monsters.map(monster => monster.doSomething());
        this.npcs.map(npc => npc.doSomething());
        this.traces.map(trace => trace.doSomething());
    }

    play(name, target) {
        let dis = 0;
        const { playerMapX, playerMapY } = this;
        let volume = 1;
        if (target) {
            dis = distance(target, { mapX: playerMapX, mapY: playerMapY });
            if (dis > PLAYER_MAP_BOUNDS) return;
            volume = Math.max(0, 1 - (dis / PLAYER_MAP_BOUNDS));
        }
        sound.play(name, { volume })
    }

    save = _ => {
        SaveManager.save({ playerStatus: this.getPlayerStatus(), floor: this.level });
        this.addText('セーブしました。');
    }

    discardSave = _ => {
        SaveManager.deleteSave();
        location.reload();
    }

    _applyLoadData(data) {
        const { player } = this;
        const p = data.player;
        const s = player.status;
        // ステータス復元
        ['characterName','lv','exp','nextExp','hp','maxHp','mp','maxMp',
         'str','dex','con','intl','wiz','cha','steps'].forEach(k => { s[k] = p[k]; });
        s.modifiers = { ...p.modifiers };
        s.items = p.items;
        s.equipments = p.equipments;
        s.magics = p.magics;
        // 階層・位置復元
        this.level = data.floor;
        this.updateMap();
        player.setMap(this.mainMap);
        player.teleportation(p.mapX, p.mapY);
        this.mainMap.center(p.mapX, p.mapY);
        this.resetSpawnManager(data.floor);
    }

    onMute(isMute) {
        this.addText(isMute ? 'あたりは静寂につつまれた！' : '音を盛大に鳴らすことになった！');
        if (!isMute) this.play('unmute');
    }
    savingThrow = ({ offense, defense, offenseDiceText, defenseDiceText }) => this.battleLogic.savingThrow({ offense, defense, offenseDiceText, defenseDiceText })
    getEnemiesInRange = (self, range) => this.battleLogic.getEnemiesInRange(self, range)
    findEnemiesInRange = (self, range) => this.battleLogic.findEnemiesInRange(self, range)
    isApproachActor = ({ pMapX, pMapY, mMapX, mMapY }) => this.battleLogic.isApproachEnemy({ map: this.currentMap, pMapX, pMapY, mMapX, mMapY })

    // ステータスプロパティのシンタックスシュガー
    get playerMapX() { return this.getPlayerStatus().mapX }
    get playerMapY() { return this.getPlayerStatus().mapY }
    get playerUUID() { return this.getPlayerStatus().uuid }
    get currentMap() { return this.mainMap }
}

export default GameScene;
