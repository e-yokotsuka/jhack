import { Container, Graphics, Text } from 'pixi.js';

class UI_Window {
  constructor({ core }) {
    this.core = core;
    const container = new Container();
    this.prim = container;
    this.oldKeymap = [];
    this.x = 32;
    this.y = 32;
    this.inputMap = {
      'o': _ => !this.isOpen ? this.open() : this.close(),
      'w': _ => this.up(),
      's': _ => this.down(),
      'ArrowUp': _ => this.up(),
      'ArrowDown': _ => this.down(),
    };
    const menu = ["どうぐ", "まほう", "そうび", "つよさ", "すてる", "セーブ"];
    this.menuText = menu.join("\n");
    this.menuLength = menu.length;
    this.longest = menu.reduce((acc, str) => {
      return Math.max(acc, str.length);
    }, 0);

    this.select = 0;
  }

  open = _ => {
    const { core: { windowOpen }, menuText, menuLength } = this;

    const container = this.prim;
    const text = new Text(menuText, {
      fontSize: 32,
      fill: 0xffffff,
      align: 'left',
    });
    text.setTransform(this.x + 16, this.y + 16)

    this.w = 32 * (this.longest + 1);
    this.h = 42 * menuLength;

    const panel = new Graphics();
    panel.lineStyle(2, 0xFF00FF, 1);
    panel.beginFill(0x650A5A, 0.25);
    panel.drawRoundedRect(this.x, this.y, this.w, this.h, 4);
    panel.endFill();

    container.addChild(panel)
    container.addChild(text)

    const cursol = new Graphics();
    cursol.lineStyle(4, 0xFFFFFF, 1);
    cursol.drawRoundedRect(this.x + 8, this.y + 16, this.w - 16, 32 + 4, 2);
    container.addChild(cursol)

    this.text = text;
    this.panel = panel;
    this.cursol = cursol;
    this.isOpen = true;
    this.selectUpdate(this.select);
    // coreにWindowの開閉状態を通知しておく
    windowOpen(this.isOpen);

  }

  close = _ => {
    const { windowOpen } = this.core;
    this.prim.removeChildren();
    this.isOpen = false;
    // coreにWindowの開閉状態を通知しておく
    windowOpen(this.isOpen);
  }

  getPrim = _ => this.prim;

  selectUpdate = select => {
    this.select = select;
    this.cursol.y = this.select * (32 + 5);
    console.log(select)
  }

  up = _ => {
    this.selectUpdate(this.select <= 0 ? this.select = this.menuLength - 1 : this.select - 1);
  }

  down = _ => {
    this.selectUpdate(this.select >= this.menuLength - 1 ? this.select = 0 : this.select + 1);
  }

  update = (/*delta*/) => {
    const { input } = this.core;
    const { inputMap, oldKeymap, singleUpdate } = this;
    const newMap = Object.keys(inputMap).map(key => input.isSingleDown(key)).join(',');
    if (oldKeymap === newMap) return;
    singleUpdate();
    this.oldKeymap = Object.keys(inputMap).map(key => input.isSingleDown(key)).join(',');
  }

  // キーが押された時に更新される
  singleUpdate = (/*delta*/) => {
    console.log("window key input")
    const { inputMap, core: { input } } = this;
    const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
    if (key) inputMap[key]();
  }
}

export default UI_Window;