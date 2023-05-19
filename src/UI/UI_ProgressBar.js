import { Graphics } from 'pixi.js';
import { ProgressBar } from '@pixi/ui';

class UI_ProgressBar {

  constructor({ core,x=0,y=0,value=100,width=200,height=8,fillColor="#f6ff00",backgroundColor="#ff0000",borderColor="#ffffff"}) {
    this.core = core;
    const border = 1;
    const radius = 1;

    const bg = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(backgroundColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    const fill = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(fillColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    // Component usage
    this.progressBar = new ProgressBar({
        bg,
        fill,
        progress: value
    });
    this.progressBar.x = x;
    this.progressBar.y = y;
  }

  getPrim = _ => this.progressBar;
  
  setValue = value =>{
    this.progressBar.progress = value;
  }
 
}

export default UI_ProgressBar;


