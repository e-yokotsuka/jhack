

const PlaceTreasureBox = (roomArray,
  entranceArray,
  itemsList = [],
  maxBoxes = 5,
  probability = 0.3,
  emptyProbability = 0.05
) => {
  if (!itemsList?.length) return [];
  const isEntranceSide = (x, y) => {
    entranceArray.forEach(({ x: ex, y: ey }) => {
      if (
        (ex + 1 === x && ey === y) ||//右
        (ex - 1 === x && ey === y) ||//左
        (ex === x && ey + 1 === y) ||//下
        (ex === x && ey - 1 === y)//上
      ) return true;
    });
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
      const item = (Math.random() > emptyProbability) ? itemsList[itemIndex] : null;
      treasureBoxes.push({ x, y, item });
    }
  });
  return treasureBoxes;
}

export default PlaceTreasureBox;