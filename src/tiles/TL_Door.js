import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Door extends TL_Common {
    constructor({ core, x, y }) {
        const cellName = `dngn_closed_door`;
        const prim = SP_Tile({ core, name: cellName });
        super({ core, x, y, cellName, type: 'door', isBlocked: true, prim });
        this.close = true;
    }

    // eslint-disable-next-line no-unused-vars
    hit = ({ actor = null, status }) => {
        if (!this.close) return this.isBlocked;
        const { close, hitStep } = this;
        console.log(hitStep)
        if (hitStep + 1 == status.steps && close) {
            this.close = false;
            this.isBlocked = false;
            this.changeTexture(`dngn_open_door`);
            actor.openDoor(this);
        } else {
            this.hitStep = status.steps;
            actor.discoverDoor(this);
        }
        return this.isBlocked;
    }
}

export default TL_Door;