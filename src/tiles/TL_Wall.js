import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Wall extends TL_Common {
    constructor({ core, x, y ,cellName}) {
        const prim = SP_Tile({ core, name: cellName });
        super({ core, x, y, cellName, type: 'wall', isBlocked: true ,prim});
    }
}

export default TL_Wall;