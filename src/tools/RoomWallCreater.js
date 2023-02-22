

const createRoomWall = ({ x, y, width, height }) => {
  const rects = [
    { x, y, width, height: 1, cellName: 'stone_brick1' },
    { x, y, width: 1, height, cellName: 'stone_brick1' },
    { x: x + width, y, width: 1, height, cellName: 'stone_brick1' },
    { x, y: y + height, width: width + 1, height: 1, cellName: 'stone_brick1' }
  ];
  return rects;
}

const RoomWallCreater = (roomArray) => roomArray.map((rect) => createRoomWall(rect)).flat();

export default RoomWallCreater;


