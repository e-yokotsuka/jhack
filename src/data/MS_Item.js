import IL_Common from "../logic/items/IL_Common"
import IL_Recovery from "../logic/items/IL_Recovery"

const ITEM_TYPE = {
  recovery: 'recovery',
  weapon: 'weapon',
  armour: 'armour',
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
]
