import { Application, Assets } from 'pixi.js';

import Stats from 'stats.js';
import Tile from '../sprites/Tile';

class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    this.app = new Application({
      backgroundColor: 0x1099bb,
      width: 32 * 25,
      height: 32 * 15
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

    app.ticker.add((/*delta*/) => {
      stats.begin();
      stats.end();
    });
  }
}

export default Core;