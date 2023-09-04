import { Application, Assets, Sprite, Texture } from 'pixi.js';

import GameScene from './GameScene';
import Input from './Input';
import Stats from 'stats.js';
import UI_Common from '../ui/UI_Common';
import { diceRoll } from '../tools/Calc';
import { sound } from '@pixi/sound';

const SCENE_ID = {
  GAME: "game"
}

const START_SCENE_ID = SCENE_ID.GAME;

class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    const { width, height } = this.getCanvasSize();
    this.app = new Application({
      backgroundColor: 0x000000,
      width, height
    });
    if (isShowStats) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      dom.appendChild(this.stats.dom);
    }
    dom.appendChild(this.app.view);
    this.loaded = false;
    this.mainScale = 1;
    this.debugText = {};
    this.input = new Input(); // アプリケーション内共通
    const gameScene = new GameScene({ core: this });
    this.scenes = {
      [gameScene.getSceneId()]: gameScene,
    };
    this.sceneId = START_SCENE_ID;
    this.changeScene(this.sceneId, false)
    window.addEventListener("resize", (event) => { this.resize(event) }, false);
    sound.muteAll(); // デフォルトは音をミュート
  }

  changeScene = (sceneId, reset = true) => {
    this.sceneId = sceneId
    this.currentScene = this.scenes[sceneId];
    if (reset) this.reset();
  }

  getScene = sceneId => this.scenes[sceneId];

  setDebugText = (index, text) => {
    this.debugText[`${index}`] = text;
  }

  getDebugText = _ => {
    const keys = Object.keys(this.debugText).sort();
    return keys.map(key => `${this.debugText[key]}`).join("\n");
  }

  resize = _ => {
    const { width, height } = this.getCanvasSize();
    console.log(`canvas w:${width}/h${height}`);
    this.app.renderer.resize(width, height);
    this.currentScene.resize(width, height);
  }

  getCanvasSize = _ => ({ width: Math.floor(window.innerWidth / 2) * 2, height: Math.floor(window.innerHeight / 2) * 2 })

  reset = async _ => {
    if (await this.Load()) {
      await this.Initialize();
      await this.Start();
    } else {
      console.error("Resource not loaded.")
    }
  }

  muteSwitchCallback = isMute => {
    isMute ? sound.muteAll() : sound.unmuteAll();
    this.currentScene.onMute(isMute);
  }

  Load = async _ => {
    this.loaded = true;
    // texturesはアプリケーション内共通
    const { textures } = await Assets.load('./assets/sprites/main.json', p => console.info(p));
    console.dir(textures)
    this.textures = {};
    textures["ui_sound_on"] = Texture.from('./assets/sprites/icons/outline_volume_up_white_24dp.png');
    textures["ui_sound_off"] = Texture.from('./assets/sprites/icons/outline_volume_off_white_24dp.png');
    this.textures["tx_main"] = textures;
    this.uiCommon = new UI_Common({ core: this, muteSwitchCallback: this.muteSwitchCallback });
    return await this.currentScene.Load();
  }

  Initialize = async _ => {
    console.assert(this.loaded, 'Resource not loaded.');
    this.app.stage.removeChildren();
    this.currentScene.Initialize();
    this.app.stage.addChild(this.uiCommon.getPrim());
    this.resize();
  }

  Start = async _ => {
    const { app } = this;
    this.currentScene.Start();
    app.ticker.add(delta => {
      const { app, stats, mainScale } = this;
      app.stage.scale.x = mainScale;
      app.stage.scale.y = mainScale;
      this.input.update();
      this.setDebugText(0, this.input.getDebugString(['w', 'a', 'd', 's', 'z', 'e']));
      stats.begin();
      if (this.input.isDown('z')) this.Initialize();
      this.currentScene.main(delta);
      this.uiCommon.update(delta);
      stats.end();
    });
  }

  isKeyDown = key => this.input.isDown(key);
  isKeyUp = key => !this.input.isDown(key);

  getTexture = texName => this.textures.tx_main[texName];

  diceRoll = ({ diceText, status }) => diceRoll({ diceText, status });

  getPlayer = _ => this.currentScene.getSceneId() === SCENE_ID.GAME ? this.currentScene.getPlayer() : null;
  getPlayerStatus = _ => this.currentScene.getSceneId() === SCENE_ID.GAME ? this.currentScene.getPlayerStatus() : null;
  createSpriteByName = name => {
    const { textures: { tx_main } } = this;
    return new Sprite(tx_main[`${name}`]);
  }
  save = _ => {
    const gameScene = this.getScene(SCENE_ID.GAME);
    gameScene.save();
  }

}

export default Core;
export { SCENE_ID }