import { Container, Graphics, Text } from 'pixi.js';

class UI_Window {
  constructor({ core }) {
    this.core = core;
    const container = new Container();
    this.prim = container;
  }

  open = _ => {
    this.x = 32;
    this.y = 32;

    const container = this.prim;
    const menu = ["どうぐ", "まほう", "そうび", "つよさ", "すてる", "セーブ"];
    const text = new Text(menu.join("\n"), {
      fontSize: 32,
      fill: 0xffffff,
      align: 'left',
    });
    text.setTransform(this.x + 16, this.y + 16)

    this.w = 32 * 4;
    this.h = 32 * (2 + menu.length);

    const graphics = new Graphics();
    graphics.lineStyle(2, 0xFF00FF, 1);
    graphics.beginFill(0x650A5A, 0.25);
    graphics.drawRoundedRect(this.x, this.y, this.w, this.h, 8);
    graphics.endFill();

    container.addChild(graphics)
    container.addChild(text)
    this.text = text;
    this.graphics = graphics;
    this.isOpen = true;
  }

  close = _ => {
    this.prim.removeChildren();
    this.isOpen = false;
  }

  getPrim = _ => this.prim;

  update = (/*delta*/) => {
    const { input, windowOpen } = this.core;
    if (input.isSingleDown('o') && !this.isOpen) {
      this.open();
      windowOpen(this.isOpen);
    } else if (input.isSingleDown('o') && this.isOpen) {
      this.close();
      windowOpen(this.isOpen);
    }
  }

}

export default UI_Window;