

const EntranceCreater = (roadArray) => {
  const entranceArray = roadArray.map(({ x, y, width, height, direction }) => {
    const logic = {
      r: _ => ({ x: x - 1, y, width: 1, height: 1, type: 'entrancce' }),
      l: _ => ({ x: x + width, y, width: 1, height: 1, type: 'entrancce' }),
      t: _ => ({ x, y: y + height, width: 1, height: 1, type: 'entrancce' }),
      b: _ => ({ x, y: y - 1, width: 1, height: 1, type: 'entrancce' }),
    }
    return logic[direction]();
  });


  return entranceArray;
};

export default EntranceCreater;


