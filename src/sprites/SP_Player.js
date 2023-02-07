import { Sprite } from 'pixi.js';

class SP_Player {

  constructor({ core, name = "human" }) {
    this.core = core;
    const { textures: { tx_main }, mainMap } = core;
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    const { stage } = this.core.app;
    stage.addChild(sprite);
    this.sprite = sprite;
    this.mainMap = mainMap;
    this.mx = 0;
    this.my = 0;
  }

  respawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.mx = x;
    this.my = y;
  }

  update = (/*delta*/) => {
    const { core, mainMap } = this;
    const { core: { input } } = this;
    const { mx, my } = this;
    let nx = mx;
    let ny = my;
    if (input.isDown('w')) ny -= 1;
    if (input.isDown('s')) ny += 1;
    if (input.isDown('a')) nx -= 1;
    if (input.isDown('d')) nx += 1;
    if (!mainMap.isBlocked(nx, ny)) {
      this.mx = nx;
      this.my = ny;
    }
    this.sprite.scale.x = core.mainScale;
    this.sprite.scale.y = core.mainScale;
    this.sprite.x = this.mx * 32 * core.mainScale;
    this.sprite.y = this.my * 32 * core.mainScale;
  }

}

export default SP_Player;


