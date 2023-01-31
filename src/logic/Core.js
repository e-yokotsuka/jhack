import { Application } from 'pixi.js';
import Penguin from '../sprites/Penguin';
import Stats from 'stats.js';

class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    this.app = new Application({
      backgroundColor: 0x1099bb
    });
    if (isShowStats) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      dom.appendChild(this.stats.dom);
    }
    dom.appendChild(this.app.view);
  }

  Start = async _ => {
    const penguin = await Penguin({ core: this, no: 1 });
    const penguin2 = await Penguin({ core: this, no: 2 });
    penguin2.anchor.set(0.3);
    this.app.stage.addChild(penguin);
    this.app.stage.addChild(penguin2);

    this.app.ticker.add((delta) => {
      this.stats.begin();
      penguin.tick(delta);
      penguin2.tick(delta);
      this.stats.end();
    });
  }
}

export default Core;