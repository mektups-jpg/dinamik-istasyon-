import { AsymptoteChannel, AsymptoteMeasure, AsymptoteState, AsymptoteTarget, GateId } from './types';

export const asymptoteFrame = {
  width: 860,
  height: 520,
  plotX: 72,
  plotY: 70,
  plotWidth: 716,
  plotHeight: 360,
  axisY: 250,
  maxGraphValue: 3,
};

export const initialAsymptoteState: AsymptoteState = {
  gates: {
    tanA: 62,
    tanB: 238,
    cotA: 24,
    cotB: 148,
    cotC: 322,
  },
  scannerAngle: 45,
};

export const asymptoteTargets: AsymptoteTarget[] = [
  {
    id: 'tan-first-wall',
    atomId: 'MAT.11.1.1.3',
    channel: 'tan',
    activeGates: ['tanA'],
    gateTargets: { tanA: 90 },
    label: 'tan duvarı: 90°',
    hint: 'Tanjantta cos(x)=0 olduğunda kapı açılmaz; ilk yasak duvar 90° çizgisidir.',
  },
  {
    id: 'tan-second-wall',
    atomId: 'MAT.11.1.1.3',
    channel: 'tan',
    activeGates: ['tanB'],
    gateTargets: { tanA: 90, tanB: 270 },
    label: 'tan duvarı: 270°',
    hint: 'Tanjant aynı patlamayı 270° çizgisinde tekrar eder.',
  },
  {
    id: 'cot-wall-family',
    atomId: 'MAT.11.1.1.4',
    channel: 'cot',
    activeGates: ['cotA', 'cotB', 'cotC'],
    gateTargets: { cotA: 0, cotB: 180, cotC: 360 },
    label: 'cot kapıları: 0° / 180° / 360°',
    hint: 'Kotanjantta sin(x)=0 olduğu için kapılar 180° aralıklarla dizilir.',
  },
  {
    id: 'cot-approach-scan',
    atomId: 'MAT.11.1.1.4',
    channel: 'cot',
    activeGates: ['cotB'],
    gateTargets: { cotA: 0, cotB: 180, cotC: 360 },
    scannerTarget: 178,
    label: 'cot x -> 180°',
    hint: 'Tarayıcıyı 180° duvarına yaklaştır; değer büyür ama duvarın üstünde nokta oluşmaz.',
  },
];

export const gateLabels: Record<GateId, string> = {
  tanA: 'tan 90°',
  tanB: 'tan 270°',
  cotA: 'cot 0°',
  cotB: 'cot 180°',
  cotC: 'cot 360°',
};

export const visibleGatesByChannel: Record<AsymptoteChannel, GateId[]> = {
  tan: ['tanA', 'tanB'],
  cot: ['cotA', 'cotB', 'cotC'],
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const snapAngle = (angle: number) => clamp(Math.round(angle / 5) * 5, 0, 360);

export const toRadians = (angle: number) => (angle * Math.PI) / 180;

export const xFromAngle = (angle: number) => asymptoteFrame.plotX + (angle / 360) * asymptoteFrame.plotWidth;

export const angleFromX = (x: number) => snapAngle(((clamp(x, asymptoteFrame.plotX, asymptoteFrame.plotX + asymptoteFrame.plotWidth) - asymptoteFrame.plotX) / asymptoteFrame.plotWidth) * 360);

export const graphValue = (channel: AsymptoteChannel, angle: number) => {
  const radians = toRadians(angle);
  const raw = channel === 'tan' ? Math.tan(radians) : 1 / Math.tan(radians);
  if (!Number.isFinite(raw) || Math.abs(raw) > 12) return null;
  return raw;
};

export const yFromValue = (value: number) => {
  const clipped = clamp(value, -asymptoteFrame.maxGraphValue, asymptoteFrame.maxGraphValue);
  return asymptoteFrame.axisY - (clipped / asymptoteFrame.maxGraphValue) * (asymptoteFrame.plotHeight / 2 - 24);
};

export const formatValue = (value: number | null) => {
  if (value === null) return 'tanımsız';
  if (Math.abs(value) > 9) return value > 0 ? '+∞' : '-∞';
  if (Object.is(value, -0)) return '0';
  return value.toFixed(2);
};

export const createGraphSegments = (channel: AsymptoteChannel) => {
  const segments: string[][] = [];
  let current: string[] = [];

  for (let angle = 0; angle <= 360; angle += 2) {
    const value = graphValue(channel, angle);
    if (value === null || Math.abs(value) > asymptoteFrame.maxGraphValue) {
      if (current.length > 1) segments.push(current);
      current = [];
      continue;
    }

    current.push(`${xFromAngle(angle).toFixed(1)},${yFromValue(value).toFixed(1)}`);
  }

  if (current.length > 1) segments.push(current);
  return segments;
};

export const isGateMatched = (state: AsymptoteState, gate: GateId, target: number) => Math.abs(state.gates[gate] - target) <= 6;

export const areGateTargetsMatched = (state: AsymptoteState, target: AsymptoteTarget) => (
  Object.entries(target.gateTargets).every(([gate, angle]) => isGateMatched(state, gate as GateId, angle))
);

export const isTargetMatched = (state: AsymptoteState, target: AsymptoteTarget) => {
  const gatesOk = areGateTargetsMatched(state, target);
  if (!target.scannerTarget) return gatesOk;
  return gatesOk && Math.abs(state.scannerAngle - target.scannerTarget) <= 7;
};

export const measureAsymptote = (state: AsymptoteState, channel: AsymptoteChannel): AsymptoteMeasure => {
  const value = graphValue(channel, state.scannerAngle);
  const intensity = value === null ? 1 : clamp(Math.abs(value) / asymptoteFrame.maxGraphValue, 0, 1);
  return {
    channel,
    scannerAngle: state.scannerAngle,
    scannerValue: value,
    intensity,
  };
};
