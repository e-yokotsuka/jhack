// マップ生成用シード乱数 (Mulberry32 PRNG)
// マルチプレイ時はサーバーからシードを受け取り、全クライアントで同一マップを生成する

let _seed = 0;
let _active = false;

const mulberry32 = () => {
    _seed |= 0;
    _seed = _seed + 0x6D2B79F5 | 0;
    let t = Math.imul(_seed ^ _seed >>> 15, 1 | _seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// マップ生成開始前に呼ぶ（フロアごとに seed + floor でユニークなシードを生成）
export const setMapSeed = (seed, floor = 0) => {
    _seed = (seed + floor * 1000003) | 0;
    _active = true;
};

// マップ生成終了後に呼ぶ
export const clearMapSeed = () => {
    _active = false;
};

// マップ生成ツール内でこれを使う
export const mapRandom = () => _active ? mulberry32() : Math.random();

// ランダムシードを生成する（サーバーから受け取れない場合のフォールバック）
export const generateSeed = () => Math.floor(Math.random() * 2147483647);
