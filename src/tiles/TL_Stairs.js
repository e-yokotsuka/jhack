import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Stairs extends TL_Common {
    constructor({ core, x, y, isUp = true, next = {} }) {
        const cellName = isUp ? `rock_stairs_up` : `rock_stairs_down`;
        const prim = SP_Tile({ core, name: cellName });
        super({ core, x, y, cellName, type: 'stairs', isBlocked: false, prim });
        this.next = next;
        this.isUp = isUp;
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