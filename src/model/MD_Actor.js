import { AVAILABLE_EQUIP_TYPES, ITEM_TYPE } from "../data/MS_Item";

import MD_Status from "./MD_Status";

class MD_Actor {
  constructor(status) {
    Object.keys(MD_Status({ ...status })).forEach(key => this[key] = status[key]);
  }

  //仮の移動を行う
  trialMove = (direction = '.') => {
    if (this.lock) return; //ロック中(UI表示中など)は、移動不可
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

  // とどまる
  stay() { this.lock ? null : this.isStay = true; }

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
  }

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
  }

}

export default MD_Actor;