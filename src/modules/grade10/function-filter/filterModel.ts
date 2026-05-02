import { FunctionTarget, GraphPoint, MappingPair, MappingState, RelationPoint, RelationScenario } from './types';

export const graphConfig = {
  originX: 360,
  originY: 270,
  scale: 56,
  minX: -4.6,
  maxX: 4.6,
  minY: -3.6,
  maxY: 3.6,
};

export const initialScannerX = -3.4;

export const relationScenarios: Record<'notFunction' | 'function', RelationScenario> = {
  notFunction: {
    id: 'not-function-relation',
    title: 'İki Çıkışlı İlişki',
    verdict: 'not-function',
    targetX: -2,
    points: [
      { id: 'nf-a', x: -2, y: 2, label: '(-2, 2)' },
      { id: 'nf-b', x: -2, y: -1.4, label: '(-2, -1.4)' },
      { id: 'nf-c', x: 0.5, y: 1.2, label: '(0.5, 1.2)' },
      { id: 'nf-d', x: 2.4, y: -0.8, label: '(2.4, -0.8)' },
    ],
  },
  function: {
    id: 'function-relation',
    title: 'Tek Çıkışlı İlişki',
    verdict: 'function',
    targetX: 1,
    points: [
      { id: 'f-a', x: -3, y: -1.8, label: '(-3, -1.8)' },
      { id: 'f-b', x: -1, y: 1.1, label: '(-1, 1.1)' },
      { id: 'f-c', x: 1, y: 2.4, label: '(1, 2.4)' },
      { id: 'f-d', x: 3, y: -0.7, label: '(3, -0.7)' },
    ],
  },
};

export const mappingPairs: MappingPair[] = [
  { input: -2, output: -3 },
  { input: -1, output: -1 },
  { input: 0, output: 1 },
  { input: 1, output: 3 },
];

export const outputPorts = [-3, -1, 1, 3];

export const initialMappingState = (): MappingState => Object.fromEntries(mappingPairs.map((pair) => [pair.input, null]));

export const functionTargets: FunctionTarget[] = [
  {
    label: 'Dikey alarm',
    atomId: 'MAT.10.2.1.1',
    kind: 'reject-relation',
    targetX: relationScenarios.notFunction.targetX,
    hint: 'Lazeri x=-2 çizgisine getir. Aynı x iki farklı y üretirse ilişki fonksiyon değildir.',
  },
  {
    label: 'Tek çıkış filtresi',
    atomId: 'MAT.10.2.1.1',
    kind: 'accept-function',
    targetX: relationScenarios.function.targetX,
    hint: 'Lazeri x=1 çizgisine getir. Bu ilişki her x için tek y üretir.',
  },
  {
    label: 'f(x)=2x+1',
    atomId: 'MAT.10.2.1.2',
    kind: 'map-domain',
    hint: 'Her giriş portunu f(x)=2x+1 kuralıyla doğru çıkış portuna bağla.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const formatValue = (value: number) => {
  const rounded = roundToTenth(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export const graphToSvg = (point: GraphPoint): GraphPoint => ({
  x: graphConfig.originX + point.x * graphConfig.scale,
  y: graphConfig.originY - point.y * graphConfig.scale,
});

export const svgToGraph = (point: GraphPoint): GraphPoint => ({
  x: roundToTenth(clamp((point.x - graphConfig.originX) / graphConfig.scale, graphConfig.minX, graphConfig.maxX)),
  y: roundToTenth(clamp((graphConfig.originY - point.y) / graphConfig.scale, graphConfig.minY, graphConfig.maxY)),
});

export const getHitPoints = (points: RelationPoint[], scannerX: number) => points.filter((point) => Math.abs(point.x - scannerX) <= 0.18);

export const isScannerMatched = (scannerX: number, targetX: number) => Math.abs(scannerX - targetX) <= 0.18;

export const isMappingComplete = (mapping: MappingState) => mappingPairs.every((pair) => mapping[pair.input] === pair.output);

export const portTestId = (prefix: string, value: number) => `${prefix}-${value < 0 ? `neg${Math.abs(value)}` : value}`;
