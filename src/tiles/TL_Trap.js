import { Container } from "pixi.js";
import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Trap extends TL_Common {
    constructor({ core, x, y, trap, floor }) {
        super({ core, x, y, cellName: 'floor_vines0', type: 'trap', isBlocked: false });
        this.trap = trap;
        this.active = true;
        this.floor = floor;
    }

    initPrim() {
        const prim = new Container();
        prim.addChild(this.floor.initPrim());
        this.trapPrim = SP_Tile({ core: this.core, name: this.cellName });
        prim.addChild(this.trapPrim);
        return prim;
    }

    changeTexture(name) {
        this.trapPrim.texture = this.core.getTexture(name);
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