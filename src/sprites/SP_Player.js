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
    this.move(x, y);
  }

  move = (x, y) => {
    this.playerData.status.virtualX = x;
    this.playerData.status.virtualY = y;
    this.playerData.status.stay = true;
    this.playerData.status.force_update = true;
    this.moveConfirmed(x, y);
  }



  diceRoll = diceText => this.core.diceRoll(diceText);

  trappedIn = ({ dmg, difficulty, name }) => {
    const { core: { addText } } = this;
    const s = this.diceRoll("1d20") + 0; //Todo
    const point = (difficulty <= s) ? 0 : this.diceRoll(dmg);
    if (point) {
      addText(`ウップス!!  ${name}という、罠にハマった！`);
      this.applyDamage(point);
      return true;
    }
    return false;
  }

  applyDamage = point => {
    const { core: { addText } } = this;
    addText(`いてえ！  ${point} ポイントのダメージをくらった！`);
    const hp = this.playerData.status.hp - point;
    this.playerData.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      addText(`し  ん  だ  よ`);
      this.respawn();
      return true;
    }
    return false;
  }

  moveConfirmed = (x, y) => {
    const { mainMap, playerData } = this;
    playerData.moveConfirmed();
    // センタリング
    mainMap.center(x, y);
  }

  getItems = _=> this.playerData.status.items;

  update = (/*delta*/) => {
    const { core: { input, handleStepUpdate /*, addText*/ }, mainMap,
      playerData:
      { beforeUpdate,
        afterUpdate,
        isLock,
        unlock,
        lock,
        trialMove,
        isMove,
        stay,
        status
      },
      sprite } = this;
    beforeUpdate();
    const inputMap = {
      'o': _ => isLock() ? unlock() : lock(),
      'w': _ => trialMove('u'),
      's': _ => trialMove('d'),
      'a': _ => trialMove('l'),
      'd': _ => trialMove('r'),
      '.': _ => stay(),
      'ArrowUp': _ => trialMove('u'),
      'ArrowDown': _ => trialMove('d'),
      'ArrowLeft': _ => trialMove('l'),
      'ArrowRight': _ => trialMove('r'),
    };
    const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
    if (key) inputMap[key]();

    sprite.x = mainMap.mapContainer.x + status.mapX * 32;
    sprite.y = mainMap.mapContainer.y + status.mapY * 32;
    if (!isMove()) return; // 動いていない
    // 動いた
    afterUpdate();
    const { virtualX: vx, virtualY: vy } = status;
    status.steps++;
    handleStepUpdate(vx, vy);
    const tile = mainMap.getTile(vx, vy);
    tile.hit({ actor: this, status }) || this.moveConfirmed(vx, vy);
  }
}

export default SP_Player;


