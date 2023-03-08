import { Container, Graphics, Text } from 'pixi.js';

const CELL_SIZE = 32;
class UI_Window {
  constructor({ core, x = 0, y = 0, menu = [{ label: "menu1", action: _ => { } }, { label: "menu2", action: _ => { } }], parent = null }) {
    this.core = core;
    this.parent = parent;
    this.children = []; 
    const container = new Container();
    this.prim = container;
    this.oldKeymap = [];
    this.x = x;
    this.y = y;
    this.isLock = false;
    this.inputMap = {
      'o': _ => !this.isOpen ? this.open() : this.close(),
      'w': _ => this.up(),
      's': _ => this.down(),
      ' ': _ => this.selected(),
      'ArrowUp': _ => this.up(),
      'ArrowDown': _ => this.down(),
    };
    this.setMenu(menu);
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
  }

  selected = _ => {
    const { isOpen, menu, select } = this;
    if (!isOpen) return;
    menu[select].action()
  }

  open = _ => {
    const { menuText, menuLength } = this;

    const container = this.prim;
    const text = new Text(menuText, {
      fontSize: 28,
      fill: 0xffffff,
      align: 'left',
      lineHeight: 32
    });
    text.setTransform(this.x + 8, this.y + 4)

    this.w = CELL_SIZE * this.longest + 16;
    this.h = CELL_SIZE * menuLength + 4;

    const panel = new Graphics();
    panel.lineStyle(2, 0xFF00FF, 1);
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
    this.selectUpdate(this.select);

  }

  leftSideX = _=> this.x + this.w;

  close = _ => {
    this.prim.removeChildren();
    this.isOpen = false;
  }

  lock = _ => this.isLock = true;
  unlock = _ => this.isLock = false;
  parentUnlock = _ => this.parent && this.parent.unlock();

  getPrim = _ => this.prim;

  addChild(child) {
    this.children.push(child);
    this.prim.addChild(child.getPrim());
  }

  selectUpdate = select => {
    this.select = select;
    this.cursol.y = this.select * CELL_SIZE + 4;
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
    const { inputMap, oldKeymap, children,singleUpdate} = this;
    children.forEach(c => c.update());
    const newMap = Object.keys(inputMap).map(key => input.isSingleDown(key)).join(',');
    if (oldKeymap === newMap) return;
    singleUpdate();
    this.oldKeymap = Object.keys(inputMap).map(key => input.isSingleDown(key)).join(',');
  }

  // キーが押された時に更新される
  singleUpdate = (/*delta*/) => {
    console.log("window key input")
    const { inputMap, core: { input },isLock } = this;
    const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
    if (isLock) return;
    if (key) inputMap[key]();
  }
}

export default UI_Window;