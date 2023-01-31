import { Application, Assets, Text } from 'pixi.js';

import Stats from 'stats.js';
import Tile from '../sprites/Tile';

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
  }

  Load = async _ => {
    this.loaded = true;
    const { textures } = await Assets.load('./assets/sprites/main.json', p => console.info(p));
    this.textures = {};
    this.textures["tx_main"] = textures;
    console.dir(this.textures["tx_main"]);
    return this.loaded;
  }

  Start = async _ => {
    const { app, stats, loaded } = this;
    console.assert(loaded, 'Resource not loaded.');

    for (let x = 0; x < 25; x++)
      for (let y = 0; y < 19; y++) {
        const t = Tile({ core: this, name: `floor_vines_${(x % 7)}` });
        t.x = x * t.width;
        t.y = y * t.height;
        app.stage.addChild(t);
      }
    const text = new Text('よくぞいらした。\nここムーリダヤ・メタインでは\n恐ろしき魔物との戦いが数千年にわたって繰り広げられている。', {
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    app.stage.addChild(text);
    text.y = CANVAS_HEIGHT;
    text.x = (CANVAS_WIDTH - text.width) / 2;
    app.ticker.add((delta) => {
      stats.begin();
      app.stage.addChild(text);
      text.y -= delta * 0.2;
      text.y = Math.max(text.y, 0);
      stats.end();
    });
  }
}

export default Core;