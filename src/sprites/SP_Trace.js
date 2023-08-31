import { CELL_SIZE } from "../define";
import { Sprite } from 'pixi.js';

const BLOOD = ['blood_red', 'blood_red1', 'blood_red2', 'blood_red3', 'blood_red4'];
class SP_Trace {

  constructor({ core, scene, name, mapX, mapY, life = 100 }) {
    const { textures: { tx_main } } = core;
    const texName = name ?? BLOOD[Math.floor(Math.random() * BLOOD.length)];
    const sprite = new Sprite(tx_main[`${texName}`]);
    sprite.interactive = false;
    this.sprite = sprite;
    this.life = life;
    this.maxLife = life;
    this.mapX = mapX;
    this.mapY = mapY;
    this.scene = scene;
    this.mainMap = scene.mainMap;
  }

  getPrim = _ => this.sprite;

  // 行動ロジック
  doSomething() {
    if (this.life < 0) {
      this.getPrim().destroy();
      this.isDie = true;
      this.scene.refreshTraces();
      return;
    }
    this.sprite.alpha = this.life / this.maxLife;
    this.life--;
  }

  update = (/*delta*/) => {
    const { mainMap, mapX, mapY, sprite } = this;
    sprite.x = mainMap.mapContainer.x + mapX * CELL_SIZE;
    sprite.y = mainMap.mapContainer.y + mapY * CELL_SIZE;
  }

}

export default SP_Trace;


