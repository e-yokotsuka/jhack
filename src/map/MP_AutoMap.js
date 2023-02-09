import ConectRoads from '../tools/ConectRoads';
import { Container } from 'pixi.js';
import EntranceCreater from '../tools/EntranceCreater';
import MS_Item from "../data/MS_Item";
import MapSplitter from '../tools/MapSpliter';
import PlaceTreasureBox from '../tools/PlaceTreasureBox';
import RoadRectCreater from '../tools/RoadReactCreater';
import RoomRectCreater from '../tools/RoomRectCreater';
import RoomWallCreater from '../tools/RoomWallCreater';
import SP_Tile from "../sprites/SP_Tile";

class MP_AutoMap {
  constructor({ core, width = 100, height = 50 }) {
    this.isDebugViewCollision = false;
    this.core = core;
    this.width = width;
    this.height = height;
    this.resetCallback = [];
    const { stage } = this.core.app;
    this.mapContainer = new Container();
    stage.addChild(this.mapContainer);
    this.makeAutomap();
  }

  makeAutomap = _ => {
    this.fill("blank");
    this.rectArray = MapSplitter({ map: this.map, maxRoom: Math.round(Math.random() * 10 + 2) });
    this.roomArray = RoomRectCreater(this.rectArray);
    this.roomWallArray = RoomWallCreater(this.roomArray);
    this.roadArray = RoadRectCreater(this.rectArray, this.roomArray);
    this.entranceArray = EntranceCreater(this.roadArray);
    this.roadArray2 = ConectRoads(this.roadArray, this.roomArray, this.rectArray);
    this.tresureBoxes = PlaceTreasureBox(this.roomArray, this.entranceArray, MS_Item);
    const tileName = ['floor_vines0', 'floor_vines1', 'floor_vines2', 'floor_vines3', 'floor_vines4', 'floor_vines5', 'floor_vines6', 'floor_sand_stone0', 'floor_sand_stone1', 'floor_sand_stone2', 'floor_sand_stone3'];
    this.rectArray.forEach(({ x, y, width, height }) => {
      // this.fillRectWithAttributes({ x, y, width, height, cellName: `${tileName[(n + 5) % 7]}` });
      this.fillRectWithAttributes({ x, y, width, height, cellName: `blank` });
    });
    this.roomArray.forEach(({ x, y, width, height }, n) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName: `${tileName[n]}`, attributes: { isBlocked: false } });
    });
    this.roomWallArray.forEach(({ x, y, width, height }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName: `stone_brick1` });
    });
    this.roadArray2.forEach(({ x, y, width, height }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName: `floor_vines4`, attributes: { isBlocked: false } });
    });
    this.entranceArray.forEach(({ x, y, width, height }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName: `dngn_open_door`, attributes: { isBlocked: false } });
    });
    this.tresureBoxes.forEach(({ x, y, item }) => {
      this.fillRectWithAttributes({ x, y, width: 1, height: 1, cellName: `chest2_closed`, attributes: { isBlocked: true, item } });
    });
    this.reset();
  }

  fill = (cellName) => {
    const { width, height } = this;
    this.map = [...Array(height)].map(_ => Array(width).fill({ cellName }));
  }

  fillRectWithAttributes = ({ x, y, width, height, cellName, attributes = { isBlocked: true } }) => {
    for (let ny = y; ny < (y + height); ny++)
      for (let nx = x; nx < (x + width); nx++) {
        // console.log(`this.map[${nx}][${ny}] ::: x:${x}/y:${y}/w:${width}/h:${height}/name:${cellName}`)
        this.map[ny][nx] = { cellName, ...attributes };
      }
    this.reset();
  }

  addResetCallback = callback => {
    this.resetCallback.push(callback);
  }

  reset = _ => {
    const { map, mapContainer, core, isDebugViewCollision } = this;
    mapContainer.removeChildren();
    mapContainer.scale.x = core.mainScale;
    mapContainer.scale.y = core.mainScale;
    map.forEach((row, y) => {
      row.forEach(({ cellName, isBlocked }, x) => {
        if (isDebugViewCollision && isBlocked) {
          cellName = 'passage_of_golubria';
        }
        const t = SP_Tile({ core, name: cellName });
        t.x = x * t.width;
        t.y = y * t.height;
        mapContainer.addChild(t);
      })
    })
    this.resetCallback.forEach(func => func())
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

  isBlocked = (x, y) => this.map[y][x].isBlocked;

  update = _ => {
    const { core: { input }/*, mapContainer */ } = this;
    // const step = 4 * delta;
    // if (input.isDown('w')) mapContainer.y -= step;
    // if (input.isDown('s')) mapContainer.y += step;
    // if (input.isDown('a')) mapContainer.x -= step;
    // if (input.isDown('d')) mapContainer.x += step;
    if (input.isDown('z')) this.makeAutomap();
  }

  getRespawnPosition = _ => {
    const { roomArray } = this;
    // 部屋の抽選
    const room = roomArray[Math.floor(Math.random() * roomArray.length)];
    const x = room.x + Math.floor(Math.random() * (room.width - 2)) + 1;
    const y = room.y + Math.floor(Math.random() * (room.height - 2)) + 1;
    return { x, y };
  }

  center = (mapX, mapY) => {
    const { core, mapContainer } = this;
    const { width, height } = core.getCanvasSize();
    mapContainer.x = (-(mapX * 32) + (width / 2));
    mapContainer.y = (-(mapY * 32) + (height / 2));
  }

}
export default MP_AutoMap;

