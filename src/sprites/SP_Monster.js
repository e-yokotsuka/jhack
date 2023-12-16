import { CELL_SIZE, PLAYER_MAP_BOUNDS } from "../define";

import { BehaviorTypes } from "../model/MD_Status";
import MD_Monster from '../model/MD_Monster';
import SP_Actor from './SP_Actor';
import SP_Trace from "./SP_Trace";
import { Sprite } from 'pixi.js';
import UI_ProgressBar from '../ui/UI_ProgressBar';
import { distance } from '../tools/Calc'

class SP_Monster extends SP_Actor {

  constructor({ core, scene, monsterSetting }) {
    const {
      lv,
      skin,
      characterName,
      currentBehavior,
      speed,
      maxHp,
      maxMp,
      expReward,
      expGold,
      gender,
      race,
    } = monsterSetting;
    const status = new MD_Monster({
      lv,
      hp: maxHp, maxHp,
      mp: maxMp, maxMp,
      gender,
      race,
      expGold,
      expReward,
      speed,
      characterName,
      currentBehavior
    });
    super({ core, scene, status });
    this.status.mapX = 0;
    this.status.mapY = 0;
    const { mainMap } = scene;
    this.mainMap = mainMap;
    this.mainMap.addResetCallback(_ => {
      this.respawn();
    });
    this.skin = skin;
    this.makePrim();
  }

  updateProgressBar = _ => {
    const { hp, maxHp, mp, maxMp } = this;
    this.progressHp.setValue((hp / maxHp * 100));
    this.progressMp.setValue((mp / maxMp * 100));
  }

  makePrim = () => {
    const { core, skin } = this;
    const { textures: { tx_main } } = core;
    const sprite = new Sprite(tx_main[`${skin}`]);
    sprite.interactive = false;
    this.sprite = sprite;
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
    this.container.addChild(this.sprite);
    this.container.addChild(this.progressHp.getPrim());
    if (this.maxMp) this.container.addChild(this.progressMp.getPrim());
    this.updateProgressBar();
  }

  getStatus = _ => this.status;

  respawn = _ => this.spawn()

  spawn = _ => {
    const playerX = this.scene.playerMapX;
    const playerY = this.scene.playerMapY;
    let pos = { x: -1, y: -1 };
    do { // 主人公と同じ位置に出現しないように
      pos = this.mainMap.getRespawnPosition();
    } while ((playerX === pos.x || playerY === pos.y));
    this.status.hp = this.status.maxHp;
    this.move(pos.x, pos.y);
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
    // 痕跡を追加（血など）
    const { core, scene, mapX, mapY } = this;
    this.scene.addTrace(new SP_Trace({ core, scene, mapX, mapY }));
  }

  moveTowardsTarget = target => {
    const targetMapX = target.mapX;
    const targetMapY = target.mapY;
    if (Math.random() < 0.5) { // 左右と上下、どちらに動くか抽選する
      if (targetMapX < this.status.mapX) {
        this.status.trialMove('l');
      } else if (targetMapX > this.status.mapX) {
        this.status.trialMove('r');
      }
    } else {
      if (targetMapY < this.status.mapY) {
        this.status.trialMove('u');
      } else if (targetMapY > this.status.mapY) {
        this.status.trialMove('d');
      }
    }
  }

  getTargetDistance = target => {
    return distance(target, this);
  }

  checkCollision = _ => {
    const { mainMap } = this;
    const { virtualX: vx, virtualY: vy, isWindowOpen, currentBehavior } = this.status;
    const tile = mainMap.getTile(vx, vy);
    const selfUuid = this.uuid;
    const monsters = this.scene.getEnemys();
    const collisions = monsters.filter(({ uuid, status: { mapX, mapY } }) =>
      uuid != selfUuid && mapX === vx && mapY === vy
    );
    const player = this.scene.getPlayer();
    const playerX = player.mapX;
    const playerY = player.mapY;

    if (vx == playerX && vy == playerY) collisions.push(player);

    collisions.forEach(m => {
      const [first, second] = this.determineInitiative([this, m]);
      if (currentBehavior === BehaviorTypes.FRIENDLY || isWindowOpen) {
        return;
      }

      if (currentBehavior === BehaviorTypes.VERY_AGGRESSIVE || first.isPlayer || second.isPlayer) {
        if (!first.isPlayer) this.weaponAttack({ offense: first, defense: second });
        if (!second.isPlayer) this.weaponAttack({ offense: second, defense: first });
      }
    });

    return tile.hit({ actor: this, status }) || collisions.length;
  }


  // 敵の行動ロジック
  doSomething() {
    const { status, status:
      { beforeUpdate,
        afterUpdate,
        isMove,
      } } = this;
    beforeUpdate();
    const target = this.selectAttackTarget()
    if (target) {
      const distance = this.getTargetDistance(target);
      if (distance < PLAYER_MAP_BOUNDS) this.moveTowardsTarget(target);
    }
    if (!isMove()) return; // 動いていない
    const { virtualX: vx, virtualY: vy } = status;
    this.checkCollision(target) || this.moveConfirmed(vx, vy);
    afterUpdate();
  }

  update = (delta) => {
    super.update(delta);
    const { mainMap, status, mainContainer } = this;
    mainContainer.x = mainMap.mapContainer.x + status.mapX * CELL_SIZE;
    mainContainer.y = mainMap.mapContainer.y + status.mapY * CELL_SIZE;
    this.updateProgressBar();
  }

}

export default SP_Monster;


