import Actor from "./Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

class Player extends Actor {
  constructor() {
    super({
      lv: 1,
      hp: 10,
      mp: 10,
      maxHp: 10,
      maxMp: 10,
      gender: MS_Gender.male.value,
      race: MS_Race.human,
    });
  }
}
export default Player;