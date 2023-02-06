

const EntranceCreater = (roadArray) => {
  const entranceArray = roadArray.map(({ x, y, width, height, direction }) => {
    const data = {
      r: { x: x - 1, y, width: 1, height: 1, type: 'entrancce' },
      l: { x: x + width, y, width: 1, height: 1, type: 'entrancce' },
      t: { x, y: y + height, width: 1, height: 1, type: 'entrancce' },
      b: { x, y: y - 1, width: 1, height: 1, type: 'entrancce' },
    }
    return data[direction];
  });


  return entranceArray;
};

export default EntranceCreater;


