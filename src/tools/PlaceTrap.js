

import { mapRandom } from './SeededRandom';

// 2d4+3などの文字列が与えられる。dの前の数字はサイコロを振る回数。後ろの数字はダイスの面の数を表す。+の後ろの数字は結果に加算する数字である。この文字列を数値に置き換えるプログラムを作れ。

const PlaceTrap = (roomArray,
  xorArray,
  trapList = [],
  maxTraps = 10,
  probability = 0.5,
) => {
  if (!trapList?.length) return [];
  const isItemTile = (x, y) => {
    xorArray.forEach(({ x: ex, y: ey }) => {
      if (ex === x && ey === y) return true;
    });
    return false;
  }
  const numTraps = Math.floor(mapRandom() * maxTraps);
  const trapes = [];
  roomArray.forEach(room => {
    for (let i = 0; i < numTraps; i++) {
      if (mapRandom() > probability) continue;
      const x = Math.floor(mapRandom() * (room.width - 2)) + 1 + room.x;
      const y = Math.floor(mapRandom() * (room.height - 2)) + 1 + room.y;
      if (isItemTile(x, y)) continue; // 既にアイテムタイルがある箇所はうわがかない。
      const trapIndex = Math.floor(mapRandom() * trapList.length);
      const trap = trapList[trapIndex];
      trapes.push({ x, y, trap });
    }
  });
  return trapes;
}

export default PlaceTrap;