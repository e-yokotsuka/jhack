import TL_Common from "./TL_Common";

class TL_Blank extends TL_Common {
    constructor({ core, x, y }) {
        super({ core, x, y, cellName: 'blank', type: 'blank', isBlocked: true });
    }
}


export default TL_Blank;