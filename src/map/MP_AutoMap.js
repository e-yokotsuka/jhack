import ConectRoads from '../tools/ConectRoads';
import { Container } from 'pixi.js';
import MapSplitter from '../tools/MapSpliter';
import RoadRectCreater from '../tools/RoadReactCreater';
import RoomRectCreater from '../tools/RoomRectCreater';
import SP_Tile from "../sprites/SP_Tile";
class MP_AutoMap {
  constructor({ core, width = 100, height = 50 }) {
    this.core = core;
    this.width = width;
    this.height = height;
    const { stage } = this.core.app;
    this.mapContainer = new Container();
    stage.addChild(this.mapContainer);
    this.makeAutomap();
  }

  makeAutomap = _ => {
    this.fill("blank");
    const rectArray = MapSplitter({ map: this.map, maxRoom: Math.round(Math.random() * 10 + 2) });
    const roomArray = RoomRectCreater(rectArray);
    const roadArray = RoadRectCreater(rectArray, roomArray);
    const roadArray2 = ConectRoads(roadArray, roomArray);
    const tileName = ['acidic_floor_0', 'dirt_0', 'frozen_0', 'green_bones_9', 'ice_2', 'infernal_14', 'limestone_0', 'white_marble_0', 'snake-a_0', 'dirt_full', 'demonic_red_7'];
    rectArray.forEach(({ x, y, width, height }, n) => {
      this.fillRect({ x, y, width, height, cellName: `${tileName[(n + 5) % 7]}` });
    });
    roomArray.forEach(({ x, y, width, height }, n) => {
      this.fillRect({ x, y, width, height, cellName: `${tileName[n]}` });
    });
    roadArray2.forEach(({ x, y, width, height }) => {
      this.fillRect({ x, y, width, height, cellName: `circle` });
    });
    this.reset();
  }

  fill = (cellName) => {
    const { width, height } = this;
    this.map = [...Array(height)].map(_ => Array(width).fill({ cellName }));
  }

  fillRect = ({ x, y, width, height, cellName }) => {
    for (let ny = y; ny < (y + height); ny++)
      for (let nx = x; nx < (x + width); nx++) {
        // console.log(`this.map[${nx}][${ny}] ::: x:${x}/y:${y}/w:${width}/h:${height}/name:${cellName}`)
        this.map[ny][nx] = { cellName };
      }
    this.reset();
  }

  reset = _ => {
    const { map, mapContainer, core } = this;
    mapContainer.removeChildren();
    mapContainer.scale.x = 0.25;
    mapContainer.scale.y = 0.25;
    map.forEach((row, y) => {
      row.forEach(({ cellName }, x) => {
        const t = SP_Tile({ core, name: cellName });
        t.x = x * t.width;
        t.y = y * t.height;
        mapContainer.addChild(t);
      })
    })
  }

  _debugMapText = _ => {
    const { map } = this;
    let rowLog = "";
    map.forEach((row) => {
      let line = "";
      row.forEach(({ cellName }) => {
        line = `${line}|${cellName}`;
      })
      rowLog = `${rowLog}${line}\n`;
    })
    console.log(rowLog);
  }

  update = delta => {
    const { core: { input }, mapContainer } = this;
    const step = 4 * delta;
    if (input.isDown('w')) mapContainer.y -= step;
    if (input.isDown('s')) mapContainer.y += step;
    if (input.isDown('a')) mapContainer.x -= step;
    if (input.isDown('d')) mapContainer.x += step;
    if (input.isDown('z')) this.makeAutomap();
  }

}
export default MP_AutoMap;