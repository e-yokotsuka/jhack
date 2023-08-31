import { sound } from '@pixi/sound';
import { v4 as uuidv4 } from 'uuid';

class SP_Actor {
  constructor({ core, scene, status }) {
    this.core = core;
    this.scene = scene;
    this.status = status;
    this.uuid = this.getUUID();
  }

  move(x, y) {
    this.status.virtualX = x;
    this.status.virtualY = y;
    this.status.isStay = true;
    this.status.force_update = true;
    this.moveConfirmed(x, y);
  }

  teleportation(x, y) {
    this.status.teleportation(x, y);
  }

  moveConfirmed(/* x,y */) {
    const { status } = this;
    status.moveConfirmed();
  }

  weponAttack({ offense, defense }) {
    this.scene.battleLogic.weponAttack({ offense, defense });
  }

  determineInitiative(acters) {
    return this.scene.battleLogic.determineInitiative(acters);
  }

  // 攻撃前
  beforeAttack(wepon, target) {
    const { characterName, addText } = this;
    const { characterName: targetName } = target;
    const { itemName } = wepon;
    sound.play('sword_slash_2');
    addText(`${characterName} は ${targetName} に ${itemName} で攻撃！`);
  }

  // 攻撃をはずした
  attackMissed(wepon) {
    const { addText } = this;
    const { itemName } = wepon;
    addText(`${itemName} を使った攻撃は外れた！`);
  }

  // 攻撃をブロックした
  blockAttack(target) {
    const { addText } = this;
    const { characterName: targetName } = target;
    addText(`${targetName}からの攻撃を防具で防いだ！`);
  }

  // ダメージをくらった
  applyDamage({ point, target, silent = false }) {
    const { addText } = this;
    if (!silent) {
      target ?
        addText(`いって！ ${target.characterName} の攻撃で ${point} ポイントのダメージをくらった！`) :
        addText(`いてえ！ ${point} ポイントのダメージをくらった！`);
    }
    const hp = this.status.hp - point;
    this.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      // 死亡
      sound.play('strike_8');
      this.died(target);
      return true;
    }
    return false;
  }

  applyExp(target) {
    const { addText, characterName } = this;
    const { expReward } = target;
    this.status.exp += expReward;
    addText(`${characterName} は ${expReward} の経験値を得た！`);
  }

  died() {
    const { addText } = this;
    addText(`し  ん  だ  よ`);
  }

  //罠をよけた
  escapeTrap() { console.log("escapeTrap") }

  //罠にはまった
  trappedIn() { console.log("trappedIn") }

  //アイテムを手に入れた
  getItem(item) {
    const { addText } = this;
    const newItem = { ...item }; //参照を切り離す
    newItem.uuid = this.getUUID()
    this.status.items.push(newItem);
    addText(`${newItem.itemName}をGETした！`);
    // const itemList = this.status.items.map(({ itemName, uuid, id, itemTypeName }) => `${uuid}:${itemName}:${id}:${itemTypeName}`).join('\n')
    // addText(`${itemList}`, 30);
  }

  //ドアをみつけた
  discoverDoor() { console.log("discoverDoor") }

  //ドアをあけた
  openDoor() { console.log("openDoor") }

  //ドアを閉じた
  closeDoor() { console.log("closeDoor") }

  //体力を回復
  healHp() { console.log("healHp") }

  //精神力を回復
  healMp() { console.log("healMp") }

  //装備
  equipment(item, forceItemType) { this.status.equipment(item, forceItemType) }

  //装備可能なアイテム一覧
  equipmentItems() { return [] }

  //装備をはずす
  removeEquipment() { console.log("removeEquipment") }

  //チェストをみつけた
  discoverChest() { console.log("removeEquipment") }

  //からっぽのチェストをみつけた
  discoverEmptyChest() { console.log("discoverEmptyChest") }

  //所持itemをかえす
  getItems() { console.log("getItems") }

  //攻撃
  attack(/* target */) {
  }

  diceRoll = ({ diceText, status }) => this.core.diceRoll({ diceText, status });

  getUUID = _ => uuidv4();

  addText = (text, time) => {
    const { scene: { addText } } = this;
    addText(text, time);
  }

  goToPrevLevel() {
    console.log("goToPrevLevel")
  }

  goToNextLevel() {
    console.log("goToNextLevel")
  }

  getCharacterName = _ => this.status.characterName

  // パラメタ (シンタックスシュガー)
  // 装備をかえす
  get equipments() { return this.status.getEquipments() }
  get characterName() { return this.status.characterName }
  get hp() { return this.status.hp }
  get mp() { return this.status.mp }
  get maxHp() { return this.status.maxHp }
  get maxMp() { return this.status.maxMp }
  get str() { return this.status.str } // 強さ
  get dex() { return this.status.dex } // 俊敏性
  get con() { return this.status.con } // 体力
  get intl() { return this.status.intl } // 知性
  get wiz() { return this.status.wiz } //知恵
  get cha() { return this.status.cha } // 魅力
  get expReward() { return this.status.expReward } // 付与経験値
  get mapX() { return this.status.mapX }
  get mapY() { return this.status.mapY }
  get x() { return this.sprite.x }
  get y() { return this.sprite.y }

}

export default SP_Actor;


