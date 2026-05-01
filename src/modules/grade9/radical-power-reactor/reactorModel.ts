import { Point, PowerPlaced, PowerPositions, RootPlaced, RootPositions } from './types';

export const initialPowerPositions: PowerPositions = {
  cube: { x: 160, y: 326 },
  square: { x: 560, y: 326 },
};

export const initialRootPositions: RootPositions = {
  square: { x: 202, y: 276 },
  remainder: { x: 312, y: 276 },
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
