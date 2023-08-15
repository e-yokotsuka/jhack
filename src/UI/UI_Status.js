import { Container, Text } from 'pixi.js';

import UI_ProgressBar from './UI_ProgressBar';

const STATUS_ABS_X = 10;
const STATUS_RELATIVE_Y = -60;


class UI_Status {

  constructor({ core, scene }) {
    const { app: { screen: { height } } } = core;
    const { player } = scene;
    this.core = core;
    this.scene = scene;
    this.player = player;
    this.container = new Container();
    this.primText = new Text('', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'left',
    });
    this.progressHp = new UI_ProgressBar({
      core,
      y: 24
    });
    this.progressMp = new UI_ProgressBar({
      core,
      fillColor: "#0f0fff",
      backgroundColor: "#ff0f0f",
      y: 34
    });
    this.container.addChild(this.primText);
    this.container.addChild(this.progressHp.getPrim());
    this.container.addChild(this.progressMp.getPrim());
    this.container.x = 10;
    this.container.y = height + STATUS_RELATIVE_Y;
  }

  getPrim = _ => this.container;

  resize = (width, height) => {
    this.container.x = STATUS_ABS_X;
    this.container.y = height + STATUS_RELATIVE_Y;
  }

  update = _ => {
    const { hp, maxHp, mp, maxMp, mapX, mapY, steps } = this.player.getStatus();
    const { isWindowOpen } = this.scene;
    this.primText.text = `HP:${hp}/${maxHp} MP: ${mp}/${maxMp} STEP ${steps} : (${mapX},${mapY}) : locked:${isWindowOpen} `;
    this.progressHp.setValue((hp / maxHp * 100));
    this.progressMp.setValue((mp / maxMp * 100));
  }

}

export default UI_Status;


