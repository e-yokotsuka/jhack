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
    const { hp, maxHp, mp, maxMp } = this.player.status;
    this.prim.text = `HP:${hp}/${maxHp} MP: ${mp}/${maxMp}`;
  }

}

export default UI_Status;


