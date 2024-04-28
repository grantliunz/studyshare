import { Question } from '../pages/assessment/Assessment';

export function findNextQuestionNumber(
  parentHierarchy: string[],
  questions: Question[]
): string {
  let subquestions: any = questions;
  let depth = 0;
  for (let i = 0; i < parentHierarchy.length; i++) {
    subquestions = subquestions.find(
      (question: Question) => question.number === parentHierarchy[i]
    )?.subquestions;
    depth += 1;
  }
  const lastSubquestion = subquestions[subquestions.length - 1].number;

  return depth == 2
    ? incrementRomanNumeral(lastSubquestion)
    : String.fromCharCode(lastSubquestion.charCodeAt(0) + 1);
}

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

function convertRomanToNumber(roman: string): number {
  const romanValues: Record<string, number> = {
    i: 1,
    v: 5,
    x: 10,
    l: 50
  };

  let total = 0;
  let prevValue = 0;

  console.log('roman: ' + roman);
  for (const char of roman.split('').reverse()) {
    const value = romanValues[char];
    console.log('value: ' + value);
    if (value < prevValue) {
      total -= value;
    } else {
      total += value;
    }
    prevValue = value;
  }

  return total;
}
