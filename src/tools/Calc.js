
// 書式
// diceRoll('10'); 
// diceRoll('10+1');
// diceRoll('10+1+2');
// diceRoll('1d6');
// diceRoll('1d6+1');
// diceRoll('1d6+1+2');
// diceRoll('20+dex',stats); // 20 + 俊敏性修正値
// diceRoll('3d6+str',stats);
// diceRoll('3d6+12+intl',stats);
// diceRoll('3d4+10+12+inlt',stats);
// diceRoll('10+str+dex+intl',stats);
const PARAMSET = ['str', 'dex', 'con', 'intl', 'wiz', 'cha'];
const diceRoll = ({ diceText, status, isMinMax = false }) => {
  const [rolls, faces] = diceText.split('d').map(v => v.split('+')[0]);
  let modifiers = diceText.split('+');
  modifiers.shift();
  modifiers = modifiers.map(n => {
    if (status && PARAMSET.includes(n)) {
      // statusオブジェクトが存在し、PARAMSETにnが含まれている場合
      return calculateModifier(Number(status[n]), Number(status.modifiers[n]));
    } else if (n) {
      // nが真偽値でtrueになる値（空文字やnull、undefined、0などではない）の場合
      return Number(n);
    } else {
      // 上記のどちらでもない場合（nが空文字やnull、undefined、0の場合）
      return 0;
    }
  });

  const modifier = modifiers.reduce((m, sum) => sum + m, 0);
  let result = modifier;
  let minValue = modifier;
  let maxValue = modifier;
  if (checkDicePattern(diceText)) {
    for (let i = 0; i < rolls; i++) {
      result += Math.floor(Math.random() * faces);
      minValue += 1;
      maxValue += +faces;
    }
  }
  return isMinMax ? { minValue, maxValue } : result + modifiers.slice(1).reduce((a, b) => a + b, 0);
};

const checkDicePattern = (str) => {
  const regex = /\b\d+d\d+\b/g;
  return regex.test(str);
}
// 修正値を求める為の定数。最大パラメータを51分割して修正値を求める
const MODIFIER = Math.floor(999 / 51);
const calculateModifier = (param, modifier) => Math.floor(param / MODIFIER) + modifier;

const calculateMinMax = ({ diceText, status }) => diceRoll({ diceText, status, isMinMax: true });

// アクター同士の距離をはかる
const distance = (actor1, actor2) => {
  const dx = actor1.mapX - actor2.mapX;
  const dy = actor1.mapY - actor2.mapY;
  return Math.sqrt(dx * dx + dy * dy);
}

export { diceRoll, calculateMinMax, distance, calculateModifier }