import { mapRandom } from './SeededRandom';

// 階段をつくってダンジョンをつなげる
const PlaceStairs = ({ roomArray,
  xorArray,
  isUp = false,
  maxStairs = 3,
  probability = 0.5,
  force = false }
) => {
  const isItemTile = (x, y) => xorArray.some(({ x: ex, y: ey }) => ex === x && ey === y);
  const numStairs = force ? maxStairs : Math.max(Math.floor(mapRandom() * maxStairs), 1);
  const stairs = [];

  while (stairs.length !== numStairs) {
    if (!force && mapRandom() > probability) continue;
    const room = roomArray[Math.floor(mapRandom() * roomArray.length)];
    const x = Math.floor(mapRandom() * (room.width - 2)) + 1 + room.x;
    const y = Math.floor(mapRandom() * (room.height - 2)) + 1 + room.y;
    if (isItemTile(x, y)) continue; // 既にアイテムタイルがある箇所はうわがかない。
    // 同じ位置にはおかない
    if (!stairs.find(({ x: fx, y: fy }) => (x === fx && y === fy))) stairs.push({ x, y, isUp, next: {} });
  }
  return stairs;
}

export default PlaceStairs;
