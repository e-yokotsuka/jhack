

const createRoomWallRect = ({ x, y, width, height }) => {
  const rects = [
    { x, y, width, height: 1 },
    { x, y, width: 1, height },
    { x: x + width, y, width: 1, height },
    { x, y: y + height, width: width + 1, height: 1 }
  ];
  return rects;
}

const RoomWallCreater = (roomArray) => roomArray.map((rect) => createRoomWallRect(rect)).flat();

export default RoomWallCreater;


