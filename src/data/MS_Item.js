const ITEM_TYPE = {
  potion: 'potion',
  weapon: 'weapon',
  armour: 'armour',
}

export default [
  {
    id: "yakuso",
    itemName: "よゆちょんぶっちそう",
    type: ITEM_TYPE.recovery,
    value: "1d6+2",
    prace: 4
  },
  {
    id: "dagger",
    itemName: "ダガー",
    type: ITEM_TYPE.weapon,
    value: "1d4+2",
    prace: 4
  },
  {
    id: "leather-armor",
    itemName: "レザーアーマー",
    type: ITEM_TYPE.armour,
    value: "11+dex",
    prace: 4
  },
]
