import { Container, Graphics, Text } from 'pixi.js';

import { MAX_INFO_MESSAGE_LINES } from '../define'

class UI_MessageBox {

  constructor(/*{core}*/) {
    this.msgs = [];
    this.infoMsgs = [];
    this.dispText = "";
    const contianer = new Container();
    contianer.x = 8;
    contianer.y = 400;
    const panel = new Graphics();
    panel.lineStyle(2, 0xFFFFFF, 1);
    panel.beginFill(0x011896, 0.75);
    panel.drawRoundedRect(0, 0, 400, 256, 8);
    panel.endFill();
    const text = new Text('', {
      fontSize: 14,
      fill: 0xffffff,
      align: 'left',
    });
    text.x = 6;
    text.y = 6;
    this.textPrim = text;
    panel.addChild(text);
    contianer.addChild(panel);
    this.prim = contianer;
    this.close();
  }

  open = _ => this.prim.visible = true
  close = _ => this.prim.visible = false

  getPrim = _ => this.prim;

  addText = text => {
    this.msgs.push({ text });
    this.infoMsgs = this.msgs.slice(-MAX_INFO_MESSAGE_LINES)
    this.dispText = this.infoMsgs.map(({ text }) => `${text}`).join('\n');
  } // 60fr

  update = _ => {
    if (this.textPrim.text !== "") this.open()
    if (this.textPrim.text !== this.dispText) this.textPrim.text = this.dispText;
  }

}

export default UI_MessageBox;


