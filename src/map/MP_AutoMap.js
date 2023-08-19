import ConectRoads from '../tools/ConectRoads';
import { Container } from 'pixi.js';
import EntranceCreater from '../tools/EntranceCreater';
import MS_Item from "../data/MS_Item";
import MS_Trap from '../data/MS_Trap';
import MapSplitter from '../tools/MapSpliter';
import PlaceTrap from '../tools/PlaceTrap';
import PlaceTreasureBox from '../tools/PlaceTreasureBox';
import RoadCreater from '../tools/RoadCreater';
import RoomCreater from '../tools/RoomCreater';
import RoomWallCreater from '../tools/RoomWallCreater';
import SP_Tile from "../sprites/SP_Tile";
import TL_Blank from '../tiles/TL_Blank';
import TL_Chest from '../tiles/TL_Chest';
import TL_Door from '../tiles/TL_Door';
import TL_Floor from '../tiles/TL_Floor';
import TL_Road from '../tiles/TL_Road';
import TL_Trap from '../tiles/TL_Trap';
import TL_Wall from '../tiles/TL_Wall';

class MP_AutoMap {
  constructor({ core, scene, width = 100, height = 50 }) {
    this.isDebugViewCollision = false;
    this.core = core;
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.lastMapX = 0;
    this.lastMapY = 0;
    this.resetCallback = [];
    this.mapContainer = new Container();
    this.makeAutomap();
  }

  getPrim = _ => this.mapContainer;


  makeAutomap = _ => {
    const { scene: { core } } = this;
    this.fill(({ x, y }) => new TL_Blank({ x, y }));
    this.rectArray = MapSplitter({ map: this.map, maxRoom: Math.round(Math.random() * 10 + 2) });
    this.roomArray = RoomCreater(this.rectArray);
    this.roomWallArray = RoomWallCreater(this.roomArray);
    this.roadArray = RoadCreater(this.rectArray, this.roomArray);
    this.entranceArray = EntranceCreater(this.roadArray);
    this.roadArray2 = ConectRoads(this.roadArray, this.roomArray, this.rectArray);
    this.tresureBoxes = PlaceTreasureBox(this.roomArray, this.entranceArray, MS_Item);
    this.traps = PlaceTrap(this.roomArray, this.tresureBoxes, MS_Trap);

    this.rectArray.forEach(({ x, y, width, height }) =>
      this.fillTilesInRect({ x, y, width, height, fnTile: ({ x, y }) => new TL_Blank({ core, x, y }) }));

    this.roomArray.forEach(({ x, y, width, height, cellName }) =>
      this.fillTilesInRect({ x, y, width, height, fnTile: ({ x, y }) => new TL_Floor({ core, x, y, cellName }) }));

    this.roomWallArray.forEach(({ x, y, width, height, cellName }) =>
      this.fillTilesInRect({ x, y, width, height, fnTile: ({ x, y }) => new TL_Wall({ core, x, y, cellName }) }))

    this.roadArray2.forEach(({ x, y, width, height, cellName }) =>
      this.fillTilesInRect({ x, y, width, height, fnTile: ({ x, y }) => new TL_Road({ core, x, y, cellName }) }))

    this.entranceArray.forEach(({ x, y, width, height }) =>
      this.fillTilesInRect({ x, y, width, height, fnTile: ({ x, y }) => new TL_Door({ core, x, y }) }))

    this.tresureBoxes.forEach(({ x, y, item }) => this.putTile(new TL_Chest({ core, x, y, item })));

    this.traps.forEach(({ x, y, trap }) => this.putTile(new TL_Trap({ core, x, y, trap })));

    this.reset();
  }

  fill = (fnTile = _ => { }) => {
    const { width, height } = this;
    this.map = [...Array(height)].map((_, y) => Array(width).map((_, x) => fnTile({ x, y })));
  }

  fillTilesInRect = ({ x, y, width, height, fnTile = _ => { } }) => {
    for (let ny = y; ny < (y + height); ny++)
      for (let nx = x; nx < (x + width); nx++) {
        this.map[ny][nx] = fnTile({ nx, ny });
      }
  }

  putTile = tile => this.map[tile.y][tile.x] = tile;

  putTileWithAttributes = ({ x, y, cellName, attributes = {} }) => {
    if (this.map[y][x].prim) this.map[y][x].prim.texture = this.core.getTexture(cellName);
    this.map[y][x].cellName = cellName;
    this.map[y][x] = { ...this.map[y][x], ...attributes };
  }

  addResetCallback = callback => {
    this.resetCallback.push(callback);
  }

  reset = _ => {
    const { map, mapContainer, core, isDebugViewCollision } = this;
    mapContainer.removeChildren();
    map.forEach((row, y) => {
      row.forEach(({ cellName, isBlocked }, x) => {
        if (isDebugViewCollision && isBlocked) {
          cellName = 'passage_of_golubria';
        }
        const t = SP_Tile({ core, name: cellName });
        t.x = x * t.width;
        t.y = y * t.height;
        map[y][x].prim = t;
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
  isBlockedTile = (x, y) => this.map[y][x].isBlocked ? this.map[y][x] : false;
  isActionTile = (x, y) => this.map[y][x].isAction ? this.map[y][x] : false;

  getTile = (x, y) => this.map[y][x];

  update = _ => {
    const { core: { input }/*, mapContainer */ } = this;
    // const step = 4 * delta;
    // if (input.isDown('w')) mapContainer.y -= step;
    // if (input.isDown('s')) mapContainer.y += step;
    // if (input.isDown('a')) mapContainer.x -= step;
    // if (input.isDown('d')) mapContainer.x += step;
    if (input.isDown('z')) this.makeAutomap();
  }

  getRespawnPosition = (retry = 0) => {
    const { roomArray } = this;
    // 部屋の抽選
    const room = roomArray[Math.floor(Math.random() * roomArray.length)];
    const x = room.x + Math.floor(Math.random() * (room.width - 2)) + 1;
    const y = room.y + Math.floor(Math.random() * (room.height - 2)) + 1;
    // 100回リトライしてダメだったら諦める（殆どないはず）
    if (this.map[y][x].isBlocked && retry < 100) return this.getRespawnPosition(retry + 1);
    return { x, y };
  }

  center = (mapX, mapY) => {
    const x = mapX ? mapX : this.lastMapX;
    const y = mapY ? mapY : this.lastMapY;
    const { core, mapContainer } = this;
    const { width, height } = core.getCanvasSize();
    mapContainer.x = (-(x * 32) + (width / 2));
    mapContainer.y = (-(y * 32) + (height / 2));
    this.lastMapX = x;
    this.lastMapY = y;
  }



  serialize() {
    console.log("map の保存をおこなう")
  }

}
export default MP_AutoMap;

