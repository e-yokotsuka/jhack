import { EMPTY_ITEM_INDEX } from "../define"
import MD_Actor from "./MD_Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Item from "../data/MS_Item";
import MS_Race from "../data/MS_Race";

class MD_Player extends MD_Actor {
  constructor() {
    super({
      characterName: "ゆーしゃ",
      lv: 1,
      hp: 10,
      mp: 10,
      maxHp: 10,
      maxMp: 10,
      gender: MS_Gender.male.value,
      race: MS_Race.human,
      equipments: {
        armour: MS_Item[EMPTY_ITEM_INDEX],
        weapon: MS_Item[EMPTY_ITEM_INDEX],
        ring: MS_Item[EMPTY_ITEM_INDEX],
        shield: MS_Item[EMPTY_ITEM_INDEX],
      },
      position: {
        x: 0,
        y: 0
      },
      speed: 1,
      steps: 0,//歩数
      items: []
    });
  }
}
export default MD_Player;

