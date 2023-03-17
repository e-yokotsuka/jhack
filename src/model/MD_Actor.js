import MD_Status from "./MD_Status";

class MD_Actor {
  constructor(status) {
    Object.keys(MD_Status({ ...status })).forEach(key=>this[key]=status[key]);
  }

  //仮の移動を行う
  trialMove = (direction = '.') => {
    if (this.lock) return; //ロック中(UI表示中など)は、移動不可
    const { mapX, mapY } = this;
    let virtualX = mapX;
    let virtualY = mapY;

    const f = {
      "l": _ => virtualX = mapX - 1,
      "r": _ => virtualX = mapX + 1,
      "u": _ => virtualY = mapY - 1,
      "d": _ => virtualY = mapY + 1,
      ".": _ => _
    }
    console.assert(f[direction], `The specified movement direction code '${direction}' does not exist. `)
    f[direction]?.()
    this.virtualX = virtualX;
    this.virtualY = virtualY;
  }

  //移動確定
  moveConfirmed = _ => {
    this.mapX = this.virtualX;
    this.mapY = this.virtualY;
  }

  // とどまる
  stay = _ => this.lock ? null : this.isStay = true;

  //ロック
  lock = _ => this.lock = true;
  //ロック解除
  unlock = _ => this.lock = false;
  //ロック状態
  isLock = _ => this.lock;

  // 動いたか？
  isMove = _ => (
    this.force_update
    || this.isStay
    || this.virtualX !== this.mapX
    || this.virtualY !== this.mapY)

  // フレーム更新のupdate前に呼ばれる
  beforeUpdate = _ => {
    // 強制アップデート時は位置と状態を初期化しない。
    if (this.force_update) return;
    this.isStay = false;
    this.virtualX = this.mapX;
    this.virtualY = this.mapY;
  }

  // フレーム更新のupdate後に呼ばれる
  afterUpdate = _ => {
    this.force_update = false;
  }
 
}

export default MD_Actor;