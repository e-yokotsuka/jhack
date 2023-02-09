import { Application, Assets, Text } from 'pixi.js';

import Input from './Input';
import MP_AutoMap from '../map/MP_AutoMap';
import SP_Player from '../sprites/SP_Player';
import Stats from 'stats.js';
import UI_MessageBox from '../ui/UI_MessageBox'
import UI_Status from '../ui/UI_Status';

const CANVAS_WIDTH = 32 * 50;
const CANVAS_HEIGHT = 32 * 30;
// const CANVAS_WIDTH_CENTER = CANVAS_WIDTH / 2;
// const CANVAS_HEIGHT_CENTER = CANVAS_HEIGHT / 2;


class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    this.app = new Application({
      backgroundColor: 0x000000,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    });
    if (isShowStats) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      dom.appendChild(this.stats.dom);
    }
    dom.appendChild(this.app.view);
    this.loaded = false;
    this.mainScale = 1;
  }

  getCanvasSize = _ => ({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })

  Load = async _ => {
    this.loaded = true;
    const { textures } = await Assets.load('./assets/sprites/main.json', p => console.info(p));
    this.textures = {};
    this.textures["tx_main"] = textures;
    return this.loaded;
  }

  Start = async _ => {
    const { app, stats, loaded } = this;
    console.assert(loaded, 'Resource not loaded.');
    this.mainMap = new MP_AutoMap({ core: this });
    const text = new Text('よくぞいらした。\nここムーリダヤ・メタインでは\n恐ろしき魔物との戦いが数千年にわたって繰り広げられている。', {
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    const keytext = new Text('debug key string', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'center',
    });
    app.stage.addChild(keytext);
    keytext.x = 0;
    keytext.y = 0;

    this.input = new Input();
    app.stage.addChild(text);
    this.player = new SP_Player({ core: this });
    this.player.respawn();
    const uiStatus = new UI_Status({ core: this });
    app.stage.addChild(uiStatus.getPrim());
    this.uiMessageBox = new UI_MessageBox({ core: this });
    app.stage.addChild(this.uiMessageBox.getPrim());
    app.stage.addChild(text);
    text.y = CANVAS_HEIGHT;
    text.x = (CANVAS_WIDTH - text.width) / 2;

    app.ticker.add((delta) => {
      stats.begin();
      this.input.update();
      this.mainMap.update(delta);
      keytext.text = this.input.getDebugString(['w', 'a', 'd', 's', 'z']);
      uiStatus.update();
      text.y -= delta * 0.2;
      text.y = Math.max(text.y, 0);
      this.player.update(delta);
      this.uiMessageBox.update(delta);
      stats.end();
    });
  }

  isKeyDown = key => this.input.isDown(key);
  isKeyUp = key => !this.input.isDown(key);

  addText = text => this.uiMessageBox.addText(text);
  getTexture = texName => this.textures.tx_main[texName];
}

export default Core;