import { Application, Assets, Text } from 'pixi.js';

import Input from './Input';
import MP_AutoMap from '../map/MP_AutoMap';
import SP_Player from '../sprites/SP_Player';
import Stats from 'stats.js';
import UI_MessageBox from '../ui/UI_MessageBox'
import UI_Status from '../ui/UI_Status';
import diceRoll from '../tools/Calc';

class Core {
  constructor({ isShowStats = true }) {
    const dom = document.getElementById('contents');
    const { width, height } = this.getCanvasSize();
    this.app = new Application({
      backgroundColor: 0x000000,
      width, height
    });
    if (isShowStats) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      dom.appendChild(this.stats.dom);
    }
    dom.appendChild(this.app.view);
    this.loaded = false;
    this.mainScale = 1;
  }

  resize = _ => {
    const { width, height } = this.getCanvasSize();
    console.log(`canvas w:${width}/h${height}`);
    this.app.renderer.resize(width, height);
    this.uiStatus.resize(width, height);
    this.mainMap.center();
  }

  getCanvasSize = _ => ({ width: Math.floor(window.innerWidth / 2) * 2, height: Math.floor(window.innerHeight / 2) * 2 })

  Load = async _ => {
    this.loaded = true;
    const { textures } = await Assets.load('./assets/sprites/main.json', p => console.info(p));
    this.textures = {};
    this.textures["tx_main"] = textures;
    return this.loaded;
  }

  Start = async _ => {
    const { app, stats, loaded, mainScale } = this;
    console.assert(loaded, 'Resource not loaded.');
    this.mainMap = new MP_AutoMap({ core: this }); 0
    const { height: canvasHeight } = this.getCanvasSize();
    const text = new Text('よくぞいらした。\nここムーリダヤ・メタインでは\n恐ろしき魔物との戦いが数千年にわたって繰り広げられている。', {
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    text.y = canvasHeight;
    console.log(`text-y:${text.y}/${canvasHeight}`)
    const keytext = new Text('debug key string', {
      fontSize: 20,
      fill: 0xffffff,
      align: 'center',
    });
    app.stage.addChild(keytext);
    keytext.x = 0;
    keytext.y = 0;

    this.input = new Input();
    app.stage.addChild(text);
    this.player = new SP_Player({ core: this });
    this.player.respawn();
    this.uiStatus = new UI_Status({ core: this });
    app.stage.addChild(this.uiStatus.getPrim());
    this.uiMessageBox = new UI_MessageBox({ core: this });
    app.stage.addChild(this.uiMessageBox.getPrim());


    window.addEventListener('resize', this.resize);
    this.resize();

    app.ticker.add((delta) => {
      stats.begin();
      app.stage.scale.x = mainScale;
      app.stage.scale.y = mainScale;
      const { width: canvasWidth } = this.getCanvasSize();
      this.input.update();
      this.mainMap.update(delta);
      keytext.text = this.input.getDebugString(['w', 'a', 'd', 's', 'z']);
      this.uiStatus.update();
      text.y -= delta * 0.2;
      text.y = Math.max(text.y, 0);
      text.x = (canvasWidth - text.width) / 2;
      this.player.update(delta);
      this.uiMessageBox.update(delta);
      stats.end();
    });
  }

  isKeyDown = key => this.input.isDown(key);
  isKeyUp = key => !this.input.isDown(key);

  addText = text => this.uiMessageBox.addText(text);
  getTexture = texName => this.textures.tx_main[texName];

  diceRoll = diceText => diceRoll(diceText);

  // stepが更新された
  handleStepUpdate = (/* vx, vy*/) => {
    console.log(`step update`)
    // プレイヤーの動作を行う（移動、アイテム使用、攻撃など）
    // 敵のAIによる移動、攻撃などの動作を行う
    // 衝突判定を行い、プレイヤーと敵が衝突した場合は戦闘処理を行う
    // 新しい部屋や通路などが必要な場合は生成する
    // アイテムや敵の出現をランダムに決定する
    //actionPlayer(); // プレイヤーの動作を行う
    //moveEnemy() // 敵の移動
    //actionEnemy() // 敵のアクション
    //spawnEnemy() // 敵の出現
    //    console.log(`vx:${vx}/vy:${vy}`);
  }

}

export default Core;