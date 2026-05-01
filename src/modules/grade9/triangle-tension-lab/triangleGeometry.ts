import { useMemo } from 'react';
import { Point, SideKey, TokenPositions, TriangleMeasurements, TrianglePoints, VertexKey } from './types';

export const initialPoints: TrianglePoints = {
  A: { x: 350, y: 170 },
  B: { x: 185, y: 385 },
  C: { x: 445, y: 385 },
};

export const initialTokenPositions: TokenPositions = {
  A: { x: 412, y: 146 },
  B: { x: 522, y: 146 },
  C: { x: 632, y: 146 },
};

export const proofRail = { x: 110, y: 304, width: 500, height: 112 };

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const round = (value: number) => Math.round(value);
export const distance = (first: Point, second: Point) => Math.hypot(first.x - second.x, first.y - second.y);

export function useTriangleMeasurements(points: TrianglePoints): TriangleMeasurements {
  return useMemo(() => {
    const sides = {
      a: distance(points.B, points.C),
      b: distance(points.A, points.C),
      c: distance(points.A, points.B),
    };
    const angles = {
      A: angleAt(points.A, points.B, points.C),
      B: angleAt(points.B, points.A, points.C),
      C: angleAt(points.C, points.A, points.B),
    };
    const largestAngle = (Object.keys(angles) as VertexKey[]).reduce((best, key) => angles[key] > angles[best] ? key : best, 'A');
    const longestSide = (Object.keys(sides) as SideKey[]).reduce((best, key) => sides[key] > sides[best] ? key : best, 'a');
    return { sides, angles, largestAngle, longestSide };
  }, [points]);
}

export function isInsideProofRail(point: Point) {
  return point.x >= proofRail.x && point.x <= proofRail.x + proofRail.width && point.y >= proofRail.y && point.y <= proofRail.y + proofRail.height;
}

export function proofSlotPoint(index: number): Point {
  return { x: 250 + index * 110, y: 360 };
}

export function midpoint(first: Point, second: Point): Point {
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

export function unitPoint(origin: Point, target: Point, radius: number): Point {
  const length = distance(origin, target);
  return {
    x: origin.x + ((target.x - origin.x) / length) * radius,
    y: origin.y + ((target.y - origin.y) / length) * radius,
  };
}

export function oppositeSide(angle: VertexKey): SideKey {
  if (angle === 'A') return 'a';
  if (angle === 'B') return 'b';
  return 'c';
}

export function sideName(side: SideKey): string {
  if (side === 'a') return 'BC';
  if (side === 'b') return 'AC';
  return 'AB';
}

function angleAt(origin: Point, first: Point, second: Point) {
  const firstVector = { x: first.x - origin.x, y: first.y - origin.y };
  const secondVector = { x: second.x - origin.x, y: second.y - origin.y };
  const dot = firstVector.x * secondVector.x + firstVector.y * secondVector.y;
  const magnitudes = Math.hypot(firstVector.x, firstVector.y) * Math.hypot(secondVector.x, secondVector.y);
  return (Math.acos(clamp(dot / magnitudes, -1, 1)) * 180) / Math.PI;
}
