const TURKISH_DISTRIBUTIVE_WORDS: Record<number, string> = {
  1: 'birer',
  2: 'ikişer',
  3: 'üçer',
  4: 'dörder',
  5: 'beşer',
  6: 'altışar',
  7: 'yedişer',
  8: 'sekizer',
  9: 'dokuzar',
  10: 'onar',
  100: 'yüzer',
  1000: 'biner',
};

const TURKISH_DATIVE_SUFFIXES: Record<number, string> = {
  0: 'a',
  1: 'e',
  2: 'ye',
  3: 'e',
  4: 'e',
  5: 'e',
  6: 'ya',
  7: 'ye',
  8: 'e',
  9: 'a',
  10: 'a',
  20: 'ye',
  30: 'a',
  40: 'a',
  50: 'ye',
  60: 'a',
  70: 'e',
  80: 'e',
  90: 'a',
  100: 'e',
  1000: 'e',
};

const TURKISH_DISTRIBUTIVE_SUFFIXES: Record<number, string> = {
  0: 'ar',
  1: 'er',
  2: 'şer',
  3: 'er',
  4: 'er',
  5: 'er',
  6: 'şar',
  7: 'şer',
  8: 'er',
  9: 'ar',
  10: 'ar',
  20: 'şer',
  30: 'ar',
  40: 'ar',
  50: 'şer',
  60: 'ar',
  70: 'şer',
  80: 'er',
  90: 'ar',
  100: 'er',
  1000: 'er',
};

export function formatTurkishDistributiveNumber(value: number): string {
  return TURKISH_DISTRIBUTIVE_WORDS[value] ?? `${value} adımlı`;
}

export function formatNumberWithTurkishDative(value: number): string {
  const suffix = TURKISH_DATIVE_SUFFIXES[getFinalSpokenNumberPart(Math.abs(value))] ?? 'e';
  return `${value}'${suffix}`;
}

export function formatNumberWithTurkishDistributiveSuffix(value: number): string {
  const suffix = TURKISH_DISTRIBUTIVE_SUFFIXES[getFinalSpokenNumberPart(Math.abs(value))] ?? 'er';
  return `${value}'${suffix}`;
}

function getFinalSpokenNumberPart(value: number): number {
  if (value === 0) return 0;

  const lastThree = value % 1000;
  if (lastThree === 0) return 1000;

  const lastTwo = lastThree % 100;
  if (lastTwo === 0) return 100;

  const ones = lastTwo % 10;
  return ones === 0 ? lastTwo : ones;
}
