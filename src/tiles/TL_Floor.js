import TL_Common from "./TL_Common";

class TL_Floor extends TL_Common {
    constructor({ core, x, y, cellName }) {
        super({ core, x, y, cellName, type: 'floor', isBlocked: false });
    }
}

export default TL_Floor;