import { v4 as uuidv4 } from 'uuid';

class SP_Actor {
  constructor(core, status) {
    this.core = core;
    this.status = status;
  }

  move(x, y) {
    this.status.virtualX = x;
    this.status.virtualY = y;
    this.status.isStay = true;
    this.status.force_update = true;
    this.moveConfirmed(x, y);
  }

  moveConfirmed(/* x,y */) {
    const { status } = this;
    status.moveConfirmed();
  }

  //罠をよけた
  escapeTrap() { console.log("escapeTrap") }

  //罠にはまった
  trappedIn() { console.log("trappedIn") }

  //ダメージを食らった
  applyDamage() { console.log("applyDamage") }

  //死んだ
  died() { console.log("died") }

  //アイテムを手に入れた
  getItem(item) {
    const { addText } = this;
    const newItem = { ...item }; //参照を切り離す
    newItem.uuid = this.getUUID()
    this.status.items.push(newItem);
    const itemList = this.status.items.map(({ itemName, uuid, id, itemTypeName }) => `${uuid}:${itemName}:${id}:${itemTypeName}`).join('\n')
    addText(`${newItem.itemName}をGETした！`);
    addText(`${itemList}`, 30);
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
  equipment(item) { this.status.equipment(item) }

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

  getUUID = _ => uuidv4();

  addText = (text, time) => {
    const { core: { addText } } = this;
    addText(text, time);
  }

}

export default SP_Actor;


