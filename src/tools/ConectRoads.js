import RectUtil from "./RectUtil";

// 部屋を貫いていないか？
const isRoomCollision = (roadRect, roomArray) => {
  const rect = new RectUtil(roadRect);
  roomArray.forEach((rectRoom) => {
    if (rect.contains(rectRoom)) return true;
  });
  return false;
}

//境界線に沿っているか？
const isRectEdge = (roadRect, rectArray) => {
  rectArray.forEach(({ x, y, width, height }) => {
    if (roadRect.x === x
      || roadRect.y === y
      || (roadRect.x + roadRect.width) === x + width
      || (roadRect.y + roadRect.height) === y + height
    ) return true;
  });
  return false;
}

const ConectRoads = (roadArray, roomArray, rectArray) => {
  const roads = [...roadArray];

  //横に縦道を繋ぐ
  const hArray = roadArray.filter(({ type }) => type === 'h');
  hArray.forEach(({ x: x1, y: y1, width: width1 }, i) => {
    let min = y1;
    let max = y1 + 1;
    let flag = false;
    const right = x1 + width1;
    hArray.forEach(({ x: x2, y: y2 }, ii) => {
      if (i === ii) return;//自分とは比較しない。
      const left = x2;
      if (right === left) {
        min = Math.min(min, y2);
        max = Math.max(max, y2);
        flag = true;
      }
    })
    if (flag) {
      const h = max - min;
      if (h !== 0) {
        const r = {
          x: right,
          y: min,
          width: 1,
          height: max - min,
          type: 'v'
        };
        if (!isRoomCollision(r, roomArray) && !isRectEdge(r, rectArray)) roads.push(r);
      }
    }
  })

  //縦に横道を繋ぐ
  const vArray = roadArray.filter(({ type }) => type === 'v');
  vArray.forEach(({ x: x1, y: y1, height: height1 }, i) => {
    let min = x1;
    let max = x1 + 1;
    let flag = false;
    const bottom = y1 + height1;
    vArray.forEach(({ x: x2, y: y2 }, ii) => {
      if (i === ii) return;//自分とは比較しない。
      const top = y2;
      if (top === bottom) {
        min = Math.min(min, x2);
        max = Math.max(max, x2);
        flag = true;
      }
    })
    if (flag) {
      const h = max - min;
      if (h !== 0) {
        const r = {
          x: min,
          y: bottom,
          width: max - min,
          height: 1,
          type: 'h'
        };
        if (!isRoomCollision(r, roomArray) && !isRectEdge(r, rectArray)) roads.push(r);
      }
    }
  })


  return roads;
};

export default ConectRoads;


