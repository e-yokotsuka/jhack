import MD_Player from '../model/MD_Player';
import { Sprite } from 'pixi.js';

class SP_Player {

  constructor({ core, name = "human" }) {
    this.playerData = new MD_Player({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
    this.core = core;
    const { textures: { tx_main }, mainMap } = core;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    const { stage } = this.core.app;
    stage.addChild(sprite);
    this.sprite = sprite;
    this.playerData.status.mapX = 0;
    this.playerData.status.mapY = 0;
  }

  getPlayerData = _ => this.playerData

  respawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.playerData.status.mapX = x;
    this.playerData.status.mapY = y;
    this.mainMap.center(this.playerData.status.mapX, this.playerData.status.mapY);
  }

  update = (/*delta*/) => {
    const { core, mainMap } = this;
    const { core: { input } } = this;
    const { mapX, mapY } = this.playerData.status;
    let nx = mapX;
    let ny = mapY;
    if (input.isSingleDown('w')) {
      ny -= 1;
      this.playerData.status.steps++;
    } else if (input.isSingleDown('s')) {
      ny += 1;
      this.playerData.status.steps++;
    } else if (input.isSingleDown('a')) {
      nx -= 1;
      this.playerData.status.steps++;
    } else if (input.isSingleDown('d')) {
      nx += 1;
      this.playerData.status.steps++;
    }
    const blockedTile = mainMap.isBlockedTile(nx, ny);
    if (blockedTile) {
      // 何かに衝突した
      console.log(blockedTile);
      const { type = 'unknown', item, open = _ => { }, hitStep = 0, close = false } = blockedTile;
      if (type === 'chest') {
        if (hitStep + 1 == this.playerData.status.steps) {
          if (item) {
            this.playerData.status.items.push(item);
            this.core.addText(`${item.itemName}をGETした！`);
            open();
          } else {
            this.core.addText(`からっぽだ！`);
          }
        } else {
          this.core.addText(`宝箱だ！`);
        }
      } else if (type === 'door') {
        if (hitStep + 1 == this.playerData.status.steps && close) {
          this.core.addText(`ドアを開けた！`);
          open();
        } else {
          this.core.addText(`しまった！ 閉まったドアだ！`);
        }
      }
      blockedTile.hitStep = this.playerData.status.steps;
    } else {
      this.playerData.status.mapX = nx;
      this.playerData.status.mapY = ny;
      this.mainMap.center(nx, ny);
    }
    this.sprite.scale.x = core.mainScale;
    this.sprite.scale.y = core.mainScale;
    this.sprite.x = mainMap.mapContainer.x + this.playerData.status.mapX * 32;
    this.sprite.y = mainMap.mapContainer.y + this.playerData.status.mapY * 32;
  }

}

export default SP_Player;


