import { Container } from 'pixi.js';
import UI_ConfirmWindow from './UI_ConfirmWindow';
import UI_EquipmentWindow from './UI_EquipmentWindow';
import UI_ItemStatusWindow from "./UI_ItemStatusWindow"
import UI_ItemWindow from "./UI_ItemWindow";
import UI_MainWindow from './UI_MainWindow';
import UI_StatusWindow from './UI_StatusWindow';

class UI_WindowManager {
    constructor({ core, scene }) {
        this.core = core;
        this.scene = scene;
        // ウィンドウの配列
        this.mainWindow = new UI_MainWindow({ core, scene });
        const { x, y, w } = this.mainWindow;
        this.itemWindow = new UI_ItemWindow({ core, scene, x: x + w, y });
        this.equipmentWindow = new UI_EquipmentWindow({ core, scene, x: x + w, y });
        this.confirmWindow = new UI_ConfirmWindow({ core, scene });
        this.statusWindow = new UI_StatusWindow({ core, scene, x: x + w, y });
        this.itemStatusWindow = new UI_ItemStatusWindow({ core, scene });


        this.windows = [
            this.mainWindow,
            this.itemWindow,
            this.equipmentWindow,
            this.itemStatusWindow,
            this.confirmWindow,
            this.statusWindow
        ];
        const container = new Container();
        this.prim = container;
        this.windows.forEach((w, i) => container.addChildAt(w.getPrim(), i));
        this.inputMap = {
            'e': _ => scene.isWindowOpen ? this.close() : this.open(),
        };
    }

    getMainWindowPos = _ => ({ x: this.mainWindow.x, y: this.mainWindow.y });

    getPrim = _ => this.prim;

    forceLockAll = _ => this.windows.forEach(w => w.forceLock());
    forceUnLockAll = _ => this.windows.forEach(w => w.forceUnLock());

    open = _ => {
        this.mainWindow.open();
    }

    openItemMenu = _ => {
        this.mainWindow.lock();
        this.itemWindow.open();
    }

    closeItemMenu = _ => {
        this.itemWindow.close();
        this.itemStatusWindow.close();
        this.mainWindow.unLock();
    }
    openEquipmentMenu = _ => {
        this.mainWindow.lock();
        this.equipmentWindow.open();
    }

    closeEquipmentMenu = _ => {
        this.itemStatusWindow.close();
        this.equipmentWindow.close();
        this.mainWindow.unLock();
    }

    closeEquipmentWindow = _ => { }

    openConfirmWindow = (win, action) => {
        this.forceLockAll();//全てのウインドウを強制的にロックする
        const { x, y: wy, w } = win;
        const { y } = win.getCursolPosition();
        this.confirmWindow.x = x + w;
        this.confirmWindow.y = y + wy;
        this.confirmWindow.open(action);
        //モーダルウインドウ（最上位）なので自分のウインドウの操作を許す
        this.confirmWindow.forceUnLock();
    }

    openItemStatusWindow = (win, action, item) => {
        const { x, w } = win;
        const { y } = this.getMainWindowPos();
        this.itemStatusWindow.x = x + w;
        this.itemStatusWindow.y = y;
        this.itemStatusWindow.open(action, item);
    }

    openStatusWindow = _ => {
        this.mainWindow.lock();
        this.statusWindow.open();
    }

    closeStatusWindow = _ => {
        this.statusWindow.close();
        this.mainWindow.unLock();
    }


    closeItemStatusWindow = _ => {
    }

    closeConfirmWindow = _ => {
        this.confirmWindow.close();
        this.forceUnLockAll();//全てのウインドウをロック前の状態に戻す
    }

    close = _ => {
        for (const win of this.windows) win.close();
    }

    update = delta => {
        const { core: { input }, inputMap } = this;
        const key = Object.keys(inputMap).find(key => input.isSingleDown(key));
        if (key) inputMap[key]();
        for (const win of this.windows) win.update(delta);
    }
}

export default UI_WindowManager;