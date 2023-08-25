import TL_Common from "./TL_Common";

class TL_Wall extends TL_Common {
    constructor({ core, x, y, cellName }) {
        super({ core, x, y, cellName, type: 'wall', isBlocked: true });
    }
}

export default TL_Wall;