import { RootChannel, RootHunterMeasure, RootHunterState, RootHunterTarget, RootMarkerId } from './types';

export const rootFrame = {
  width: 720,
  height: 430,
  plotX: 50,
  plotY: 56,
  plotWidth: 620,
  plotHeight: 286,
  axisY: 199,
  maxValue: 2.2,
};

export const initialRootHunterState: RootHunterState = {
  markers: { a: 70, b: 300 },
};

export const rootHunterTargets: RootHunterTarget[] = [
  {
    id: 'sin-roots',
    atomId: 'MAT.11.1.2.1',
    channel: 'sin',
    equation: 'sin(x)=1/2',
    targetValue: 0.5,
    roots: [30, 150],
    forbiddenAngles: [],
    label: 'sin(x)=1/2',
    hint: 'Hedef ışının dalgayı kestiği iki ayrı noktayı bul; biri yükseliş, biri iniş kolunda saklı.',
  },
  {
    id: 'cos-roots',
    atomId: 'MAT.11.1.2.2',
    channel: 'cos',
    equation: 'cos(x)=-1/2',
    targetValue: -0.5,
    roots: [120, 240],
    forbiddenAngles: [],
    label: 'cos(x)=-1/2',
    hint: 'Hedef ışın kosinüs dalgasının alt yarısında iki simetrik kesişim verir.',
  },
  {
    id: 'tan-roots',
    atomId: 'MAT.11.1.2.3',
    channel: 'tan',
    equation: 'tan(x)=1',
    targetValue: 1,
    roots: [45, 225],
    forbiddenAngles: [90, 270],
    label: 'tan(x)=1',
    hint: 'Bir kesişim ilk bölgede, diğeri aynı davranışın 180° ötelenmiş kopyasında; duvarlar kök değildir.',
  },
  {
    id: 'cot-roots',
    atomId: 'MAT.11.1.2.4',
    channel: 'cot',
    equation: 'cot(x)=√3',
    targetValue: Math.sqrt(3),
    roots: [30, 210],
    forbiddenAngles: [0, 180, 360],
    label: 'cot(x)=√3',
    hint: 'Kotanjant kesişimleri aynı eğrinin iki tekrarında görünür; kapı çizgileri tanımsızlık duvarıdır.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const snapAngle = (angle: number) => clamp(Math.round(angle / 5) * 5, 0, 360);

export const toRadians = (angle: number) => (angle * Math.PI) / 180;

export const xFromAngle = (angle: number) => rootFrame.plotX + (angle / 360) * rootFrame.plotWidth;

export const angleFromX = (x: number) => snapAngle(((clamp(x, rootFrame.plotX, rootFrame.plotX + rootFrame.plotWidth) - rootFrame.plotX) / rootFrame.plotWidth) * 360);

export const trigValue = (channel: RootChannel, angle: number) => {
  const radians = toRadians(angle);
  if (channel === 'sin') return Math.sin(radians);
  if (channel === 'cos') return Math.cos(radians);
  if (channel === 'tan') {
    const value = Math.tan(radians);
    return Number.isFinite(value) && Math.abs(value) <= 12 ? value : null;
  }

  const value = 1 / Math.tan(radians);
  return Number.isFinite(value) && Math.abs(value) <= 12 ? value : null;
};

export const yFromValue = (value: number) => {
  const clipped = clamp(value, -rootFrame.maxValue, rootFrame.maxValue);
  return rootFrame.axisY - (clipped / rootFrame.maxValue) * (rootFrame.plotHeight / 2 - 24);
};

export const createRootGraphSegments = (channel: RootChannel) => {
  const segments: string[][] = [];
  let current: string[] = [];

  for (let angle = 0; angle <= 360; angle += 2) {
    const value = trigValue(channel, angle);
    if (value === null || Math.abs(value) > rootFrame.maxValue) {
      if (current.length > 1) segments.push(current);
      current = [];
      continue;
    }

    current.push(`${xFromAngle(angle).toFixed(1)},${yFromValue(value).toFixed(1)}`);
  }

  if (current.length > 1) segments.push(current);
  return segments;
};

export const formatValue = (value: number | null) => {
  if (value === null) return 'tanımsız';
  if (Math.abs(value - Math.sqrt(3)) < 0.02) return '√3';
  if (Math.abs(value + Math.sqrt(3)) < 0.02) return '-√3';
  if (Math.abs(value - 0.5) < 0.02) return '1/2';
  if (Math.abs(value + 0.5) < 0.02) return '-1/2';
  if (Object.is(value, -0)) return '0';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

export const isMarkerNearRoot = (angle: number, roots: [number, number]) => roots.some((root) => Math.abs(angle - root) <= 7);

export const isTargetMatched = (state: RootHunterState, target: RootHunterTarget) => {
  const markerAngles = Object.values(state.markers);
  const [firstRoot, secondRoot] = target.roots;
  const firstAssigned = markerAngles.some((angle) => Math.abs(angle - firstRoot) <= 7);
  const secondAssigned = markerAngles.some((angle) => Math.abs(angle - secondRoot) <= 7);
  return firstAssigned && secondAssigned;
};

export const measureRootHunter = (state: RootHunterState, target: RootHunterTarget): RootHunterMeasure => {
  const markerValues: Record<RootMarkerId, number | null> = {
    a: trigValue(target.channel, state.markers.a),
    b: trigValue(target.channel, state.markers.b),
  };

  return {
    channel: target.channel,
    markerAngles: state.markers,
    markerValues,
    targetValue: target.targetValue,
    lockedCount: Object.values(state.markers).filter((angle) => isMarkerNearRoot(angle, target.roots)).length,
  };
};

export const prepareRootMission = (target: RootHunterTarget): RootHunterState => ({
  markers: {
    a: target.channel === 'cot' ? 70 : 65,
    b: target.channel === 'tan' ? 300 : 310,
  },
});
