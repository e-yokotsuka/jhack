import { Container } from 'pixi.js';
import UI_ItemWindow from "./UI_ItemWindow";
import UI_MainWindow from './UI_MainWindow';

class UI_WindowManager {
    constructor({ core }) {
        this.core = core;
        // ウィンドウの配列
        this.mainWindow  = new UI_MainWindow({ core });
        const {x,y,w} = this.mainWindow;
        this.itemWindow  = new UI_ItemWindow({ core,x:x+w,y });
        this.windows = [this.mainWindow,this.itemWindow];
        const container = new Container();
        this.prim = container;
        this.windows.forEach((w,i)=>container.addChildAt(w.getPrim(),i));
        this.inputMap = {
            'Escape': _ => core.isWindowOpen? this.close():this.open(),
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


    close = _ => {
        this.itemWindow.isOpen || this.mainWindow.close();
    }

    update = delta => {
        const { core:{ input },inputMap } = this;   
        const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
        if (key) inputMap[key]();
        this.windows.reverse().forEach((w)=>w.update(delta));   
    }
}

export default UI_WindowManager;