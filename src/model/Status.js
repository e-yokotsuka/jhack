import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

const Status = ({
  lv = 1,
  exp = 0,
  hp = 0,
  mp = 0,
  maxHp = 0,
  maxMp = 0,
  str = 0,
  con = 0,
  intl = 0,
  wiz = 0,
  cha = 0,
  gender = MS_Gender.male.value,
  race = MS_Race.human,
}) => {
  const s = {
    lv,
    exp,
    hp,
    mp,
    maxHp,
    maxMp,
    str,
    con,
    intl,
    wiz,
    cha,
    gender,
    race,
    mapX: 0,
    mapY: 0,
    items: [],
    equipments: {
      head: {},
      body: {},
      lefthand: {},
      righthand: {},
      foot: {},
    },
    magic: {
      black: {},
      white: {}
    }
  }
  return s;
}
export default Status;