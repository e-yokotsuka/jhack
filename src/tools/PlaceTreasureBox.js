

const PlaceTreasureBox = (roomArray,
  entranceArray,
  itemsList = [],
  maxBoxes = 5,
  probability = 0.3,
  emptyProbability = 1
) => {
  if (!itemsList?.length) return [];
  const isEntranceSide = (x, y) => {
    for (const { x: ex, y: ey } of entranceArray) {
      if (
        (ex === x + 1 && ey === y) ||//右
        (ex === x - 1 && ey === y) ||//左
        (ex === x && ey === y + 1) ||//下
        (ex === x && ey === y - 1)//上
      ) {
        return true;
      }
    }
    return false;
  }
  const numBoxes = Math.floor(Math.random() * maxBoxes);
  const treasureBoxes = [];
  roomArray.forEach(room => {
    for (let i = 0; i < numBoxes; i++) {
      if (Math.random() > probability) continue;
      const x = Math.floor(Math.random() * (room.width - 2)) + 1 + room.x;
      const y = Math.floor(Math.random() * (room.height - 2)) + 1 + room.y;
      if (isEntranceSide(x, y)) continue; // 入り口の横には配置されない。
      const itemIndex = Math.floor(Math.random() * itemsList.length);
      const item = (Math.random() < emptyProbability) ? itemsList[itemIndex] : null;
      treasureBoxes.push({ x, y, item });
    }
  });
  return treasureBoxes;
}

export default PlaceTreasureBox;