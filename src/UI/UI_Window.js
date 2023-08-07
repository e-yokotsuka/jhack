import { Container, Graphics, Text } from 'pixi.js';

const CELL_SIZE = 32;
class UI_Window {
  constructor({ core, x = 0, y = 0, w = 0, h = 0, menu }) {
    this.isOpen = false;
    this.core = core;
    const container = new Container();
    this.prim = container;
    this.oldKeymap = [];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isLock = true;
    // isLockの状態を維持したうえでロックする
    this.isForceLock = false;
    this.inputMap = {
      'w': _ => this.up(),
      's': _ => this.down(),
      'ArrowRight': _ => this.selected(),
      'ArrowUp': _ => this.up(),
      'ArrowDown': _ => this.down(),
    };
    if (menu) this.setMenu(menu);
  }

  setMenu = menu => {
    const labels = menu.map(({ label }) => label);
    this.menuText = labels.join("\n");
    this.menuLength = labels.length;
    this.longest = labels.reduce((acc, str) => {
      return Math.max(acc, str.length);
    }, 0);
    this.menu = menu;
    this.select = 0;
    this.w = CELL_SIZE * this.longest + 16;
    this.h = CELL_SIZE * this.menuLength + 4;
  }

  selected() {
    const { isOpen, menu, select } = this;
    if (!isOpen) return;
    menu[select].action()
  }

  open() {
    const { menuText } = this;

    const container = this.prim;
    container.removeChildren();
    const text = new Text(menuText, {
      fontSize: 28,
      fill: 0xffffff,
      align: 'left',
      lineHeight: 32
    });
    text.setTransform(this.x + 8, this.y + 4)


    const panel = new Graphics();
    panel.lineStyle(2, 0xFFFFFF, 1);
    panel.beginFill(0x650A5A, 0.25);
    panel.drawRoundedRect(this.x, this.y, this.w, this.h + 4, 4);
    panel.endFill();

    container.addChild(panel)
    container.addChild(text)

    const cursol = new Graphics();
    cursol.lineStyle(2, 0xFFFFFF, 1);
    cursol.drawRoundedRect(this.x + 2, this.y, this.w - 4, CELL_SIZE, 2);
    container.addChild(cursol)

    this.text = text;
    this.panel = panel;
    this.cursol = cursol;
    this.isOpen = true;
    // 同一フレームでウインドウのオープン処理が起きないように
    this.delayFrame = 1;
    this.unLock();
    this.selectUpdate(this.select);
  }

  leftSideX = _ => this.x + this.w;

  close() {
    console.log("close")
    this.prim.removeChildren();
    this.isOpen = false;
    this.lock();
  }

  lock = _ => this.isLock = true;
  unLock = _ => this.isLock = false;
  forceLock = _ => this.isForceLock = true;
  forceUnLock = _ => this.isForceLock = false;

  getPrim = _ => this.prim;

  selectUpdate = select => {
    if (!this.isOpen) return;
    this.select = select;
    this.cursol.y = this.select * CELL_SIZE + 4;
  }

  up = _ => {
    this.selectUpdate(this.select <= 0 ? this.select = this.menuLength - 1 : this.select - 1);
  }

  down = _ => {
    this.selectUpdate(this.select >= this.menuLength - 1 ? this.select = 0 : this.select + 1);
  }

  update(delta) {
    const { input } = this.core;
    const { inputMap, oldKeymap, isLock, isForceLock, singleUpdate, delayFrame } = this;
    if (delayFrame !== 0) {
      this.delayFrame -= 1
      return;
    }
    if (isLock || isForceLock) return true;
    const newMap = Object.keys(inputMap).map(key => input.isSingleDown(key) ? true : false).join(',');
    if (oldKeymap === newMap) return true;
    singleUpdate(delta);
    this.oldKeymap = Object.keys(inputMap).map(key => input.isSingleDown(key) ? true : false).join(',');
    return false;
  }

  // キーが押された時に更新される
  singleUpdate = (/*delta*/) => {
    const { inputMap, core: { input } } = this;
    const key = Object.keys(inputMap).find(k => input.isSingleDown(k));
    if (key) inputMap[key]();
  }

  getCursolPosition = _ => ({ x: this.cursol.x, y: this.cursol.y });

}

export default UI_Window;