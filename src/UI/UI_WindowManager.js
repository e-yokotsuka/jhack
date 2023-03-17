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
            this.equipmentWindow,
            this.itemWindow,
            this.confirmWindow
        ];
        const container = new Container();
        this.prim = container;
        this.windows.forEach((w,i)=>container.addChildAt(w.getPrim(),i));
        this.inputMap = {
            'e': _ => core.isWindowOpen? this.close():this.open(),
            'ArrowLeft': _ => core.isWindowOpen && this.close(),
        };
    }

    getPrim = _ => this.prim;

    open = _=> {
        this.mainWindow.open();
    }

    openItemMenu = _=>{
        this.mainWindow.lock();
        this.itemWindow.open();
    }

    closeItemMenu = _=>{
        this.itemWindow.close();
        this.mainWindow.unLock();
    }

    openEqipmentMenu = _=>{
        this.mainWindow.lock();
        this.equipmentWindow.open();
    }

    closeEquipmentMenu = _=>{
        this.equipmentWindow.close();
        this.mainWindow.unLock();
    }

    openConfirmWindow = (win,action) => {
        win.lock();
        const {x,y:wy,w} = win;
        const {y} = win.getCursolPosition();
        this.confirmWindow.x = x + w;
        this.confirmWindow.y = y + wy;
        this.confirmWindow.open(action);
    }

    closeConfirmWindow = win => {
        this.confirmWindow.close();
        win.unLock();
    }

    close = _ => {
        this.itemWindow.isOpen || this.mainWindow.close();
    }

    update = delta => {
        const { core:{ input },inputMap } = this;   
        const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
        if (key) inputMap[key]();
        let f = true;
        for(const win of this.windows){
            if(f) f = win.update(delta);
        }
    }
}

export default UI_WindowManager;