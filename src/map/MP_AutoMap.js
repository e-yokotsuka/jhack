import { Container } from 'pixi.js';
import SP_Tile from "../sprites/SP_Tile";

class MP_AutoMap {
  constructor({ core, width = 100, height = 50 }) {
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

  update = delta => {
    const { core: { input }, mapContainer } = this;
    const step = 4 * delta;
    if (input.isDown('w')) mapContainer.y -= step;
    if (input.isDown('s')) mapContainer.y += step;
    if (input.isDown('a')) mapContainer.x -= step;
    if (input.isDown('d')) mapContainer.x += step;
  }
}
export default MP_AutoMap;