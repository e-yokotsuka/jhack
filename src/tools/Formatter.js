
export const padEnd = (inputStr = "", length, space = '　') => `${inputStr}`.padEnd(length, space).slice(0, length);

