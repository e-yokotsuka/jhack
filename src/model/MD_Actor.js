import MD_Status from "./MD_Status";

class MD_Actor {
  constructor(status) {
    this.status = MD_Status({ ...status });
  }

  //仮の移動を行う
  trialMove = (direction = '.') => {
    if (this.status.lock) return; //ロック中(UI表示中など)は、移動不可
    const { mapX, mapY } = this.status;
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
    this.status.virtualX = virtualX;
    this.status.virtualY = virtualY;
  }

  //移動確定
  moveConfirmed = _ => {
    this.status.mapX = this.status.virtualX;
    this.status.mapY = this.status.virtualY;
  }

  // とどまる
  stay = _ => this.status.lock ? null : this.status.stay = true;

  //ロック
  lock = _ => this.status.lock = true;
  //ロック解除
  unlock = _ => this.status.lock = false;
  //ロック状態
  isLock = _ => this.status.lock;

  // 動いたか？
  isMove = _ => (this.status.stay || this.status.virtualX !== this.status.mapX || this.status.virtualY !== this.status.mapY)

  // フレーム更新のupdate前に呼ばれる
  beforeUpdate = _ => {
    if( this.status.respawn ){ // respawn時は値を初期化しない。
      this.status.respawn = false;
      return;
    }
    this.status.stay = false;
    this.status.virtualX = this.status.mapX;
    this.status.virtualY = this.status.mapY;
  }


}

export default MD_Actor;