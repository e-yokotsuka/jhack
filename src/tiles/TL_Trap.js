import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Trap extends TL_Common {
    constructor({ core, x, y, trap }) {
        const cellName = 'floor_vines0';
        const prim = SP_Tile({ core, name: cellName });
        super({ core, x, y, cellName, type: 'trap', isBlocked: false, prim });
        this.trap = trap;
        this.active = true;
    }

    hit = ({ actor }) => {
        if (!this.active) return this.isBlocked;
        const { trap } = this;
        const dmg = actor.trappedIn(trap);
        if (dmg) {
            this.active = false;
            this.cellName = 'dngn_trap_magical';
            this.changeTexture(`dngn_trap_magical`);
        } else {
            actor.escapeTrap()
        }
        return this.isBlocked;
    }
}

export default TL_Trap;