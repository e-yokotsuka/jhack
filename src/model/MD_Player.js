import { EMPTY_ITEM_INDEX, EMPTY_WEPON_INDEX } from "../define"

import MD_Actor from "./MD_Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Item from "../data/MS_Item";
import MS_Race from "../data/MS_Race";

class MD_Player extends MD_Actor {
  constructor() {
    super({
      characterName: "ゆーしゃ",
      isPlayer: true,
      lv: 1,
      hp: 30,
      mp: 300,
      maxHp: 30,
      maxMp: 300,
      gender: MS_Gender.male.value,
      race: MS_Race.human,
      equipments: {
        armour: MS_Item[EMPTY_ITEM_INDEX],
        weapon: MS_Item[EMPTY_WEPON_INDEX],
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

