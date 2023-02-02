
class Input {
  constructor() {
    window.addEventListener("keydown", (event) => { this.okKeyDown(event) }, false);
    window.addEventListener("keyup", (event) => { this.onKeyUp(event) }, false);
    this.keyStatus = {}
    this.snapshot = {}
  }

  okKeyDown = e => {
    this.keyStatus[e.key] = {
      down: true
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
  }

  isDown = key => this.snapshot[key].down;

  getDebugString = (keys) => {
    let s = "";
    keys.forEach(key => {
      s = `${s}[${key}:${this.snapshot[key]?.down ? "o" : "x"}]`;
    });
    return s;
  }
}

export default Input;