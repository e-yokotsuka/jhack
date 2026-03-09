import { CELL_SIZE, PLAYER_MAP_BOUNDS } from "../define";
import { BehaviorTypes } from "../model/MD_Status";
import MD_NPC from '../model/MD_NPC';
import { NPC_DISPOSITION } from '../data/MS_NPC';
import SP_Actor from './SP_Actor';
import SP_Trace from "./SP_Trace";
import { Sprite } from 'pixi.js';
import UI_ProgressBar from '../ui/UI_ProgressBar';
import { distance } from '../tools/Calc';

const DISPOSITION_TO_BEHAVIOR = {
    [NPC_DISPOSITION.NEUTRAL]: BehaviorTypes.FRIENDLY,
    [NPC_DISPOSITION.WARLIKE]: BehaviorTypes.AGGRESSIVE,
    [NPC_DISPOSITION.HOSTILE]: BehaviorTypes.VERY_AGGRESSIVE,
};

class SP_NPC extends SP_Actor {
    constructor({ core, scene, npcSetting }) {
        const {
            lv, skin, characterName, disposition, speed,
            maxHp, maxMp, gender, race, dialogues, expReward,
        } = npcSetting;

        const status = new MD_NPC({
            lv,
            hp: maxHp, maxHp,
            mp: maxMp, maxMp,
            gender, race, speed,
            characterName,
            expReward: expReward || 0,
            currentBehavior: DISPOSITION_TO_BEHAVIOR[disposition] || BehaviorTypes.FRIENDLY,
        });

        super({ core, scene, status });
        this.status.mapX = 0;
        this.status.mapY = 0;
        this.disposition = disposition;
        this.dialogues = dialogues || [];
        this.skin = skin;
        this.spawnConfig = npcSetting.spawnConfig;

        const { mainMap } = scene;
        this.mainMap = mainMap;
        this.makePrim();
    }

    makePrim = () => {
        this.container.removeChildren();
        const { core, skin } = this;
        const { textures: { tx_main } } = core;
        const sprite = new Sprite(tx_main[`${skin}`]);
        sprite.eventMode = 'auto';
        this.sprite = sprite;
        this.progressHp = new UI_ProgressBar({
            core,
            y: 32,
            borderColor: "#000000",
            width: 33,
            height: 3
        });
        this.container.addChild(this.sprite);
        this.container.addChild(this.progressHp.getPrim());
        this.updateProgressBar();
    }

    updateProgressBar = _ => {
        const { hp, maxHp } = this;
        this.progressHp.setValue((hp / maxHp * 100));
    }

    getStatus = _ => this.status;

    spawn = () => {
        const { spawnConfig } = this;
        this.status.hp = this.status.maxHp;
        if (spawnConfig.x !== undefined && spawnConfig.y !== undefined) {
            this.move(spawnConfig.x, spawnConfig.y);
        } else {
            const playerX = this.scene.playerMapX;
            const playerY = this.scene.playerMapY;
            let pos;
            do {
                pos = this.mainMap.getRespawnPosition();
            } while (playerX === pos.x && playerY === pos.y);
            this.move(pos.x, pos.y);
        }
    }

    // 会話可能か判定（HOSTILE は会話不可）
    canTalk = () => this.disposition !== NPC_DISPOSITION.HOSTILE && this.dialogues.length > 0;

    // 会話を試みる
    tryDialogue = () => {
        if (!this.canTalk()) return false;
        this.scene.openNPCDialog(this);
        return true;
    }

    trappedIn = ({ dmg, difficulty }) => {
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
        this.scene.refreshNPCs();
        const { core, scene, mapX, mapY } = this;
        this.scene.addTrace(new SP_Trace({ core, scene, mapX, mapY }));
    }

    moveTowardsTarget = target => {
        const targetMapX = target.mapX;
        const targetMapY = target.mapY;
        if (Math.random() < 0.5) {
            if (targetMapX < this.status.mapX) this.status.trialMove('l');
            else if (targetMapX > this.status.mapX) this.status.trialMove('r');
        } else {
            if (targetMapY < this.status.mapY) this.status.trialMove('u');
            else if (targetMapY > this.status.mapY) this.status.trialMove('d');
        }
    }

    getTargetDistance = target => distance(target, this);

    checkCollision = _ => {
        const { mainMap, status: { virtualX: vx, virtualY: vy, currentBehavior } } = this;
        const tile = mainMap.getTile(vx, vy);
        const selfUuid = this.uuid;
        const allActors = [...this.scene.getEnemys(), ...this.scene.getNpcs()];
        const collisions = allActors.filter(({ uuid, status: { mapX, mapY } }) =>
            uuid !== selfUuid && mapX === vx && mapY === vy
        );
        const player = this.scene.getPlayer();
        if (player.mapX === vx && player.mapY === vy) collisions.push(player);

        collisions.forEach(m => {
            if (currentBehavior === BehaviorTypes.FRIENDLY) return;
            const [first, second] = this.determineInitiative([this, m]);
            if (currentBehavior === BehaviorTypes.VERY_AGGRESSIVE || first.isPlayer || second.isPlayer) {
                if (!first.isPlayer) this.weaponAttack({ offense: first, defense: second });
                if (!second.isPlayer) this.weaponAttack({ offense: second, defense: first });
            }
        });

        return tile.hit({ actor: this, status: this.status }) || collisions.length;
    }

    // NPCの行動ロジック（NEUTRAL は待機、WARLIKE/HOSTILE は移動・攻撃）
    doSomething() {
        if (!this.canAct()) return;
        const { status: { beforeUpdate, afterUpdate, isMove, currentBehavior } } = this;
        beforeUpdate();

        if (currentBehavior !== BehaviorTypes.FRIENDLY) {
            const target = this.selectAttackTarget();
            if (target) {
                const d = this.getTargetDistance(target);
                if (d < PLAYER_MAP_BOUNDS) this.moveTowardsTarget(target);
            }
        }

        if (!isMove()) return;
        const { virtualX: vx, virtualY: vy } = this.status;
        this.checkCollision() || this.moveConfirmed(vx, vy);
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

export default SP_NPC;
