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
    this.roomArray = RoomCreater(this.rectArray);
    this.roomWallArray = RoomWallCreater(this.roomArray);
    this.roadArray = RoadCreater(this.rectArray, this.roomArray);
    this.entranceArray = EntranceCreater(this.roadArray);
    this.roadArray2 = ConectRoads(this.roadArray, this.roomArray, this.rectArray);
    this.tresureBoxes = PlaceTreasureBox(this.roomArray, this.entranceArray, MS_Item);
    this.traps = PlaceTrap(this.roomArray, this.tresureBoxes, MS_Trap);
    this.rectArray.forEach(({ x, y, width, height }) => {
      // this.fillRectWithAttributes({ x, y, width, height, cellName: `${tileName[(n + 5) % 7]}` });
      this.fillRectWithAttributes({ x, y, width, height, cellName: `blank` });
    });
    this.roomArray.forEach(({ x, y, width, height, cellName }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName, attributes: { isBlocked: false } });
    });
    this.roomWallArray.forEach(({ x, y, width, height, cellName }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName });
    });
    this.roadArray2.forEach(({ x, y, width, height, cellName }) => {
      this.fillRectWithAttributes({ x, y, width, height, cellName, attributes: { isBlocked: false } });
    });
    this.entranceArray.forEach(({ x, y, width, height }) => {
      this.fillRectWithAttributes({
        x, y, width, height, cellName: `dngn_closed_door`, attributes: {
          type: 'door',
          close: true,
          isBlocked: true, hitStep: 0, open: _ => {
            this.map[y][x].cellName = 'dngn_open_door';
            this.map[y][x].item = null;
            this.map[y][x].prim.texture = this.core.getTexture(`dngn_open_door`);
            this.map[y][x].isBlocked = false;
            this.map[y][x].close = false;
          }
        }
      });
    });
    this.tresureBoxes.forEach(({ x, y, item }) => {
      this.fillRectWithAttributes({
        x, y, width: 1, height: 1, cellName: item ? `chest2_closed` : `chest2_open`, attributes: {
          type: 'chest', isBlocked: true, item, hitStep: 0, open: _ => {
            this.map[y][x].cellName = 'chest2_open';
            this.map[y][x].item = null;
            this.map[y][x].prim.texture = this.core.getTexture(`chest2_open`);
          }
        }
      });
    });
    this.traps.forEach(({ x, y, trap }) => {
      this.fillRectWithAttributes({
        x, y, width: 1, height: 1, cellName: `dngn_trap_magical`, attributes: {
          type: 'trap', isAction: true, isBlocked: false, trap, action: _ => { }
        }
      });
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


  putTileWithAttributes = ({ x, y, cellName, attributes = { isBlocked: false } }) => {
    this.map[y][x] = { cellName, ...attributes };
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
    const { core, mapContainer } = this;
    const { width, height } = core.getCanvasSize();
    mapContainer.x = (-(mapX * 32) + (width / 2));
    mapContainer.y = (-(mapY * 32) + (height / 2));
  }

}
export default MP_AutoMap;

