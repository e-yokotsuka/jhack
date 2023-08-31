import { CELL_SIZE } from "../define";
import { Container } from "pixi.js";
import MD_Monster from '../model/MD_Monster';
import SP_Actor from './SP_Actor';
import { Sprite } from 'pixi.js';
import UI_ProgressBar from '../ui/UI_ProgressBar';
import { distance } from '../tools/Calc'

class SP_Monster extends SP_Actor {

  constructor({ core, scene, name = "goblin" }) {
    const status = new MD_Monster({
      hp: 15, maxHp: 15,
      mp: 10, maxMp: 10,
      expReward: 100,
      characterName: 'ごぶりん'
    });
    super({ core, scene, status });
    const { textures: { tx_main } } = core;
    const { mainMap } = scene;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    const sprite = new Sprite(tx_main[`${name}`]);
    sprite.interactive = false;
    this.sprite = sprite;
    this.status.mapX = 0;
    this.status.mapY = 0;
    this.progressHp = new UI_ProgressBar({
      core,
      y: 32,
      borderColor: "#000000",
      width: 33,
      height: 3
    });
    this.progressMp = new UI_ProgressBar({
      core,
      fillColor: "#0f0fff",
      backgroundColor: "#ff0f0f",
      borderColor: "#000000",
      y: 33 + 2,
      width: 32,
      height: 3
    });
    this.container = new Container();
    this.container.addChild(this.sprite);
    this.container.addChild(this.progressHp.getPrim());
    this.container.addChild(this.progressMp.getPrim());
    this.updateProgressBar();
  }

  updateProgressBar = _ => {
    const { hp, maxHp, mp, maxMp } = this;
    this.progressHp.setValue((hp / maxHp * 100));
    this.progressMp.setValue((mp / maxMp * 100));
  }

  getPrim = _ => this.container;

  getStatus = _ => this.status;

  respawn = _ => this.spawn()

  spawn = _ => {
    const { x, y } = this.mainMap.getRespawnPosition();
    this.status.hp = this.status.maxHp;
    this.move(x, y);
    // this.mainMap.center(this.status.mapX, this.status.mapY);
  }

  trappedIn = ({
    dmg,
    difficulty
  }) => {
    const { addText, status, characterName } = this;
    const s = this.diceRoll({ diceText: "1d20+dex", status });
    const point = (difficulty <= s) ? 0 : this.diceRoll({ diceText: dmg });
    if (point) {
      addText(`${characterName}が、罠にハマってら！`);
      this.applyDamage({ point, silent: true });
      return true;
    }
    return false;
  }

  died(target) {
    this.addText(`${this.characterName}は、 し  ん  だ  よ`);
    if (target) target.applyExp(this);
    this.getPrim().destroy();
    this.isDie = true;
    this.scene.refreshMonsters();
  }

  moveTowardsPlayer = _ => {
    const playerMapX = this.scene.playerMapX;
    const playerMapY = this.scene.playerMapY;
    if (playerMapX < this.status.mapX) {
      this.status.trialMove('l');
    } else if (playerMapX > this.status.mapX) {
      this.status.trialMove('r');
    } else if (playerMapY < this.status.mapY) {
      this.status.trialMove('u');
    } else if (playerMapY > this.status.mapY) {
      this.status.trialMove('d');
    }
  }

  getPlayerDistance = _ => {
    return distance(this.scene.getPlayerStatus(), this.status);
  }

  checkCollision = _ => {
    const { mainMap } = this;
    const { mapX: playerX, mapY: playerY } = this.scene.getPlayerStatus();
    const { virtualX: vx, virtualY: vy } = this.status;
    const tile = mainMap.getTile(vx, vy);
    const selfUuid = this.uuid;
    const monsters = this.scene.getEnemys();
    const collisions = monsters.filter(({ uuid, status: { mapX, mapY } }) => uuid != selfUuid && mapX === vx && mapY === vy);
    if (vx == playerX && vy == playerY) collisions.push(this.scene.getPlayer());
    collisions.forEach(m => {
      const [first, second] = this.determineInitiative([this, m]);
      this.weponAttack({ offense: first, defense: second });
      this.weponAttack({ offense: second, defense: first });
    })
    return tile.hit({ actor: this, status }) || collisions.length
  }

  // 敵の行動ロジック
  doSomething() {
    const { status, status:
      { beforeUpdate,
        afterUpdate,
        isMove,
      } } = this;
    beforeUpdate();
    const distance = this.getPlayerDistance();
    if (distance < 10) this.moveTowardsPlayer();

    if (!isMove()) return; // 動いていない
    const { virtualX: vx, virtualY: vy } = status;
    if (distance < 10) this.moveTowardsPlayer();
    this.checkCollision() || this.moveConfirmed(vx, vy);
    afterUpdate();
  }

  update = (/*delta*/) => {
    const { mainMap, status, container } = this;
    container.x = mainMap.mapContainer.x + status.mapX * CELL_SIZE;
    container.y = mainMap.mapContainer.y + status.mapY * CELL_SIZE;
    this.updateProgressBar();
  }

}

export default SP_Monster;


