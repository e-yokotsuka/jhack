import { ITEM_TYPE } from "../data/MS_Item";
import { mapRandom } from './SeededRandom';

// 宝箱に入らないアイテムを除外
const itemFilter = itemsList => itemsList.filter(item => item.itemType != ITEM_TYPE.empty);

const PlaceTreasureBox = (roomArray,
  entranceArray,
  itemsList = [],
  maxBoxes = 5,
  probability = 0.3,
  emptyProbability = 1
) => {
  if (!itemsList?.length) return [];
  const filterdItemList = itemFilter(itemsList);
  const isEntranceSide = (x, y) => {
    for (const { x: ex, y: ey } of entranceArray) {
      if (Math.abs(ex - x) + Math.abs(ey - y) === 1) return true;
    }
    return false;
  }
  const numBoxes = Math.floor(mapRandom() * maxBoxes);
  const treasureBoxes = [];
  roomArray.forEach(room => {
    for (let i = 0; i < numBoxes; i++) {
      if (mapRandom() > probability) continue;
      const x = Math.floor(mapRandom() * (room.width - 2)) + 1 + room.x;
      const y = Math.floor(mapRandom() * (room.height - 2)) + 1 + room.y;
      if (isEntranceSide(x, y)) continue; // 入り口の横には配置されない。
      const itemIndex = Math.floor(mapRandom() * filterdItemList.length);
      const item = (mapRandom() < emptyProbability) ? filterdItemList[itemIndex] : null;
      treasureBoxes.push({ x, y, item });
    }
  });
  return treasureBoxes;
}

export default PlaceTreasureBox;