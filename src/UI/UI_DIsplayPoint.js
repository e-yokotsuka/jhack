import { Container, Text } from 'pixi.js';

class UI_DIsplayPoint {
    constructor(core, scene) {
        this.core = core;
        this.scene = scene;
        this.container = new Container();
        this.texts = []
    }

    addDisplayPoint({ x = 0, y = 0, pointText }) {
        const text = new Text(`${pointText}`, {
            fontSize: 40,
            fill: 0xffffff,
            align: 'center',
            stroke: "#000000",
            strokeThickness: 2
        });
        text.anchor.set(0.5);
        text.x = x;
        text.y = y;
        this.texts.push({
            text,
            subY: 5,
            destroyed: false
        })
        this.container.addChild(text)
    }

    getPrim = _ => this.container;

    update = delta => {
        this.texts.forEach(({ text, subY }, index) => {
            const sy = subY * delta;
            text.y -= sy;
            text.alpha *= 0.95;
            subY *= 0.95;
            if (subY < 1) {
                text.destroy();
                this.texts[index].destroyed = true;
            }
            this.texts[index].subY = subY;
        });
        this.texts = this.texts.filter(o => !o.destroyed);
    }
}

export default UI_DIsplayPoint;