import ML_FireBoll from "../logic/magics/ML_FireBoll";
import ML_Recovery from "../logic/magics/ML_Recovery";

const MAGIC_TYPE = {
  recovery: 'recovery',
  attack: 'attack',
  defance: 'defance',
  effect: 'effect',
  tool: 'tool',
}

const MAGIC_ATTRIBUTE = {
  white: "white",
  black: "black"
}

const MAGIC_ATTRIBUTE_NAME = {
  white: "白魔法",
  black: "黒魔法"
}

const MAGIC_TYPE_NAME = {
  recovery: '回復系',
  attack: '攻撃系',
  defance: '防御系',
  effect: '効果系',
  tool: 'ツール系',
}


export { MAGIC_TYPE, MAGIC_ATTRIBUTE, MAGIC_ATTRIBUTE_NAME };

export default [
  {
    id: "heal1",
    uuid: "",
    level: 1,
    magicName: "カイフキュー",
    magicAttribute: MAGIC_ATTRIBUTE.white,
    magicType: MAGIC_TYPE.recovery,
    magicTypeName: MAGIC_TYPE_NAME[MAGIC_TYPE.recovery],
    value: "1d6+2",
    valueLabel: "回復値",
    mp: 4,
    magicLogicClass: ML_Recovery
  },
  {
    id: "heal2",
    uuid: "",
    level: 2,
    magicName: "カイフキュキュー",
    magicAttribute: MAGIC_ATTRIBUTE.white,
    magicType: MAGIC_TYPE.recovery,
    magicTypeName: MAGIC_TYPE_NAME[MAGIC_TYPE.recovery],
    value: "1d8+2",
    valueLabel: "回復値",
    mp: 4,
    magicLogicClass: ML_Recovery
  },
  {
    id: "fireboll",
    uuid: "",
    level: 2,
    range: 5,
    magicName: "ファイヤーボール",
    magicAttribute: MAGIC_ATTRIBUTE.black,
    magicType: MAGIC_TYPE.attack,
    magicTypeName: MAGIC_TYPE_NAME[MAGIC_TYPE.attack],
    value: "2d10+0",
    valueLabel: "火炎ダメージ",
    mp: 4,
    magicLogicClass: ML_FireBoll
  },
]
