class TL_Common {
    constructor({ core, x, y, cellName, type = 'none', isBlocked = false, prim }) {
        console.assert(core);
        this.core = core;
        this.x = x;
        this.y = y;
        this.cellName = cellName;
        this.type = type;
        this.isBlocked = isBlocked;
        this.prim = prim;
        this.hitStep = 0;
    }
    changeTexture = name => this.prim.texture = this.core.getTexture(name);
    hit = _ => this.isBlocked;

    serialize() {
        const keys = ["x", "y", "cellName", "type", "isBlocked", "hitStep"];
        const obj = {};
        keys.forEach(key => obj[key] = this[key])
        return obj;
    }
}

export default TL_Common;