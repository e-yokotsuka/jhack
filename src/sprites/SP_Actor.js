import { BehaviorTypes } from "../model/MD_Status";
import { CAN_NOT_ACTION_EFFECTS } from "../define";
import { CELL_SIZE } from "../define";
import { Container } from "pixi.js";
import EffectManager from "../logic/EffectManager";
import { MAGIC_ATTRIBUTE } from "../data/MS_Magics";
import MS_Effects from "../data/MS_Effects";
import UI_DIsplayPoint from "../ui/UI_DIsplayPoint";
import { distance } from "../tools/Calc";
import { v4 as uuidv4 } from 'uuid';

class SP_Actor {
  constructor({ core, scene, status }) {
    this.core = core;
    this.scene = scene;
    this.status = status;
    this.centerX = CELL_SIZE / 2;
    this.centerY = CELL_SIZE / 2;
    this.ui_DIsplayPoint = new UI_DIsplayPoint(core, this)
    this.container = new Container();
    this.uiContainer = new Container();
    this.uiContainer.addChild(this.ui_DIsplayPoint.getPrim())
    this.effectContainer = new Container();
    this.effectManager = new EffectManager(core, this.effectContainer);
    this.mainContainer = new Container();
    this.mainContainer.addChild(this.container);
    this.mainContainer.addChild(this.effectContainer);
    this.mainContainer.addChild(this.uiContainer);
    this.mainContainer.eventMode = 'static';
    this.mainContainer.on('click', _ => {
      const { uuid, characterName, hp, maxHp, mp, maxMp, status: { targetsIds } } = this;
      this.core.setDebugText(4, `name :${characterName} hp:${hp}/${maxHp} mp:${mp}/${maxMp}`);
      this.core.setDebugText(5, `UUID:${uuid}`);
      this.core.setDebugText(6, `targetsIds:${targetsIds}`);
      const effectsString = this.effectsString();
      this.core.setDebugText(7, `effects:${effectsString}`);
    })
  }

