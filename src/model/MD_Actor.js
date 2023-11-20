import { AVAILABLE_EQUIP_TYPES, ITEM_TYPE } from "../data/MS_Item";

import BehaviorTypes from "./MD_Status";
import MD_Status from "./MD_Status";

// 性格特性に基づいた行動パターンを示すオブジェクト
const behaviorPatterns = {
  [BehaviorTypes.FRIENDLY]: {
    attackPlayers: false,
    attackMonsters: false
  },
  [BehaviorTypes.AGGRESSIVE]: {
    attackPlayers: true,
    attackMonsters: false
  },
  [BehaviorTypes.VERY_AGGRESSIVE]: {
    attackPlayers: true,
    attackMonsters: true
  }
};

class MD_Actor {
  constructor(status) {
    const defaultStatus = MD_Status({ ...status });
    const keys = Object.keys(defaultStatus);
    for (const key of keys) {
      this[key] = key in status ? status[key] : defaultStatus[key]
    }
    this.isTeleportation = false;
  }

  //仮の移動を行う
  trialMove = (direction = '.') => {
    if (this.lock) return; //ロック中(UI表示中など)は、移動不可
    this.walkCounter += this.speed;
    if (this.walkCounter < 1) return;
    this.walkCounter = (this.walkCounter - 1) % this.speed;
    const { mapX, mapY } = this;
    let virtualX = mapX;
    let virtualY = mapY;

    const f = {
      "l": _ => virtualX = mapX - 1,
      "r": _ => virtualX = mapX + 1,
      "u": _ => virtualY = mapY - 1,
      "d": _ => virtualY = mapY + 1,
      ".": _ => _
    }
    console.assert(f[direction], `The specified movement direction code '${direction}' does not exist. `)
    f[direction]?.()
    this.virtualX = virtualX;
    this.virtualY = virtualY;
  }

  //移動確定
  moveConfirmed = _ => {
    this.mapX = this.virtualX;
    this.mapY = this.virtualY;
  }

  teleportation = (x, y) => {
    this.mapX = this.virtualX = x;
    this.mapY = this.virtualY = y;
    this.force_update = false;
    this.isTeleportation = true;
  }

  // とどまる
  stay({ force = false }) { force ? this.force_update = true : this.isStay = true; }

  //ロック
  lock() { this.lock = true; }

  //ロック解除
  unlock() { this.lock = false; }

  //ロック状態
  isLock() { return this.lock; }

  //装備する
  equipment(item, forceItemType) {
    const equipment = {
      [ITEM_TYPE.weapon]: _ => (this.equipments.weapon = item),
      [ITEM_TYPE.armour]: _ => (this.equipments.armour = item),
      [ITEM_TYPE.shield]: _ => (this.equipments.shield = item),
      [ITEM_TYPE.ring]: _ => (this.equipments.ring = item),
    }[forceItemType ? forceItemType : item.itemType];
    equipment && equipment();
    this.stay({ force: true });
  }

  getEquipments = _ => this.equipments;

  canEquip = item => AVAILABLE_EQUIP_TYPES.includes(item.itemType);

  //装備しているか？
  isItemEquipped(item) {
    const isEquipped = {
      [ITEM_TYPE.weapon]: _ => (this.equipments.weapon.uuid == item.uuid),
      [ITEM_TYPE.armour]: _ => (this.equipments.armour.uuid == item.uuid),
      [ITEM_TYPE.shield]: _ => (this.equipments.shield.uuid == item.uuid),
      [ITEM_TYPE.ring]: _ => (this.equipments.ring.uuid == item.uuid),
    }[item.itemType];
    return isEquipped && isEquipped();
  }


  // 動いたか？
  isMove = _ => (
    this.force_update
    || this.isStay
    || this.virtualX !== this.mapX
    || this.virtualY !== this.mapY)

  // フレーム更新のupdate前に呼ばれる
  beforeUpdate = _ => {
    // 強制アップデート時は位置と状態を初期化しない。
    if (this.force_update) return;
    this.isStay = false;
    this.virtualX = this.mapX;
    this.virtualY = this.mapY;
  }

  // フレーム更新のupdate後に呼ばれる
  afterUpdate = _ => {
    this.force_update = false;
    this.isTeleportation = false;
  }

  getBehaviorPatterns = _ => behaviorPatterns[this.currentBehavior];

  serialize() {
    const defaultStatus = MD_Status({});
    const keys = Object.keys(defaultStatus);
    const obj = {};
    for (const key of keys) {
      obj[key] = this[key]
    }
    const savedata = JSON.stringify(obj);
    return savedata;
  }

}

export default MD_Actor;