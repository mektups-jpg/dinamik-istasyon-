import { Point, PowerChallenge, PowerPlaced, PowerPositions, RootChallenge, RootPlaced, RootPositions } from './types';

const powerChallengePool: PowerChallenge[] = [
  { base: 2, leftExponent: 2, rightExponent: 3, totalExponent: 5, value: 32 },
  { base: 2, leftExponent: 4, rightExponent: 2, totalExponent: 6, value: 64 },
  { base: 3, leftExponent: 1, rightExponent: 2, totalExponent: 3, value: 27 },
  { base: 3, leftExponent: 3, rightExponent: 1, totalExponent: 4, value: 81 },
  { base: 4, leftExponent: 1, rightExponent: 2, totalExponent: 3, value: 64 },
  { base: 5, leftExponent: 2, rightExponent: 1, totalExponent: 3, value: 125 },
  { base: 6, leftExponent: 1, rightExponent: 2, totalExponent: 3, value: 216 },
  { base: 7, leftExponent: 1, rightExponent: 2, totalExponent: 3, value: 343 },
];

const rootChallengePool: RootChallenge[] = [
  { radicand: 72, squareFactor: 36, outsideFactor: 6, remainder: 2 },
  { radicand: 50, squareFactor: 25, outsideFactor: 5, remainder: 2 },
  { radicand: 75, squareFactor: 25, outsideFactor: 5, remainder: 3 },
  { radicand: 98, squareFactor: 49, outsideFactor: 7, remainder: 2 },
  { radicand: 108, squareFactor: 36, outsideFactor: 6, remainder: 3 },
  { radicand: 128, squareFactor: 64, outsideFactor: 8, remainder: 2 },
  { radicand: 147, squareFactor: 49, outsideFactor: 7, remainder: 3 },
  { radicand: 180, squareFactor: 36, outsideFactor: 6, remainder: 5 },
  { radicand: 200, squareFactor: 100, outsideFactor: 10, remainder: 2 },
  { radicand: 45, squareFactor: 9, outsideFactor: 3, remainder: 5 },
  { radicand: 48, squareFactor: 16, outsideFactor: 4, remainder: 3 },
  { radicand: 80, squareFactor: 16, outsideFactor: 4, remainder: 5 },
  { radicand: 125, squareFactor: 25, outsideFactor: 5, remainder: 5 },
];

export function createPowerChallenge(previous?: PowerChallenge): PowerChallenge {
  const candidates = previous
    ? powerChallengePool.filter(
        (challenge) =>
          challenge.base !== previous.base ||
          challenge.leftExponent !== previous.leftExponent ||
          challenge.rightExponent !== previous.rightExponent,
      )
    : powerChallengePool;
  const challenge = candidates[Math.floor(Math.random() * candidates.length)] ?? powerChallengePool[0];
  return { ...challenge };
}

export function createRootChallenge(previous?: RootChallenge): RootChallenge {
  const candidates = previous
    ? rootChallengePool.filter(
        (challenge) =>
          challenge.radicand !== previous.radicand ||
          challenge.squareFactor !== previous.squareFactor ||
          challenge.remainder !== previous.remainder,
      )
    : rootChallengePool;
  const challenge = candidates[Math.floor(Math.random() * candidates.length)] ?? rootChallengePool[0];
  return { ...challenge };
}

export function toSuperscript(value: number) {
  const superscripts: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };

  return String(value)
    .split('')
    .map((digit) => superscripts[digit] ?? digit)
    .join('');
}

export function formatPower(base: number, exponent: number) {
  return `${base}${toSuperscript(exponent)}`;
}

export const initialPowerPositions: PowerPositions = {
  cube: { x: 160, y: 326 },
  square: { x: 560, y: 326 },
};

export const initialRootPositions: RootPositions = {
  square: { x: 212, y: 340 },
  remainder: { x: 336, y: 340 },
};

export const initialPowerPlaced: PowerPlaced = {
  cube: false,
  square: false,
};

export const initialRootPlaced: RootPlaced = {
  square: false,
  remainder: false,
};

export const powerSlots: PowerPositions = {
  cube: { x: 320, y: 258 },
  square: { x: 400, y: 258 },
};

export const rootSlots: RootPositions = {
  square: { x: 520, y: 180 },
  remainder: { x: 520, y: 326 },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function distance(first: Point, second: Point) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export function isNear(first: Point, second: Point, radius = 74) {
  return distance(first, second) <= radius;
}
