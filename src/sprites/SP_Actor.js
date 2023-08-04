import { v4 as uuidv4 } from 'uuid';

class SP_Actor {
  constructor(core, status) {
    this.core = core;
    this.status = status;
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
  getItem() { console.log("getItem") }

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
  equipment() { console.log("itemEquipment") }

  //装備をはずす
  removeEquipment() { console.log("removeEquipment") }

  //チェストをみつけた
  discoverChest() { console.log("removeEquipment") }

  //からっぽのチェストをみつけた
  discoverEmptyChest() { console.log("discoverEmptyChest") }

  //所持itemをかえす
  getItems() { console.log("getItems") }

  getUUID = _ => uuidv4();

  addText = text => {
    const { core: { addText } } = this;
    addText(text);
  }

}

export default SP_Actor;


