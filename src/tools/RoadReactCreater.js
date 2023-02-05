import RectUtil from "./RectUtil";

const getRoomAttribute = rectArray => {
  const roomAttributeArray = [];
  rectArray.forEach((myself, i) => {
    const attribute = { isTop: false, isLeft: false, isRight: false, isBottom: false };
    rectArray.forEach((target, ii) => {
      if (i === ii) return; // 自分とは比較しない。
      const rectUtil = new RectUtil(myself);
      attribute.isTop = attribute.isTop ? true : rectUtil.isTop(target);
      attribute.isLeft = attribute.isLeft ? true : rectUtil.isLeft(target);
      attribute.isBottom = attribute.isBottom ? true : rectUtil.isBottom(target);
      attribute.isRight = attribute.isRight ? true : rectUtil.isRight(target);
    });
    console.log(myself);
    console.log(attribute);
    roomAttributeArray.push(attribute);
  });
  return roomAttributeArray;
}

const RoadRectCreater = (rectArray, roomArray) => {
  const roads = [];
  const roomAttributeArray = getRoomAttribute(rectArray);
  roomArray.forEach((room, i) => {
    const rect = rectArray[i];
    const attribute = roomAttributeArray[i];

    if (attribute.isRight) {
      const x = room.x + room.width;
      const x2 = rect.x + rect.width;
      const yLength = room.height - 2; //壁分の幅を削除
      const randY = room.y + Math.round(Math.random() * yLength) + 1;
      roads.push({
        x,
        width: x2 - x,
        y: randY,
        height: 1 // 道幅
      })
    }
    if (attribute.isLeft) {
      const x = rect.x;
      const x2 = room.x;
      const yLength = room.height - 2; //壁分の幅を削除
      const randY = room.y + Math.round(Math.random() * yLength) + 1;
      roads.push({
        x,
        width: x2 - x,
        y: randY,
        height: 1 // 道幅
      })
    }
    if (attribute.isTop) {
      const y = rect.y;
      const y2 = room.y;
      const xLength = room.width - 2; //壁分の幅を削除
      const randX = room.x + Math.round(Math.random() * xLength) + 1;
      roads.push({
        x: randX,
        width: 1,// 道幅
        y: y,
        height: y2 - y
      })
    }
    if (attribute.isBottom) {
      const y = room.y + room.height;
      const y2 = rect.y + rect.height;
      const xLength = room.width - 2; //壁分の幅を削除
      const randX = room.x + Math.round(Math.random() * xLength) + 1;
      roads.push({
        x: randX,
        width: 1,// 道幅
        y: y,
        height: y2 - y
      })
    }
  })

  return roads;
};

export default RoadRectCreater;


