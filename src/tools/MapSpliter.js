const RETRY_SIZE = 5;
const MIN_SIZE = 8;
// 大きな矩形をランダムサイズに分割
const splitRect = ({ width, height, retry = 0 }) => {
  if (retry > RETRY_SIZE) {
    return [{ x: 0, y: 0, width, height, parent: false }];
  }
  const a = Math.random();
  const splitSetting =
    width > height
      ? {
        length: width,
        sublength: height,
        target: "x",
        subtarget: "y",
        primary: "width",
        secondary: "height"
      }
      : {
        length: height,
        sublength: width,
        target: "y",
        subtarget: "x",
        primary: "height",
        secondary: "width"
      };
  const {
    length,
    sublength,
    target,
    subtarget,
    primary,
    secondary
  } = splitSetting;
  const p1 = Math.round(length * a);
  const p2 = length - p1;
  if (p1 < MIN_SIZE || p2 < MIN_SIZE) {
    return splitRect({ width, height, retry: retry + 1 });
  }
  const area1 = p1 * sublength;
  const area2 = p2 * sublength;
  return [
    {
      [target]: 0,
      [subtarget]: 0,
      [primary]: p1,
      [secondary]: sublength,
      parent: area1 >= area2
    },
    {
      [target]: p1,
      [subtarget]: 0,
      [primary]: p2,
      [secondary]: sublength,
      parent: area1 < area2
    }
  ];
};

const getSplitRectArray = ({
  rectArray,
  maxRoom
}) => {
  if (--maxRoom <= 0) return rectArray;
  const newArray = rectArray
    .map((v) => {
      return v.parent
        ? splitRect({ width: v.width, height: v.height }).map((vv) => {
          vv.x += v.x;
          vv.y += v.y;
          return vv;
        })
        : v;
    })
    .flat();
  return getSplitRectArray({
    rectArray: newArray,
    maxRoom
  });
};

const MapSplitter = ({ map, maxRoom = 6 }) => {
  const height = map.length;
  const width = map[0].length;
  let rectArray = [{
    x: 0,
    y: 0,
    width,
    height,
    parent: true
  }];
  return getSplitRectArray({ rectArray, width, height, maxRoom });
}

export default MapSplitter;


