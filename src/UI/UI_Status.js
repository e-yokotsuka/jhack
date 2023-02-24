import { Text } from 'pixi.js';

class UI_Status {

  constructor({ core: { player, app: { screen: { height } } } }) {
    this.player = player;
    this.prim = new Text('', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'left',
    });
    this.prim.x = 10;
    this.prim.y = height - 40;
  }

  getPrim = _ => this.prim;

  update = _ => {
    const { hp, maxHp, mp, maxMp, mapX, mapY, steps, lock } = this.player.playerData.status;
    this.prim.text = `HP:${hp}/${maxHp} MP: ${mp}/${maxMp} STEP ${steps} : (${mapX},${mapY}) : locked:${lock} `;
  }

}

export default UI_Status;


