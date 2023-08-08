import MD_Player from '../model/MD_Player';
import MS_Item from "../data/MS_Item";
import SP_Actor from './SP_Actor';
import { Sprite } from 'pixi.js';

class SP_Player extends SP_Actor {

  constructor({ core, name = "human" }) {
    const status = new MD_Player({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
    super(core, status);
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
    this.status.mapX = 0;
    this.status.mapY = 0;
    this.getItem(MS_Item[0]);
    this.getItem(MS_Item[1]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[7]);
    this.getItem(MS_Item[8]);
  }

  getPlayerData = _ => this.status;

  respawn() {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.status.hp = this.status.maxHp;
    this.move(x, y);
  }

  diceRoll = diceText => this.core.diceRoll(diceText);

  trappedIn({ dmg, difficulty, name }) {
    const { addText } = this;
    const s = this.diceRoll("1d20") + 0; //Todo
    const point = (difficulty <= s) ? 0 : this.diceRoll(dmg);
    if (point) {
      addText(`ウップス!!  ${name}という、罠にハマった！`);
      this.applyDamage(point);
      return true;
    }
    return false;
  }

  escapeTrap() {
    const { addText } = this;
    addText(`しかし、発動前にヒョイっと避けた！`);
  }

  applyDamage(point) {
    const { addText } = this;
    addText(`いてえ！  ${point} ポイントのダメージをくらった！`);
    const hp = this.status.hp - point;
    this.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      // 死亡
      this.died();
      return true;
    }
    return false;
  }

  died() {
    const { addText } = this;
    addText(`し  ん  だ  よ`);
    this.respawn();
  }

  moveConfirmed(x, y) {
    const { mainMap } = this;
    super.moveConfirmed()
    // センタリング
    mainMap.center(x, y);
  }

  discoverChest() {
    const { addText } = this;
    addText(`宝箱だ！`);
  }

  discoverDoor() {
    const { addText } = this;
    addText(`しまった！ 閉まったドアだ！`);
  }

  openDoor() {
    const { addText } = this;
    addText(`ドアを開けた！`);
  }

  getItem(item) {
    const { addText } = this;
    item.uuid = this.getUUID()
    this.status.items.push(item);
    const itemList = this.status.items.map(({ itemName, uuid, id, itemTypeName }) => `${uuid}:${itemName}:${id}:${itemTypeName}`).join('\n')
    addText(`${item.itemName}をGETした！`);
    addText(`${itemList}`, 30);
  }

  items = _ => this.status.items;

  getEquipments = _ => this.status.equipments;

  healHp(n, { itemName }) {
    const { addText } = this;
    const { name, hp, maxHp } = this.status;
    const oldHp = hp;
    this.status.hp += n;
    this.status.hp = Math.min(this.status.hp, maxHp);
    const point = this.status.hp - oldHp;
    addText(`${name} は、${itemName} を使用して ${point} ポイント回復した。\nうまし！`);
  }

  // itemを使用したあとの処理
  itemUsed(item, index) {
    this.status.items.splice(index, 1);
  }

  // 装備する
  equipment(item, index) {
    const { type } = item;
    this.status.equipments[type] = { index, ...item }
  }

  update = (/*delta*/) => {
    const { core: { input, handleStepUpdate, isWindowOpen,/*, addText*/ }, mainMap,
      status,
      status:
      { beforeUpdate,
        afterUpdate,
        trialMove,
        isMove,
        stay,
      },
      sprite } = this;
    if (isWindowOpen) return;
    beforeUpdate();
    const inputMap = {
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


