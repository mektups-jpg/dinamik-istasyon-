import type { GridCell } from './netPerimeterTable4Tasks';

export type CodePattern = {
  id: string;
  name: string;
  blocks: readonly string[];
  cells: readonly GridCell[];
};

export const CODE_PATTERNS: readonly CodePattern[] = [
  {
    id: 'l-corner',
    name: 'L şekli deseni',
    blocks: ['Başla', 'Sağa 2 kare', 'Aşağı 2 kare'],
    cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  },
  {
    id: 'stairs',
    name: 'Merdiven deseni',
    blocks: ['Başla', 'Sağa 1', 'Aşağı 1', 'Sağa 1', 'Aşağı 1'],
    cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  },
  {
    id: 't-shape',
    name: 'T şekli deseni',
    blocks: ['Üst çizgi 3 kare', 'Ortadan aşağı in'],
    cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  },
  {
    id: 'u-shape',
    name: 'U şekli deseni',
    blocks: ['Sol sütun 3 kare', 'Alt çizgi 3 kare', 'Sağ sütun 3 kare'],
    cells: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }],
  },
  {
    id: 'plus-shape',
    name: 'Artı şekli deseni',
    blocks: ['Orta kare', 'Dört yana 1 kare uzat'],
    cells: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
  },
  {
    id: 'zigzag',
    name: 'Zigzag deseni',
    blocks: ['Sağa 1', 'Aşağı 1', 'Sağa 1', 'Yukarı 1'],
    cells: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 1 }],
  },
];
