import SP_Tile from "../sprites/SP_Tile";
import TL_Common from "./TL_Common";

class TL_Blank extends TL_Common {
    constructor({ core, x, y }) {
        const cellName = 'blank';
        const prim = SP_Tile({ core, name: cellName });
        super({ core, x, y, cellName, type: 'blank', isBlocked: true ,prim});
    }
}

export default TL_Blank;