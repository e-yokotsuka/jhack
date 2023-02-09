import { Text } from 'pixi.js';

const DISPLAY_TIME = 5 * 60;

class UI_MessageBox {

  constructor(/*{core}*/) {
    this.msgs = [];
    this.prim = new Text('', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'left',
    });
    this.prim.x = 10;
    this.prim.y = 30;
  }

  getPrim = _ => this.prim;

  addText = text => this.msgs.push({ text, time: 0 });

  update = delta => {
    this.msgs = this.msgs.map(({ text, time }) => ({ text, time: time + delta }));
    this.msgs = this.msgs.filter(({ time }) => (time <= DISPLAY_TIME));
    let text = this.msgs.map(({ text, time }) => `${text}(${Math.floor(time / 60)})`).join('\n');
    this.prim.text = text;
  }

}

export default UI_MessageBox;


