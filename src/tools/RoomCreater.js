const RETRY_COUNT = 5;
const MIN_SIZE = 4;
const ROOM_SPAN = 6;

const cellNames = ['floor_vines0', 'floor_vines1', 'floor_vines2', 'floor_vines3', 'floor_vines4', 'floor_vines5', 'floor_vines6', 'floor_sand_stone0', 'floor_sand_stone1', 'floor_sand_stone2', 'floor_sand_stone3'];

const createRoom = (inRect, retry = 0) => {
  const cell = Math.floor(Math.random() * cellNames.length);

  if (retry > RETRY_COUNT) {
    return {
      x: inRect.x + 2,
      y: inRect.y + 2,
      width: inRect.width - 4,
      height: inRect.height - 4,
      cellName: cellNames[cell]
    };
  }
  const addX = Math.round(Math.random() * ROOM_SPAN) + 2;
  const addY = Math.round(Math.random() * ROOM_SPAN) + 2;
  const subWidth = Math.round((0.8 + Math.random() / 5) * inRect.width) - 4;
  const subHeight = Math.round((0.8 + Math.random() / 5) * inRect.height) - 4;
  const room = {
    x: inRect.x + addX,
    y: inRect.y + addY,
    width: subWidth - addX,
    height: subHeight - addY,
    cellName: cellNames[cell]
  }
  if (room.width <= MIN_SIZE || room.height <= MIN_SIZE) return createRoom(inRect, retry + 1);
  return room;
}

const RoomCreater = (rectArray) => rectArray.map((rect) => createRoom(rect));

export default RoomCreater;


