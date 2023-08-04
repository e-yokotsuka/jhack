import {
    Container
} from 'pixi.js';

class UI_StatusWindow {
    constructor({ core }) {
        this.core = core;
        const container = new Container();
        this.prim = container;

    }

    closeMenu = _ => this.isOpen && this.core.uiWindowManager.closeStatusWindow()

    open() {
        // const { armour,weapon,ring,shield } = this.core.player.equipments();

        super.open();
    }

    update = delta => super.update(delta);

    getPrim = _ => this.prim;

}

export default UI_StatusWindow;