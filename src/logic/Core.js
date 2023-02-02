import { Application, Assets, Text } from 'pixi.js';

import MP_AutoMap from '../map/MP_AutoMap';
import Player from '../model/MD_Player';
import Stats from 'stats.js';
import UI_Status from '../UI/UI_Status';

const CANVAS_WIDTH = 32 * 25;
const CANVAS_HEIGHT = 32 * 15;
// const CANVAS_WIDTH_CENTER = CANVAS_WIDTH / 2;
// const CANVAS_HEIGHT_CENTER = CANVAS_HEIGHT / 2;


class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    this.app = new Application({
      backgroundColor: 0x1099bb,
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
    this.player = new Player({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
  }

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
    new MP_AutoMap({ core: this });
    const text = new Text('よくぞいらした。\nここムーリダヤ・メタインでは\n恐ろしき魔物との戦いが数千年にわたって繰り広げられている。', {
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    app.stage.addChild(text);
    text.y = CANVAS_HEIGHT;
    text.x = (CANVAS_WIDTH - text.width) / 2;
    const uiStatus = new UI_Status({ core: this });
    app.stage.addChild(uiStatus.getPrim());
    app.ticker.add((delta) => {
      stats.begin();
      app.stage.addChild(text);
      uiStatus.update();
      text.y -= delta * 0.2;
      text.y = Math.max(text.y, 0);
      stats.end();
    });
  }
}

export default Core;