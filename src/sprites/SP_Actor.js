import { CELL_SIZE } from "../define";
import { MAGIC_ATTRIBUTE } from "../data/MS_Magics";
import { distance } from "../tools/Calc";
import { v4 as uuidv4 } from 'uuid';

class SP_Actor {
  constructor({ core, scene, status }) {
    this.core = core;
    this.scene = scene;
    this.status = status;
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

  play(name) {
    this.scene.play(name, this);
  }

  // 攻撃前
  beforeAttack(wepon, target) {
    const { characterName, addText } = this;
    const { characterName: targetName } = target;
    const { itemName } = wepon;
    this.play('sword_slash_2');
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
    const { addText, scene, x, y } = this;
    if (!silent) {
      target ?
        addText(`いって！ ${target.characterName} の攻撃で ${point} ポイントのダメージをくらった！`) :
        addText(`いてえ！ ${point} ポイントのダメージをくらった！`);
    }
    if (target) this.addTarget(target.uuid);
    scene.addDisplayPoint({ x: x + (CELL_SIZE / 2), y, pointText: `${point}` });
    const hp = this.status.hp - point;
    this.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      // 死亡
      this.play('strike_8');
      this.died(target);
      return true;
    }
    return false;
  }

  getTargetList() {
    return this.status.targetsIds.map(uuid => this.scene.getEnemyById(uuid));
  }

  selectAttackTarget() {
    const list = this.getTargetList();
    list.push(this.scene.getPlayer()); // プレイヤーを追加
    const { mapX, mapY } = this;
    list.sort((prev, curr) => {
      return distance({ mapX, mapY }, { mapX: prev.mapX, mapY: prev.mapY })
        - distance({ mapX, mapY }, { mapX: curr.mapX, mapY: curr.mapY });
    })
    return list[0];
  }

  applyExp(target) {
    const { addText, characterName } = this;
    const { expReward } = target;
    this.status.exp += expReward;
    addText(`${characterName} は ${expReward} の経験値を得た！`);
    this.checkExp();
  }

  checkExp() {
    this.scene.battleLogic.levelup({ offense: this });
  }

  died() {
    const { addText } = this;
    addText(`し  ん  だ  よ`);
  }

  addTarget(uuid) { // プレイヤー以外は敵対アクターのuuidを格納する
    if (!this.isPlayer && !this.status.targetsIds.includes(uuid))
      this.status.targetsIds.push(uuid)
  }
  //罠をよけた
  escapeTrap() { console.log("escapeTrap") }

  //罠にはまった
  trappedIn() { console.log("trappedIn") }

  //アイテムを手に入れた
  getItem(item) {
    const { addText } = this;
    const newItem = { ...item }; //参照を切り離す
    newItem.uuid = uuidv4()
    this.status.items.push(newItem);
    addText(`${newItem.itemName}をGETした！`);
  }

  // 魔法を覚える
  learnSpell(magic) {
    const { addText } = this;
    const newMagic = { ...magic }; //参照を切り離す
    newMagic.uuid = uuidv4()
    if (newMagic.magicAttribute === MAGIC_ATTRIBUTE.white) {
      this.status.magics.white.push(newMagic);
    }
    if (newMagic.magicAttribute === MAGIC_ATTRIBUTE.black) {
      this.status.magics.black.push(newMagic);
    }
    addText(`スペル ${newMagic.magicName}を徹夜して覚えた！`);
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

  //精神力を使う
  useMp(useMp) { this.status.mp = Math.max(0, this.status.mp - useMp) }

  //装備
  equipment(item, forceItemType) { this.status.equipment(item, forceItemType) }

  // itemを使用したあとの処理
  itemUsed(item, index) {
    this.status.items.splice(index, 1);
    this.status.stay({ force: true });
  }

  // magicを使用したあとの処理
  magicUsed(/* magic */) {
    this.status.stay({ force: true });
  }

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

  getUUID = _ => this.status.uuid;

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
  get uuid() { return this.status.uuid }
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
  get modifiers() { return this.status.modifiers } // 初期修正値
  get expReward() { return this.status.expReward } // 付与経験値
  get mapX() { return this.status.mapX }
  get mapY() { return this.status.mapY }
  get isPlayer() { return this.status.isPlayer }
  get isStay() { return this.status.isStay }
  get isForceUpdate() { return this.status.force_update }
  get x() { return this.sprite.x }
  get y() { return this.sprite.y }
  get cx() { return this.sprite.x + (CELL_SIZE / 2) }
  get cy() { return this.sprite.y + (CELL_SIZE / 2) }

}

export default SP_Actor;


