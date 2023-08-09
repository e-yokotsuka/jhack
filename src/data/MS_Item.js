import IL_Armour from "../logic/items/IL_Armour"
import IL_Recovery from "../logic/items/IL_Recovery"
import IL_Ring from "../logic/items/IL_Ring"
import IL_Scroll from "../logic/items/IL_Scroll"
import IL_Shield from "../logic/items/IL_Shield"
import IL_Wepon from "../logic/items/IL_Wepon"

// 値はequipmentsのプロパティ名と一致していなくてはならない
const ITEM_TYPE = {
  recovery: 'recovery',
  weapon: 'weapon',
  armour: 'armour',
  shield: 'shield',
  scroll: 'scroll',
  ring: 'ring',
  empty: 'empty',
}

const ITEM_TYPE_NAME = {
  recovery: '回復系',
  weapon: '武器',
  armour: '鎧',
  shield: '盾',
  scroll: 'まきもの',
  ring: '指輪',
  empty: '装備していません'
}

export { ITEM_TYPE };

export default [
  {//装備を外すときには空を装備する
    id: "empty",
    itemName: "なし",
    itemType: ITEM_TYPE.empty,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.empty],
    value: "0",
    valueLabel: "",
    price: 0,
    rarity: 0,
    minimumDepth: 0,
    itemLogicClass: null
  },
  {
    id: "yakuso",
    itemName: "よゆちょんぶっちそう",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "1d6+2",
    valueLabel: "回復値",
    price: 4,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "dagger",
    itemName: "ダガー",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d4+2",
    valueLabel: "ダメージ",
    price: 4,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "leather-armor",
    itemName: "レザーアーマー",
    itemType: ITEM_TYPE.armour,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.armour],
    value: "11+dex",
    valueLabel: "防御力",
    price: 4,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Armour
  },
  {
    id: "potion",
    itemName: "回復ポーション",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "2d4+2",
    valueLabel: "回復値",
    price: 8,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "long-sword",
    itemName: "ロングソード",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d8+3",
    valueLabel: "ダメージ",
    price: 10,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "chain-mail",
    itemName: "チェインメイル",
    itemType: ITEM_TYPE.armour,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.armour],
    value: "13+dex",
    valueLabel: "防御力",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Armour
  },
  {
    id: "mana-potion",
    itemName: "マナポーション",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "1d8+4",
    valueLabel: "回復値",
    price: 10,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "shortbow",
    itemName: "ショートボウ",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d6+1",
    valueLabel: "ダメージ",
    price: 6,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "plate-armor",
    itemName: "プレートアーマー",
    itemType: ITEM_TYPE.armour,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.armour],
    value: "18",
    valueLabel: "防御力",
    price: 20,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Armour
  },
  {
    id: "antidote",
    itemName: "解毒薬",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "1",
    valueLabel: "回復値",
    price: 2,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "greatsword",
    itemName: "グレートソード",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "2d6+4",
    valueLabel: "ダメージ",
    price: 15,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "crossbow",
    itemName: "クロスボウ",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d8+2",
    valueLabel: "ダメージ",
    price: 10,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "scale-armor",
    itemName: "スケイルアーマー",
    itemType: ITEM_TYPE.armour,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.armour],
    value: "14+dex",
    valueLabel: "防御力",
    price: 14,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Armour
  },
  {
    id: "elixir",
    itemName: "エリクサー",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "full",
    valueLabel: "回復値",
    price: 25,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "staff",
    itemName: "スタッフ",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d6+1",
    valueLabel: "ダメージ",
    price: 5,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "shield",
    itemName: "シールド",
    itemType: ITEM_TYPE.shield,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.shield],
    value: "+2",
    valueLabel: "防御力",
    price: 8,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Shield
  },
  {
    id: "speed-potion",
    itemName: "速さのポーション",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "1d4",
    valueLabel: "回復値",
    price: 7,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "warhammer",
    itemName: "ウォーハンマー",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d8+3",
    valueLabel: "ダメージ",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "splint-armor",
    itemName: "驚異の盾",
    itemType: ITEM_TYPE.shield,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.shield],
    value: "17",
    valueLabel: "防御力",
    price: 18,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Shield
  },
  {
    id: "revival-potion",
    itemName: "復活のポーション",
    itemType: ITEM_TYPE.recovery,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.recovery],
    value: "50%",
    valueLabel: "回復値",
    price: 20,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Recovery
  },
  {
    id: "flail",
    itemName: "フレイル",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d8+2",
    valueLabel: "ダメージ",
    price: 10,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "ring-of-protection",
    itemName: "プロテクションリング",
    itemType: ITEM_TYPE.ring,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.ring],
    value: "+1",
    valueLabel: "回復値",
    price: 15,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Ring
  },
  {
    id: "fire-scroll",
    itemName: "火のスクロール",
    itemType: ITEM_TYPE.scroll,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.scroll],
    value: "2d6",
    valueLabel: "回復値",
    price: 5,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Scroll
  },
  {
    id: "ice-scroll",
    itemName: "氷のスクロール",
    itemType: ITEM_TYPE.scroll,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.scroll],
    value: "1d10",
    valueLabel: "回復値",
    price: 5,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Scroll
  },
  {
    id: "thunder-scroll",
    itemName: "雷のスクロール",
    itemType: ITEM_TYPE.scroll,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.scroll],
    value: "2d4+2",
    valueLabel: "回復値",
    price: 5,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Scroll
  },
  {
    id: "mace",
    itemName: "メイス",
    itemType: ITEM_TYPE.weapon,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.weapon],
    value: "1d6+2",
    valueLabel: "ダメージ",
    price: 8,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Wepon
  },
  {
    id: "ring-of-strength",
    itemName: "力のリング",
    itemType: ITEM_TYPE.ring,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.ring],
    value: "+2",
    valueLabel: "回復値",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-dexterity",
    itemName: "敏捷のリング",
    itemType: ITEM_TYPE.ring,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.ring],
    value: "+2",
    valueLabel: "回復値",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-intelligence",
    itemName: "知性のリング",
    itemType: ITEM_TYPE.ring,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.ring],
    value: "+2",
    valueLabel: "回復値",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Ring
  },
  {
    id: "ring-of-constitution",
    itemName: "体力のリング",
    itemType: ITEM_TYPE.ring,
    itemTypeName: ITEM_TYPE_NAME[ITEM_TYPE.ring],
    value: "+2",
    valueLabel: "回復値",
    price: 12,
    rarity: 1.0,
    minimumDepth: 0,
    itemLogicClass: IL_Ring
  }
]
