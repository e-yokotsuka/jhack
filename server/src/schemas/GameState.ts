import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
    @type("string") sessionId: string = "";
    @type("string") name: string = "Player";
    @type("string") skin: string = "human";
    @type("number") mapX: number = 5;
    @type("number") mapY: number = 5;
    @type("number") floor: number = 0;
    @type("number") hp: number = 15;
    @type("number") maxHp: number = 15;
    @type("number") mp: number = 100;
    @type("number") maxMp: number = 100;
    @type("number") lv: number = 1;
    @type("number") exp: number = 0;
    @type("number") str: number = 10;
    @type("number") dex: number = 10;
    @type("number") con: number = 10;
    @type("number") intl: number = 10;
    @type("boolean") isHost: boolean = false;
    @type("boolean") isDead: boolean = false;
}

export class MonsterState extends Schema {
    @type("string") uuid: string = "";
    @type("string") skin: string = "";
    @type("string") characterName: string = "";
    @type("number") mapX: number = 0;
    @type("number") mapY: number = 0;
    @type("number") floor: number = 0;
    @type("number") hp: number = 10;
    @type("number") maxHp: number = 10;
    @type("number") lv: number = 1;
    @type("number") expReward: number = 100;
    @type("string") currentBehavior: string = "aggressive";
    @type("boolean") isDead: boolean = false;
}

export class FloorState extends Schema {
    @type([MonsterState]) monsters = new ArraySchema<MonsterState>();
    @type("boolean") mapReady: boolean = false;
}

export class GameState extends Schema {
    @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
    @type([FloorState]) floors = new ArraySchema<FloorState>();
    @type("number") tick: number = 0;
    @type("number") mapSeed: number = 0;
    @type("string") hostSessionId: string = "";
}
