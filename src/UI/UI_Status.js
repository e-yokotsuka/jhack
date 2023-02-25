import { Text } from 'pixi.js';

const STATUS_ABS_X = 10;
const STATUS_RELATIVE_Y = -40;


class UI_Status {

  constructor({ core: { player, app: { screen: { height } } } }) {
    this.player = player;
    this.prim = new Text('', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'left',
    });
    this.prim.x = 10;
    this.prim.y = height + STATUS_RELATIVE_Y;
  }

  getPrim = _ => this.prim;

  resize = (width,height)=>{
    this.prim.x = STATUS_ABS_X;
    this.prim.y = height + STATUS_RELATIVE_Y;
  } 

  update = _ => {
    const { hp, maxHp, mp, maxMp, mapX, mapY, steps, lock } = this.player.playerData.status;
    this.prim.text = `HP:${hp}/${maxHp} MP: ${mp}/${maxMp} STEP ${steps} : (${mapX},${mapY}) : locked:${lock} `;
  }

}

export default UI_Status;


