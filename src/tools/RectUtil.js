
class RectUtil {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains = ({ x: x2, y: y2, width: width2, height: height2 }) => {
    const { x: x1, y: y1, width: width1, height: height1 } = this;
    return x2 <= (x1 + width1) && x1 <= (x2 + width2) && y2 <= (y1 + height1) && y1 <= (y2 + height2);
  };

  isTop({ y: y2, height: height2 }) {
    const { y: y1 } = this;
    const py1 = y1;
    const py2 = y2 + height2;
    return py2 <= py1;
  }

  isBottom({ y: y2 }) {
    const { y: y1, height: height1 } = this;
    const py1 = y1 + height1;
    const py2 = y2;
    return py2 >= py1;
  }

  isLeft({ x: x2, width: width2 }) {
    const { x: x1 } = this;
    const px1 = x1;
    const px2 = x2 + width2;
    return px2 <= px1;
  }

  isRight({ x: x2 }) {
    const { x: x1, width: width1 } = this;
    const px1 = x1 + width1;
    const px2 = x2;
    return px2 >= px1;
  }


}

export default RectUtil;


