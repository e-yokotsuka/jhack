import { Container } from "pixi.js";
import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Chest extends TL_Common {
  constructor({ core, x, y, item, floor }) {
    const cellName = item ? `chest2_closed` : `chest2_open`;
    super({ core, x, y, cellName, type: 'chest', isBlocked: true });
    this.item = item;
    this.floor = floor;
  }

  initPrim() {
    const prim = new Container();
    prim.addChild(this.floor.initPrim());
    this.chestPrim = SP_Tile({ core: this.core, name: this.cellName });
    prim.addChild(this.chestPrim);
    return prim;
  }

  changeTexture(name) {
    this.chestPrim.texture = this.core.getTexture(name);
  }

  // eslint-disable-next-line no-unused-vars
  hit = ({ actor = null, status }) => {
    const { item, hitStep } = this;
    if (item) {
      if (hitStep + 1 == status.steps) {
        this.cellName = 'chest2_open';
        this.changeTexture(`chest2_open`);
        this.item = null;
        actor.getItem(item);
      } else {
        this.hitStep = status.steps;
        //宝箱を発見した
        actor.discoverChest();
      }
    } else {
      //空っぽの宝箱を発見した
      actor.discoverEmptyChest();
    }

    return this.isBlocked;
  }

  serialize() {
    const obj = { ...super.serialize(), item: this.item };
    return obj;
  }
}

export default TL_Chest;