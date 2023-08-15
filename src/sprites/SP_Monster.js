import { CELL_SIZE } from "../define";
import MD_Monster from '../model/MD_Monster';
import SP_Actor from './SP_Actor';
import { Sprite } from 'pixi.js';

class SP_Monster extends SP_Actor {

  constructor({ core, scene, name = "goblin" }) {
    const status = new MD_Monster({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
    super({ core, scene, status });
    const { textures: { tx_main } } = core;
    const { mainMap } = scene;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    this.sprite = sprite;
    this.status.mapX = 0;
    this.status.mapY = 0;
  }

  getPrim = _ => this.sprite;

  getStatus = _ => this.status;

  respawn = _ => this.spawn()

  spawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.status.hp = this.status.maxHp;
    this.move(x, y);
    // this.mainMap.center(this.status.mapX, this.status.mapY);
  }

  diceRoll = diceText => this.core.diceRoll(diceText);

  trappedIn = ({
    dmg,
    difficulty
  }) => {
    const s = this.diceRoll("1d20") + 0; //Todo
    return (difficulty <= s) ? 0 : this.diceRoll(dmg);
  }

  hit = dmg => {
    const hp = this.status.hp - dmg;
    this.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      this.core.addText(`し  ん  だ  よ`);
      this.respawn();
      return true;
    }
    return false;
  }


  update = (/*delta*/) => {
    const { mainMap, status, sprite } = this;
    sprite.x = mainMap.mapContainer.x + status.mapX * CELL_SIZE;
    sprite.y = mainMap.mapContainer.y + status.mapY * CELL_SIZE;
  }

  // ステータスプロパティのシンタックスシュガー

  get mapX() { return this.status.mapX }
  get mapY() { return this.status.mapY }
  get x() { return this.sprite.x }
  get y() { return this.sprite.y }

}

export default SP_Monster;


