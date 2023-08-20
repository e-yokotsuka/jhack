// 階段をつくってダンジョンをつなげる
const PlaceStairs = ({ roomArray,
  xorArray,
  isUp = false,
  maxStairs = 3,
  probability = 0.5,
  force = false }
) => {
  const isItemTile = (x, y) => {
    xorArray.forEach(({ x: ex, y: ey }) => {
      if (ex === x && ey === y) return true;
    });
    return false;
  }
  const numStairs = force ? maxStairs : Math.max(Math.floor(Math.random() * maxStairs), 1);
  const stairs = [];

  while (stairs.length + 1 <= numStairs) {
    const room = roomArray[Math.floor(Math.random() * roomArray.length)];
    for (let i = 0; i < numStairs; i++) {
      if (!force && Math.random() > probability) continue;
      const x = Math.floor(Math.random() * (room.width - 2)) + 1 + room.x;
      const y = Math.floor(Math.random() * (room.height - 2)) + 1 + room.y;
      if (isItemTile(x, y)) continue; // 既にアイテムタイルがある箇所はうわがかない。
      // 同じ位置にはおかない
      if (!stairs.find(({ x: fx, y: fy }) => (x === fx && y === fy))) stairs.push({ x, y, isUp, next: {} });
    }

  }
  return stairs;
}

export default PlaceStairs;