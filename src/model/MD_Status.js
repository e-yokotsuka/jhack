import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

const MD_Status = ({
  lv = 1,
  exp = 0,
  hp = 0,
  mp = 0,
  virtualX = 0,//移動先の座標
  virtualY = 0,//移動先の座標
  mapX = 0,//現在値のマップ座標
  mapY = 0,//現在値のマップ座標
  maxHp = 0,
  maxMp = 0,
  stay = false,
  lock = false,
  str = 0,
  con = 0,
  intl = 0,
  wiz = 0,
  cha = 0,
  gender = MS_Gender.male.value,
  race = MS_Race.human,
  force_update = false
}) => ({
  lv,
  exp,
  hp,
  mp,
  maxHp,
  maxMp,
  stay,
  lock,
  str,
  con,
  intl,
  wiz,
  cha,
  gender,
  race,
  virtualX,
  virtualY,
  mapX,
  mapY,
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
  },
  steps: 0,//歩数
  force_update,
});
export default MD_Status;