const diceRoll = (str) => {
  const [rolls, faces] = str.split('d').map(v => v.split('+')[0]);
  const [, modifier = 0] = str.split('+').map(n => n ? parseInt(n, 10) : 0);
  let result = 0;

  for (let i = 0; i < rolls; i++) {
    result += Math.floor(Math.random() * faces) + 1;
  }
  return result + modifier;
};

const calculateMinMax = rollString => {
  const match = rollString.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) {
    throw new Error('Invalid roll format');
  }

  const numberOfDice = parseInt(match[1], 10);
  const facesOnDice = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  const minValue = numberOfDice + modifier; // 最小の出目は、全てのダイスが1の場合
  const maxValue = numberOfDice * facesOnDice + modifier; // 最大の出目は、全てのダイスが最大値の場合

  return { minValue, maxValue };
}

export { diceRoll, calculateMinMax }