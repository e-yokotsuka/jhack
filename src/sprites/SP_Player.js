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

  getPlayerData = _ => this.playerData;

  respawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.playerData.status.hp = this.playerData.status.maxHp;
    this.playerData.status.mapX = x;
    this.playerData.status.mapY = y;
    this.mainMap.center(this.playerData.status.mapX, this.playerData.status.mapY);
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
    const hp = this.playerData.status.hp - dmg;
    this.playerData.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      this.core.addText(`し  ん  だ  よ`);
      this.respawn();
      return true;
    }
    return false;
  }


  update = (/*delta*/) => {
    const { core: { input,handleStepUpdate,addText }, mainMap,playerData,sprite } = this;
    playerData.beforeUpdate();
    const inputMap = {
      'o': _ => playerData.isLock() ? playerData.unlock() : playerData.lock(),
      'w': _ => playerData.trialMove('u'),
      's': _ => playerData.trialMove('d'),
      'a': _ => playerData.trialMove('l'),
      'd': _ => playerData.trialMove('r'),
      '.': _ => playerData.stay(),
      'ArrowUp': _ => playerData.trialMove('u'),
      'ArrowDown': _ => playerData.trialMove('d'),
      'ArrowLeft': _ => playerData.trialMove('l'),
      'ArrowRight': _ => playerData.trialMove('r'),
    };
    const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
    if (key) inputMap[key]();

    sprite.x = mainMap.mapContainer.x + playerData.status.mapX * 32;
    sprite.y = mainMap.mapContainer.y + playerData.status.mapY * 32;
    if (!playerData.isMove()) return; // 動いていない
    // 動いた
    const { virtualX: vx, virtualY: vy } = playerData.status;
    playerData.status.steps++;
    handleStepUpdate(vx, vy);
    const blockedTile = mainMap.isBlockedTile(vx, vy);
    if (blockedTile) {
      const { type = 'unknown', item, open = _ => { }, hitStep = 0, close = false } = blockedTile;
      if (type === 'chest') {
        if (hitStep + 1 == playerData.status.steps) {
          if (item) {
            playerData.status.items.push(item);
            addText(`${item.itemName}をGETした！`);
            open();
          } else {
            addText(`からっぽだ！`);
          }
        } else {
          addText(`宝箱だ！`);
        }
      } else if (type === 'door') {
        if (hitStep + 1 == playerData.status.steps && close) {
          addText(`ドアを開けた！`);
          open();
        } else {
          this.core.addText(`しまった！ 閉まったドアだ！`);
        }
      }
      blockedTile.hitStep = playerData.status.steps;
    } else {
      playerData.moveConfirmed(); //移動確定
      mainMap.center(vx, vy);
      const actionTile = mainMap.isActionTile(vx, vy);
      if (actionTile) {
        const { type = 'unknown', trap } = actionTile;
        if (type === 'trap') {
          addText(`ウップス!!  ${trap.name}という、罠にハマった！`);
          const dmg = this.trappedIn(trap);
          if (dmg) {
            mainMap.putTileWithAttributes({ x: vx, y: vy, cellName: 'dngn_trap_magical', attributes: { type: 'floor' } })
            addText(`いてぇ。 ${dmg} ポイントのダメージをくらった！`);
            if (this.hit(dmg)) return;//しんだ
          } else {
            addText(`しかし、発動前にヒョイっと避けた！`);
          }
        }
      }
    }
  }


}

export default SP_Player;


