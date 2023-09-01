import { EMPTY_ITEM_INDEX, EMPTY_WEPON_INDEX } from "../define"

import MS_Gender from "../data/MS_Gender";
import MS_Item from "../data/MS_Item";
import MS_Race from "../data/MS_Race";

const MD_Status = ({
  lv = 1,
  characterName,
  isPlayer = false,
  exp = 0,
  nextExp = 0,
  expReward,
  hp = 0,
  mp = 0,
  virtualX = 0,//移動先の座標
  virtualY = 0,//移動先の座標
  mapX = 0,//現在値のマップ座標
  mapY = 0,//現在値のマップ座標
  maxHp = 0,
  maxMp = 0,
  isStay = false,
  lock = false,
  str = 10,// 最大99999
  dex = 10,
  con = 10,
  intl = 10,
  wiz = 10,
  cha = 10,
  gender = MS_Gender.male.value,
  race = MS_Race.human,
  force_update = false,
  speed = 1
}) => ({
  lv,
  characterName,
  isPlayer,
  exp,
  nextExp,
  expReward,
  hp,
  mp,
  maxHp,
  maxMp,
  isStay,
  lock,
  str,
  dex,
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
  isDie: false,
  equipments: {
    armour: MS_Item[EMPTY_ITEM_INDEX],
    weapon: MS_Item[EMPTY_WEPON_INDEX],
    ring: MS_Item[EMPTY_ITEM_INDEX],
    shield: MS_Item[EMPTY_ITEM_INDEX],
  },
  magic: {
    black: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    white: [{}, {}, {}, {}, {}, {}, {}, {}, {}]
  },
  steps: 0,//歩数
  speed,
  walkCounter: 0,
  force_update
});
export default MD_Status;