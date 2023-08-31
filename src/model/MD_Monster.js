import MD_Actor from "./MD_Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

class MD_Monster extends MD_Actor {
  constructor(status) {
    super({
      lv: 1,
      characterName: '',
      hp: 10,
      mp: 10,
      speed: 0.3,
      maxHp: 10,
      maxMp: 10,
      expReward: 100,
      gender: MS_Gender.male.value,
      race: MS_Race.human,
      position: {
        x: 0,
        y: 0
      },
      steps: 0,//歩数
      items: [],
      ...status
    });
  }
}
export default MD_Monster;