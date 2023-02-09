const diceRoll = (str) => {
  const [rolls, faces] = str.split('d').map(v => v.split('+')[0]);
  const [, modifier = 0] = str.split('+').map(n => n ? parseInt(n, 10) : 0);
  let result = 0;

  for (let i = 0; i < rolls; i++) {
    result += Math.floor(Math.random() * faces) + 1;
  }
  return result + modifier;
};

export default diceRoll;