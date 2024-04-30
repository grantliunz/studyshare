function incrementRomanNumeral(roman: string): string {
  const romanValues: [number, string][] = [
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i']
  ];

  let total = 0;
  let result = '';

  for (const [value, numeral] of romanValues) {
    while (total + value <= convertRomanToNumber(roman) + 1) {
      result += numeral;
      total += value;
    }
  }

  return result;
}

// check if a string is a valid Roman numeral
export const isRomanNumeral = (str: string) => {
  const romanNumeralPattern =
    /^(m{0,3})(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;
  return romanNumeralPattern.test(str);
};

export const convertRomanToNumber = (roman: string): number => {
  const romanValues: Record<string, number> = {
    i: 1,
    v: 5,
    x: 10,
    l: 50
  };

  let total = 0;
  let prevValue = 0;
  for (const char of roman.split('').reverse()) {
    const value = romanValues[char];
    if (value < prevValue) {
      total -= value;
    } else {
      total += value;
    }
    prevValue = value;
  }

  return total;
};
