import TL_Common from "./TL_Common";

class TL_Road extends TL_Common {
    constructor({ core, x, y, cellName }) {
        super({ core, x, y, cellName, type: 'road', isBlocked: false });
    }
}

export default TL_Road;