  effectsString() {
    const names = this.status.effects.map(e => e.name);
    return names.join(',')
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


  update(delta) {
    this.ui_DIsplayPoint.update(delta);
    this.effectManager.update(delta);
  }

  weaponAttack({ offense, defense }) {
    this.scene.battleLogic.weaponAttack({ offense, defense });
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

  onDamageReaction() {
    // 効果の処理を行う
    let effects = this.status.effects;
    effects = effects.map(effect => {
      effect.logic.onDamageReaction();
      return effect;
    });
    // 解除された効果を除外する
    this.status.effects = effects.filter(effect => !effect.isEffectCleared);
  }

  // ダメージをくらった
  applyDamage({ point, target, silent = false }) {
    const { addText } = this;
    if (!silent) {
      target ?
        addText(`いって！ ${target.characterName} の攻撃で ${point} ポイントのダメージをくらった！`) :
        addText(`いてえ！ ${point} ポイントのダメージをくらった！`);
    }
    if (target) this.addTarget(target.uuid);
    if (target && this.status.currentBehavior === BehaviorTypes.FRIENDLY) {
      // 殴られたら敵になる
      this.status.currentBehavior = BehaviorTypes.AGGRESSIVE;
    }
    this.onDamageReaction();
    this.addDisplayPoint({ x: CELL_SIZE / 2, pointText: `${point}` });
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

  addDisplayPoint = ({ x, y, pointText }) => this.ui_DIsplayPoint.addDisplayPoint({ x, y, pointText });

  getTargetList() {
    return this.status.targetsIds.map(uuid => this.scene.getEnemyById(uuid));
  }

  setTargetList(enemies) {
    this.status.targetsIds = enemies.map(enemie => enemie.uuid);
  }

  hasTarget() {
    return this.status.targetsIds?.length;
  }

  showEffect = ({ key, x, y }) => this.effectManager.setEffectPrim({ key, x, y });

  selectAttackTarget() {
    const { mapX, mapY, scene, currentBehavior } = this;
    // 敵がいない場合でVERY_AGGRESSIVEの場合は自ら敵を探す
    if (!this.hasTarget() && currentBehavior === BehaviorTypes.VERY_AGGRESSIVE) {
      const enemies = scene.getEnemiesInRange(this, 10);
      this.setTargetList(enemies);
    }
    const list = this.getTargetList();
    list.push(this.scene.getPlayer()); // プレイヤーを追加

    // filterメソッドの結果を新しい配列として保存する
    const filteredList = list.filter(m => {
      if (m) {
        const { mapX: mMapX, mapY: mMapY } = m;
        return scene.isApproachActor({ pMapX: mapX, pMapY: mapY, mMapX, mMapY });
      }
      return false;
    });

    // sortメソッドで距離に基づいてソートする
    const sortedList = filteredList.sort((prev, curr) => {
      return distance({ mapX, mapY }, { mapX: prev.mapX, mapY: prev.mapY })
        - distance({ mapX, mapY }, { mapX: curr.mapX, mapY: curr.mapY });
    });

    // ソートされたリストの最初の要素を返す
    return sortedList[0];
  }

  applyTargetsIds(targetIds) {
    this.status.targetsIds = this.status.targetsIds.filter(uuid => !targetIds.includes(uuid));
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
    if (!this.isPlayer && !this.status.targetsIds.includes(uuid)) {
      this.status.targetsIds.push(uuid)
    }
    // 攻撃を最後にうけたやつを敵とみなす
    this.status.targetsIds.sort((a, b) => (b.key === uuid) - (a.key === uuid));
  }
  //罠をよけた
  escapeTrap() { console.log("escapeTrap") }

  //罠にはまった
  trappedIn() { console.log("trappedIn") }

  applyEffect(effect) {
    effect.logic = new effect.effectLogicClass(this.core, this.scene, effect, this)
    this.status.effects.push(effect);
  }

  clearEffect(effect) {
    if (this.status.effects.some(e => e.id === effect.id)) {
      this.status.effects = this.status.effects.filter(e => e.id != effect.id);
      return true;
    }
    return false;
  }


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

  getPrim = _ => this.mainContainer;

  //=====================
  // 行動
  //=====================

  // 眠った
  doSleep() {
    // filterは若干重い気がするので必要があればあとで高速化
    const [effect] = MS_Effects.filter(({ id }) => id === 'sleep')
    const didExist = this.clearEffect(effect); // 同じ状態が存在する場合は後のもので上書きされる
    this.applyEffect({ ...effect });
    !didExist && this.addText(`${this.characterName} は、眠った`);
  }
  // おきた
  doWakeUp() {
    this.status.effects = this.status.effects.filter(({ id }) => id !== 'sleep');
    this.addText(`${this.characterName} は起きた`);
  }

  // 行動が可能ならtrueを返す
  canAct() {
    // 行動できる状態か？
    // 効果の処理を行う
    let effects = this.status.effects;
    effects = effects.map(effect => {
      const { logic } = effect;
      logic.stepUpdate()
      return effect;
    });
    // 解除された効果を除外する
    this.status.effects = effects.filter(effect => !effect.isEffectCleared);
    // 行動が可能かを判定する。
    return !this.status.effects.some(effect => CAN_NOT_ACTION_EFFECTS.includes(effect.id));
  }

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
  get currentBehavior() { return this.status.currentBehavior } // 属性
  get mapX() { return this.status.mapX }
  get mapY() { return this.status.mapY }
  get isPlayer() { return this.status.isPlayer }
  get isStay() { return this.status.isStay }
  get isForceUpdate() { return this.status.force_update }
  get x() { return this.mainContainer.x }
  get y() { return this.mainContainer.y }
  get cx() { return this.mainContainer.x + (CELL_SIZE / 2) }
  get cy() { return this.mainContainer.y + (CELL_SIZE / 2) }

}

export default SP_Actor;


