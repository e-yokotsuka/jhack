
class Input {
  constructor() {
    window.addEventListener("keydown", (event) => { this.okKeyDown(event) }, false);
    window.addEventListener("keyup", (event) => { this.onKeyUp(event) }, false);
    this.keyStatus = {}
    this.snapshot = {}
  }

  okKeyDown = e => {
    this.keyStatus[e.key] = {
      down: true,
      isSingleDown: true
    }
  }

  onKeyUp = e => {
    this.keyStatus[e.key] = {
      down: false
    }
  }

  update = _ => {
    this.snapshot = {
      ...this.snapshot,
      ...this.keyStatus
    }
    Object.keys(this.keyStatus).forEach(key => {
      const { down, isSingleDown } = this.keyStatus[key];
      this.keyStatus[key] = { down, isSingleDown: down ? false : isSingleDown };
    })
  }

  isDown = key => this.snapshot[key]?.down;
  isSingleDown = key => this.snapshot[key]?.isSingleDown;

  getDebugString = (keys) => {
    let s = "";
    keys.forEach(key => {
      s = `${s}[${key}:${this.snapshot[key]?.down ? "o" : "x"}]`;
      s = `${s}[${key}:${this.snapshot[key]?.isSingleDown ? "o" : "x"}]`;
    });
    return s;
  }
}

export default Input;