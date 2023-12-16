import { EMPTY_ITEM_INDEX, EMPTY_WEPON_INDEX } from "../define"

import MS_Gender from "../data/MS_Gender";
import MS_Item from "../data/MS_Item";
import MS_Race from "../data/MS_Race";
import { v4 as uuidv4 } from 'uuid';

export const BehaviorTypes = {
  FRIENDLY: "friendly", // 友好的
  AGGRESSIVE: "aggressive", // 好戦的
  VERY_AGGRESSIVE: "very_aggressive" // 超好戦的
};

const MD_Status = ({
  lv = 1,
  characterName,
  isPlayer = false,
  currentBehavior = BehaviorTypes.FRIENDLY,
  exp = 0,
  nextExp = 200,
  expReward,
  targetsIds = [],//敵とみなすID
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
  modifiers = { // 修正値
    str: 0,
    dex: 0,
    con: 0,
    intl: 0,
    wiz: 0,
    cha: 0,
  },
  effects = [],
  gender = MS_Gender.male.value,
  race = MS_Race.human,
  force_update = false,
  speed = 1
}) => ({
  uuid: uuidv4(),
  lv, // レベル
  characterName, //キャラクター名
  isPlayer, // プレイヤーか？
  currentBehavior, // 関係
  exp, // 経験値
  nextExp, // 次のレベルアップに必要な経験値
  expReward,
  targetsIds,
  hp,
  mp,
  maxHp, // 最大体力
  maxMp, // 最大精神力
  isStay,
  lock,
  str, // 強さ
  dex, // 俊敏さ
  con, // 強靭さ
  intl, // 知性
  wiz, // 知恵
  cha, // カリスマ
  modifiers,
  effects, // 眠り、マヒなどの効果
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
  magics: {
    black: [],
    white: []
  },
  steps: 0,//歩数
  speed,
  walkCounter: 0,
  force_update
});
export default MD_Status;