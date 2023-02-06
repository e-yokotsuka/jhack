const RETRY_SIZE = 5;
const MIN_SIZE = 4;
const ROOM_SPAN = 6;

const createRoomRect = (inRect, retry = 0) => {
  if (retry > RETRY_SIZE) {
    return {
      x: inRect.x + 2,
      y: inRect.y + 2,
      width: inRect.width - 4,
      height: inRect.height - 4,
    };
  }
  const addX = Math.round(Math.random() * ROOM_SPAN) + 2;
  const addY = Math.round(Math.random() * ROOM_SPAN) + 2;
  const subWidth = Math.round((0.8 + Math.random() / 5) * inRect.width) - 4;
  const subHeight = Math.round((0.8 + Math.random() / 5) * inRect.height) - 4;
  const rect = {
    x: inRect.x + addX,
    y: inRect.y + addY,
    width: subWidth - addX,
    height: subHeight - addY,
  }
  if (rect.width <= MIN_SIZE || rect.height <= MIN_SIZE) return createRoomRect(inRect, retry + 1);
  return rect;
}

const RoomRectCreater = (rectArray) => rectArray.map((rect) => createRoomRect(rect));

export default RoomRectCreater;


