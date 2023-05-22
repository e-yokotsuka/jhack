import { Container } from 'pixi.js';
import UI_ConfirmWindow from './UI_ConfirmWindow';
import UI_EquipmentWindow from './UI_EquipmentWindow';
import UI_ItemWindow from "./UI_ItemWindow";
import UI_MainWindow from './UI_MainWindow';

class UI_WindowManager {
    constructor({ core }) {
        this.core = core;
        // ウィンドウの配列
        this.mainWindow  = new UI_MainWindow({ core });
        const {x,y,w} = this.mainWindow;
        this.itemWindow  = new UI_ItemWindow({ core,x:x+w,y });
        this.equipmentWindow = new UI_EquipmentWindow({ core,x:x+w,y });
        this.confirmWindow = new UI_ConfirmWindow({ core });
        this.windows = [
            this.mainWindow,
            this.itemWindow,
            this.equipmentWindow,
            this.confirmWindow,
        ];
        this.openWindow=[];
        const container = new Container();
        this.prim = container;
        this.windows.forEach((w,i)=>container.addChildAt(w.getPrim(),i));
        this.inputMap = {
            'e': _ => core.isWindowOpen? this.close():this.open(),
            'ArrowLeft': _ => core.isWindowOpen && this.close(),
        };
    }

    getPrim = _ => this.prim;

    parentLock = _=>  this.openWindow.forEach(w=>w.lock());

    childWindowClose = _=>  {
        const cw = this.openWindow.pop();
        if( cw ){
            cw.close();
            cw.unLock();
        }
        this.childWindowUnlock();
    }

    childWindowUnlock = _=>  {
        const pw = this.openWindow[this.openWindow.length - 1] ?? undefined;
        pw && pw.unLock();
    }

    open = _=> {
        this.mainWindow.open();
        this.openWindow.push(this.mainWindow);
    }

    openItemMenu = _=>{
        this.parentLock();
        this.itemWindow.open();
        this.openWindow.push(this.itemWindow);
    }

    closeItemMenu = _=>{
        this.childWindowClose();
    }

    openEqipmentMenu = _=>{
        this.parentLock();
        this.equipmentWindow.open();
        this.openWindow.push(this.equipmentWindow);
    }

    closeEquipmentMenu = _=>{
        this.childWindowClose();
    }

    openConfirmWindow = (win,action) => {
        this.parentLock();
        win.lock();
        const {x,y:wy,w} = win;
        const {y} = win.getCursolPosition();
        this.confirmWindow.x = x + w;
        this.confirmWindow.y = y + wy;
        this.confirmWindow.open(action);
        this.openWindow.push(this.confirmWindow);
    }

    closeConfirmWindow = _ => {
        this.childWindowClose();
    }

    close = _ => {
        if (this.equipmentWindow.isOpen || this.itemWindow.isOpen) return;
        this.mainWindow.close();
    }

    update = delta => {
        const { core:{ input },inputMap } = this;   
        const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
        if (key) inputMap[key]();
        let f = true;
        for(const win of this.openWindow){
            if(f) f = win.update(delta);
        }
    }
}

export default UI_WindowManager;