import IL_Common from "../logic/items/IL_Common"
import IL_Recovery from "../logic/items/IL_Recovery"
import IL_Ring from "../logic/items/IL_Ring"
import IL_Scroll from "../logic/items/IL_Scroll"

const ITEM_TYPE = {
  recovery: 'recovery',
  weapon: 'weapon',
  armour: 'armour',
  scroll:'scroll',
  ring:'ring',
}

export default [
  {
    id: "yakuso",
    itemName: "よゆちょんぶっちそう",
    type: ITEM_TYPE.recovery,
    value: "1d6+2",
    prace: 4,
    itemLogicClass: IL_Recovery
  },
  {
    id: "dagger",
    itemName: "ダガー",
    type: ITEM_TYPE.weapon,
    value: "1d4+2",
    prace: 4,
    itemLogicClass: IL_Common
  },
  {
    id: "leather-armor",
    itemName: "レザーアーマー",
    type: ITEM_TYPE.armour,
    value: "11+dex",
    prace: 4,
    itemLogicClass: IL_Common
  },
  {
    id: "potion",
    itemName: "回復ポーション",
    type: ITEM_TYPE.recovery,
    value: "2d4+2",
    price: 8,
    itemLogicClass: IL_Recovery
  },
  {
    id: "long-sword",
    itemName: "ロングソード",
    type: ITEM_TYPE.weapon,
    value: "1d8+3",
    price: 10,
    itemLogicClass: IL_Common
  },
  {
    id: "chain-mail",
    itemName: "チェインメイル",
    type: ITEM_TYPE.armour,
    value: "13+dex",
    price: 12,
    itemLogicClass: IL_Common
  },
  {
    id: "mana-potion",
    itemName: "マナポーション",
    type: ITEM_TYPE.recovery,
    value: "1d8+4",
    price: 10,
    itemLogicClass: IL_Recovery
  },
  {
    id: "shortbow",
    itemName: "ショートボウ",
    type: ITEM_TYPE.weapon,
    value: "1d6+1",
    price: 6,
    itemLogicClass: IL_Common
  },
  {
    id: "plate-armor",
    itemName: "プレートアーマー",
    type: ITEM_TYPE.armour,
    value: "18",
    price: 20,
    itemLogicClass: IL_Common
  },
  {
    id: "antidote",
    itemName: "解毒薬",
    type: ITEM_TYPE.recovery,
    value: "1",
    price: 2,
    itemLogicClass: IL_Recovery
  },
  {
    id: "greatsword",
    itemName: "グレートソード",
    type: ITEM_TYPE.weapon,
    value: "2d6+4",
    price: 15,
    itemLogicClass: IL_Common
  },
  {
    id: "crossbow",
    itemName: "クロスボウ",
    type: ITEM_TYPE.weapon,
    value: "1d8+2",
    price: 10,
    itemLogicClass: IL_Common
  },
  {
    id: "scale-armor",
    itemName: "スケイルアーマー",
    type: ITEM_TYPE.armour,
    value: "14+dex",
    price: 14,
    itemLogicClass: IL_Common
  },
  {
    id: "elixir",
    itemName: "エリクサー",
    type: ITEM_TYPE.recovery,
    value: "full",
    price: 25,
    itemLogicClass: IL_Recovery
  },
  {
    id: "staff",
    itemName: "スタッフ",
    type: ITEM_TYPE.weapon,
    value: "1d6+1",
    price: 5,
    itemLogicClass: IL_Common
  },
  {
    id: "shield",
    itemName: "シールド",
    type: ITEM_TYPE.armour,
    value: "+2",
    price: 8,
    itemLogicClass: IL_Common
  },
  {
    id: "speed-potion",
    itemName: "速さのポーション",
    type: ITEM_TYPE.recovery,
    value: "1d4",
    price: 7,
    itemLogicClass: IL_Recovery
  },
  {
    id: "warhammer",
    itemName: "ウォーハンマー",
    type: ITEM_TYPE.weapon,
    value: "1d8+3",
    price: 12,
    itemLogicClass: IL_Common
  },
  {
    id: "splint-armor",
    itemName: "スプリントアーマー",
    type: ITEM_TYPE.armour,
    value: "17",
    price: 18,
    itemLogicClass: IL_Common
  },
  {
    id: "revival-potion",
    itemName: "復活のポーション",
    type: ITEM_TYPE.recovery,
    value: "50%",
    price: 20,
    itemLogicClass: IL_Recovery
  },
  {
    id: "flail",
    itemName: "フレイル",
    type: ITEM_TYPE.weapon,
    value: "1d8+2",
    price: 10,
    itemLogicClass: IL_Common
  },
  {
    id: "ring-of-protection",
    itemName: "プロテクションリング",
    type: ITEM_TYPE.ring,
    value: "+1",
    price: 15,
    itemLogicClass: IL_Common
  },
  {
    id: "fire-scroll",
    itemName: "火のスクロール",
    type: ITEM_TYPE.scroll,
    value: "2d6",
    price: 5,
    itemLogicClass: IL_Scroll
  },
  {
    id: "ice-scroll",
    itemName: "氷のスクロール",
    type: ITEM_TYPE.scroll,
    value: "1d10",
    price: 5,
    itemLogicClass: IL_Scroll
  },
  {
    id: "thunder-scroll",
    itemName: "雷のスクロール",
    type: ITEM_TYPE.scroll,
    value: "2d4+2",
    price: 5,
    itemLogicClass: IL_Scroll
  },
  {
    id: "mace",
    itemName: "メイス",
    type: ITEM_TYPE.weapon,
    value: "1d6+2",
    price: 8,
    itemLogicClass: IL_Common
  },
  {
    id: "ring-of-strength",
    itemName: "力のリング",
    type: ITEM_TYPE.ring,
    value: "+2",
    price: 12,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-dexterity",
    itemName: "敏捷のリング",
    type: ITEM_TYPE.ring,
    value: "+2",
    price: 12,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-intelligence",
    itemName: "知性のリング",
    type: ITEM_TYPE.ring,
    value: "+2",
    price: 12,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-constitution",
    itemName: "体力のリング",
    type: ITEM_TYPE.ring,
    value: "+2",
    price: 12,
    itemLogicClass: IL_Ring
  }
]
