import { Container } from "pixi.js";
import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Stairs extends TL_Common {
    constructor({ core, x, y, isUp = true, next = {}, floor }) {
        const cellName = isUp ? `stone_stairs_up` : `stone_stairs_down`;
        super({ core, x, y, cellName, type: 'stairs', isBlocked: true });
        this.next = next;
        this.isUp = isUp;
        this.floor = floor;
    }
    initPrim() {
        const prim = new Container();
        prim.addChild(this.floor.initPrim());
        this.stairsPrim = SP_Tile({ core: this.core, name: this.cellName });
        prim.addChild(this.stairsPrim);
        return prim;
    }

    // eslint-disable-next-line no-unused-vars
    hit = ({ actor = null, status }) => {
        this.isUp ? actor.goToPrevLevel(this) : actor.goToNextLevel(this);
        return this.isBlocked;
    }

    serialize() {
        const obj = { ...super.serialize(), isUp: this.isUp, next: this.next };
        return obj;
    }

    setNext = next => {
        this.next = next;
        console.log(next);

    };
}

export default TL_Stairs;