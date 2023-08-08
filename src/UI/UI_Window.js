import { Container, Graphics, Text } from 'pixi.js';

const CELL_SIZE = 32;
const MENU_MAX_ITEMS = 12;
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
    const labels = menu.map(({ label }) => `${label}`);
    this.menuText = labels.join("\n");
    this.menuLength = menu.length;
    this.menuOffsetPosition = 0;
    this.longest = labels.reduce((acc, str) => {
      return Math.max(acc, str.length);
    }, 0);
    this.menu = menu;
    this.select = 0;
    this.cursolPosition = 0;
    this.w = CELL_SIZE * this.longest + 16;
    this.h = CELL_SIZE * Math.min(MENU_MAX_ITEMS, this.menuLength) + 4;
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

    this.textPrim = text;
    this.panelPrim = panel;
    this.cursolPrim = cursol;
    this.isOpen = true;
    // 同一フレームでウインドウのオープン処理が起きないように
    this.delayFrame = 1;
    this.unLock();
    this.cursolPrim.y = 4;
    this.updateMenuText();
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

  updateMenuText() {
    const { menu, menuOffsetPosition } = this;
    const startIndex = menuOffsetPosition;
    const endIndex = startIndex + MENU_MAX_ITEMS;
    const labels = menu.slice(startIndex, endIndex).map(({ label }) => label);
    this.textPrim.text = labels.join("\n");
  }

  up = _ => {
    if (!this.isOpen) return;
    this.select--;
    this.cursolPosition--;
    if (this.cursolPosition < 0) {// カーソルが最上位にあってかつ上が押された
      if (this.menuLength < MENU_MAX_ITEMS - 1) { // ウインドウの最大要素数よりメニュー項目が少ない場合
        this.cursolPosition = this.menuLength - 1;
        this.select = this.menuLength - 1;
        this.menuOffsetPosition = 0;
      } else if (this.select < 0) {
        // 先頭の要素をが選択されていた場合末尾の要素を選択する
        this.cursolPosition = MENU_MAX_ITEMS - 1;
        this.select = this.menuLength - 1;
        this.menuOffsetPosition = Math.max(this.menuLength - MENU_MAX_ITEMS, 0);
      } else {
        // スクロールする
        this.cursolPosition = 0;
        this.menuOffsetPosition = Math.max(0, this.menuOffsetPosition - 1)
      }
    }
    this.updateMenuText();
    this.cursolPrim.y = this.cursolPosition * CELL_SIZE + 4;
  }

  down = _ => {
    if (!this.isOpen) return;
    this.select++;
    this.cursolPosition++;
    if (this.cursolPosition > Math.min(MENU_MAX_ITEMS, this.menuLength) - 1) {// 末尾の要素を選択していた
      if (this.select >= this.menuLength) {
        // 先頭の要素を選択する
        this.cursolPosition = 0;
        this.select = 0;
        this.menuOffsetPosition = 0;
      } else {
        // スクロールする
        this.cursolPosition = MENU_MAX_ITEMS - 1;
        this.menuOffsetPosition = Math.min(this.menuLength - MENU_MAX_ITEMS, this.menuOffsetPosition + 1)
      }
    }
    this.updateMenuText();
    this.cursolPrim.y = this.cursolPosition * CELL_SIZE + 4;
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

  getCursolPosition = _ => ({ x: this.cursolPrim.x, y: this.cursolPrim.y });

}

export default UI_Window;