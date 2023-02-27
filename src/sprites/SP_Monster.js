import MD_SP_Monster from '../model/MD_SP_Monster';
import { Sprite } from 'pixi.js';

class SP_Monster {

  constructor({ core, name = "human" }) {
    this.SP_MonsterData = new MD_SP_Monster({
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
    this.SP_MonsterData.status.mapX = 0;
    this.SP_MonsterData.status.mapY = 0;
  }

  getSP_MonsterData = _ => this.SP_MonsterData;

  respawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.SP_MonsterData.status.hp = this.SP_MonsterData.status.maxHp;
    this.SP_MonsterData.status.mapX = x;
    this.SP_MonsterData.status.mapY = y;
    this.mainMap.center(this.SP_MonsterData.status.mapX, this.SP_MonsterData.status.mapY);
  }


  diceRoll = diceText => this.core.diceRoll(diceText);

  trappedIn = ({
    dmg,
    difficulty
  }) => {
    const s = this.diceRoll("1d20") + 0; //Todo
    return (difficulty <= s) ? 0 : this.diceRoll(dmg);
  }

  hit = dmg => {
    const hp = this.SP_MonsterData.status.hp - dmg;
    this.SP_MonsterData.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      this.core.addText(`し  ん  だ  よ`);
      this.respawn();
      return true;
    }
    return false;
  }


  update = (/*delta*/) => {
    const { core: { input }, mainMap } = this;
    this.SP_MonsterData.beforeUpdate();
    if (input.isSingleDown('o')) {
      this.SP_MonsterData.isLock() ? this.SP_MonsterData.unlock() : this.SP_MonsterData.lock();
    } else if (input.isSingleDown('w') ||
      input.isSingleDown('ArrowUp')) {
      this.SP_MonsterData.trialMove('u');
    } else if (input.isSingleDown('s') ||
      input.isSingleDown('ArrowDown')) {
      this.SP_MonsterData.trialMove('d');
    } else if (input.isSingleDown('a') ||
      input.isSingleDown('ArrowLeft')) {
      this.SP_MonsterData.trialMove('l');
    } else if (input.isSingleDown('d') ||
      input.isSingleDown('ArrowRight')) {
      this.SP_MonsterData.trialMove('r');
    } else if (input.isSingleDown('.')) {
      // その場にとどまる。
      this.SP_MonsterData.stay();
    }
    this.sprite.x = mainMap.mapContainer.x + this.SP_MonsterData.status.mapX * 32;
    this.sprite.y = mainMap.mapContainer.y + this.SP_MonsterData.status.mapY * 32;
    if (!this.SP_MonsterData.isMove()) return; // 動いていない
    // 動いた
    const { virtualX: vx, virtualY: vy } = this.SP_MonsterData.status;
    this.SP_MonsterData.status.steps++;
    this.core.handleStepUpdate(vx, vy);
    const blockedTile = mainMap.isBlockedTile(vx, vy);
    if (blockedTile) {
      const { type = 'unknown', item, open = _ => { }, hitStep = 0, close = false } = blockedTile;
      if (type === 'chest') {
        if (hitStep + 1 == this.SP_MonsterData.status.steps) {
          if (item) {
            this.SP_MonsterData.status.items.push(item);
            this.core.addText(`${item.itemName}をGETした！`);
            open();
          } else {
            this.core.addText(`からっぽだ！`);
          }
        } else {
          this.core.addText(`宝箱だ！`);
        }
      } else if (type === 'door') {
        if (hitStep + 1 == this.SP_MonsterData.status.steps && close) {
          this.core.addText(`ドアを開けた！`);
          open();
        } else {
          this.core.addText(`しまった！ 閉まったドアだ！`);
        }
      }
      blockedTile.hitStep = this.SP_MonsterData.status.steps;
    } else {
      this.SP_MonsterData.moveConfirmed(); //移動確定
      this.mainMap.center(vx, vy);
      const actionTile = mainMap.isActionTile(vx, vy);
      if (actionTile) {
        const { type = 'unknown', trap } = actionTile;
        if (type === 'trap') {
          this.core.addText(`ウップス!!  ${trap.name}という、罠にハマった！`);
          const dmg = this.trappedIn(trap);
          if (dmg) {
            this.mainMap.putTileWithAttributes({ x: vx, y: vy, cellName: 'dngn_trap_magical', attributes: { type: 'floor' } })
            this.core.addText(`いてぇ。 ${dmg} ポイントのダメージをくらった！`);
            if (this.hit(dmg)) return;//しんだ
          } else {
            this.core.addText(`しかし、発動前にヒョイっと避けた！`);
          }
        }
      }
    }
  }


}

export default SP_Monster;


