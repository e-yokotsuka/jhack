import { Container } from 'pixi.js';
import SP_Tile from "../sprites/SP_Tile";

class MP_AutoMap {
  constructor({ core, width = 200, height = 100 }) {
    this.core = core;
    this.width = width;
    this.height = height;
    const { stage } = this.core.app;
    this.mapContainer = new Container();
    stage.addChild(this.mapContainer);
    this.fill("blank");
    this.fillRect({ x: 1, y: 1, width: 4, height: 5, cellName: "black" });
    this.reset();
  }

  fill = (cellName) => {
    const { width, height } = this;
    this.map = [...Array(height)].map(_ => Array(width).fill(cellName));
  }

  fillRect = ({ x, y, width, height, cellName }) => {
    for (let ny = y; ny < (y + height); ny++)
      for (let nx = x; nx < (x + width); nx++) {
        this.map[ny][nx] = cellName;
      }
    this.reset();
  }

  reset = _ => {
    const { map, mapContainer, core } = this;
    mapContainer.removeChildren();
    map.forEach((row, y) => {
      row.forEach((chellName, x) => {
        const t = SP_Tile({ core, name: chellName });
        t.x = x * t.width;
        t.y = y * t.height;
        mapContainer.addChild(t);
      })
    })
  }
}
export default MP_AutoMap;