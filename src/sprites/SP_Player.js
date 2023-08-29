import { AVAILABLE_EQUIP_TYPES } from "../data/MS_Item";
import { CELL_SIZE } from "../define";
import MD_Player from '../model/MD_Player';
import MS_Item from "../data/MS_Item";
import SP_Actor from './SP_Actor';
import { Sprite } from 'pixi.js';

class SP_Player extends SP_Actor {

  constructor({ core, scene, name = "human" }) {
    const status = new MD_Player({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
    super({ core, scene, status });
    const { textures: { tx_main } } = core;
    const { mainMap } = scene;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    this.healHp.bind(this);
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    this.sprite = sprite;
    this.status.mapX = 0;
    this.status.mapY = 0;
    this.getItem(MS_Item[1]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[16]);
    this.getItem(MS_Item[17]);
    this.getItem(MS_Item[18]);
    this.getItem(MS_Item[19]);
    this.getItem(MS_Item[20]);
    this.getItem(MS_Item[21]);
    this.getItem(MS_Item[22]);
    this.getItem(MS_Item[23]);
    this.getItem(MS_Item[24]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[2]);
    this.getItem(MS_Item[3]);
    this.getItem(MS_Item[4]);
    this.getItem(MS_Item[5]);
    this.getItem(MS_Item[6]);
    this.getItem(MS_Item[7]);
    this.getItem(MS_Item[8]);
    const { status: { trialMove } } = this;
    this.inputMap = {
      'w': _ => trialMove('u'),
      's': _ => trialMove('d'),
      'a': _ => trialMove('l'),
      'd': _ => trialMove('r'),
      '.': _ => this.status.stay(),
      'ArrowUp': _ => trialMove('u'),
      'ArrowDown': _ => trialMove('d'),
      'ArrowLeft': _ => trialMove('l'),
      'ArrowRight': _ => trialMove('r'),
    };
  }

  setMap = mainMap => {
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
  };

  getPrim = _ => this.sprite;

  getStatus = _ => this.status;

  respawn() {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.status.hp = this.status.maxHp;
    this.move(x, y);
  }

  trappedIn({ dmg, difficulty, name }) {
    const { addText, status } = this;
    const s = this.diceRoll({ diceText: "1d20+dex", status });
    const point = (difficulty <= s) ? 0 : this.diceRoll({ diceText: dmg });
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

  goToPrevLevel(v) {
    const { addText } = this;
    addText(`上り階段じゃないか！いくぞ！${v}`);
    this.scene.goto(v);
  }

  goToNextLevel(v) {
    const { addText } = this;
    addText(`下り階段じゃないか！いくぞ！${v}`);
    this.scene.goto(v);
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

  items = _ => this.status.items;

  getEquipments = _ => this.status.equipments;

  isItemEquipped = item => this.status.isItemEquipped(item);

  //装備可能なアイテムの一覧
  equipmentItems() {
    return this.items().filter(({ itemType }) => AVAILABLE_EQUIP_TYPES.includes(itemType));
  }

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

  checkCollision = _ => {
    const { mainMap, status, addText } = this;
    const { virtualX: vx, virtualY: vy } = status;

    const tile = mainMap.getTile(vx, vy);
    const selfUuid = this.uuid;
    const monsters = this.scene.getEnemys();
    const collisions = monsters.filter(({ uuid, status: { mapX, mapY } }) => uuid != selfUuid && mapX === vx && mapY === vy);
    collisions.forEach(m => {
      addText(`${this.getCharacterName()} は ${m.getCharacterName()} とぬめっと触れ合った`);
    })
    return tile.hit({ actor: this, status }) || collisions.length
  }

  update = (/*delta*/) => {
    const { core: { input },
      scene: { handleStepUpdate, isWindowOpen,/*, addText*/ },
      mainMap,
      inputMap,
      status,
      status:
      { beforeUpdate,
        afterUpdate,
        isMove,
      },
      sprite } = this;
    if (isWindowOpen) return;
    beforeUpdate();
    const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
    if (key) inputMap[key]();

    sprite.x = mainMap.mapContainer.x + status.mapX * CELL_SIZE;
    sprite.y = mainMap.mapContainer.y + status.mapY * CELL_SIZE;
    if (!isMove()) return; // 動いていない
    // 動いた
    const { virtualX: vx, virtualY: vy } = status;
    handleStepUpdate(vx, vy);
    this.checkCollision() || this.moveConfirmed(vx, vy);
    status.steps++;
    afterUpdate();
  }

  // ステータスプロパティのシンタックスシュガー

  get mapX() { return this.status.mapX }
  get mapY() { return this.status.mapY }

}

export default SP_Player;


