import MD_Actor from "./MD_Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

class MD_Player extends MD_Actor {
  constructor() {
    super({
      name: "ゆーしゃ",
      lv: 1,
      hp: 10,
      mp: 10,
      maxHp: 10,
      maxMp: 10,
      gender: MS_Gender.male.value,
      race: MS_Race.human,
      equipments: {
        armour: {},
        weapon: {},
        ring: {},
        shield: {},
      },   
      position: {
        x: 0,
        y: 0
      },
      steps: 0,//歩数
      items: []
    });
  }
}
export default MD_Player;