import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Chest extends TL_Common {
  constructor({ core, x, y, item }) {
    const cellName = item ? `chest2_closed` : `chest2_open`;
    const prim = SP_Tile({ core, name: cellName });
    super({ core, x, y, cellName, type: 'chest', isBlocked: true, prim });
    this.item = item;
  }

  // eslint-disable-next-line no-unused-vars
  hit = ({ actor = null, status }) => {
    const { core: { addText }, item, hitStep } = this;
    if (item) {
      if (hitStep + 1 == status.steps) {
        this.cellName = 'chest2_open';
        this.changeTexture(`chest2_open`);
        this.item = null;
        status.items.push(item);
        addText(`${item.itemName}をGETした！`);
      } else {
        this.hitStep = status.steps;
        addText(`宝箱だ！`);
      }
    } else {
      addText(`からっぽだ！`);
    }

    return this.isBlocked;
  }
}

export default TL_Chest;