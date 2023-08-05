import { Text } from 'pixi.js';

const DEFAULT_TIME = 5; //sec

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

  addText = (text, time = DEFAULT_TIME) => this.msgs.push({ text, elapsedTime: 0, time: time * 60 }); // 60fr

  update = delta => {
    this.msgs = this.msgs.map(v => ({ ...v, elapsedTime: v.elapsedTime + delta }));
    this.msgs = this.msgs.filter(({ time, elapsedTime }) => (elapsedTime <= time));
    let text = this.msgs.map(({ text, elapsedTime, time }) => `${text}(${Math.floor(elapsedTime / 60)}/${Math.floor(time / 60)})`).join('\n');
    this.prim.text = text;
  }

}

export default UI_MessageBox;


