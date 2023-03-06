import MD_Monster from '../model/MD_Monster';
import { Sprite } from 'pixi.js';

class SP_Monster {

  constructor({ core, name = "goblin" }) {
    this.SP_MonsterData = new MD_Monster({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
    });
    this.core = core;
    const { textures: { tx_main }, mainMap } = core;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    const { stage } = this.core.app;
    stage.addChild(sprite);
    this.sprite = sprite;
    this.SP_MonsterData.status.mapX = 0;
    this.SP_MonsterData.status.mapY = 0;
  }

  getSP_MonsterData = _ => this.SP_MonsterData;

  respawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.SP_MonsterData.status.hp = this.SP_MonsterData.status.maxHp;
    this.SP_MonsterData.status.mapX = x;
    this.SP_MonsterData.status.mapY = y;
    // this.mainMap.center(this.SP_MonsterData.status.mapX, this.SP_MonsterData.status.mapY);
  }

  diceRoll = diceText => this.core.diceRoll(diceText);

  trappedIn = ({
    dmg,
    difficulty
  }) => {
    const s = this.diceRoll("1d20") + 0; //Todo
    return (difficulty <= s) ? 0 : this.diceRoll(dmg);
  }

  hit = dmg => {
    const hp = this.SP_MonsterData.status.hp - dmg;
    this.SP_MonsterData.status.hp = Math.max(hp, 0);
    if (hp < 1) {
      this.core.addText(`し  ん  だ  よ`);
      this.respawn();
      return true;
    }
    return false;
  }


  update = (/*delta*/) => {
  }


}

export default SP_Monster;


