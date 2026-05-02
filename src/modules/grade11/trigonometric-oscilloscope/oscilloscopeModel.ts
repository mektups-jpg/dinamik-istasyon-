import { OscilloscopeMeasure, OscilloscopeState, OscilloscopeTarget, WaveChannel } from './types';

export const oscFrame = {
  width: 860,
  height: 520,
  circleX: 230,
  circleY: 260,
  radius: 122,
  waveX: 410,
  waveY: 260,
  waveWidth: 390,
  waveAmp: 116,
};

export const initialOscilloscope: OscilloscopeState = {
  angle: 35,
};

export const oscilloscopeTargets: OscilloscopeTarget[] = [
  {
    id: 'sin-peak',
    atomId: 'MAT.11.1.1.1',
    channel: 'sin',
    targetAngle: 90,
    label: 'sin 90° = 1',
    hint: 'Faz kolunu tepe noktasına getir; sinüs dikey izdüşümdür.',
  },
  {
    id: 'sin-period',
    atomId: 'MAT.11.1.1.1',
    channel: 'sin',
    targetAngle: 360,
    label: 'sin 360° = 0',
    hint: 'Tam tur sonunda sinüs dalgası başladığı yüksekliğe döner.',
  },
  {
    id: 'cos-valley',
    atomId: 'MAT.11.1.1.2',
    channel: 'cos',
    targetAngle: 180,
    label: 'cos 180° = -1',
    hint: 'Kosinüs yatay izdüşümdür; sol uçta değer -1 olur.',
  },
  {
    id: 'cos-period',
    atomId: 'MAT.11.1.1.2',
    channel: 'cos',
    targetAngle: 360,
    label: 'cos 360° = 1',
    hint: 'Tam tur sonunda kosinüs tekrar sağ uca ve 1 değerine döner.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const round = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const snapAngle = (angle: number) => clamp(Math.round(angle / 5) * 5, 0, 360);

export const toRadians = (angle: number) => (angle * Math.PI) / 180;

export const phasePoint = (angle: number) => {
  const radians = toRadians(angle);
  return {
    x: oscFrame.circleX + Math.cos(radians) * oscFrame.radius,
    y: oscFrame.circleY - Math.sin(radians) * oscFrame.radius,
  };
};

export const measureOscilloscope = (state: OscilloscopeState): OscilloscopeMeasure => {
  const radians = toRadians(state.angle);
  return {
    angle: state.angle,
    sin: round(Math.sin(radians), 2),
    cos: round(Math.cos(radians), 2),
  };
};

export const angleFromSvgPoint = (x: number, y: number) => {
  const radians = Math.atan2(oscFrame.circleY - y, x - oscFrame.circleX);
  const degrees = (radians * 180) / Math.PI;
  return snapAngle(degrees < 0 ? degrees + 360 : degrees);
};

export const isTargetMatched = (state: OscilloscopeState, target: OscilloscopeTarget) => (
  Math.abs(state.angle - target.targetAngle) <= 5
);

export const formatValue = (value: number) => {
  if (Object.is(value, -0)) return '0';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

export const channelValue = (measure: OscilloscopeMeasure, channel: WaveChannel) => (
  channel === 'sin' ? measure.sin : measure.cos
);

export const createWavePath = (channel: WaveChannel, angleLimit = 360) => {
  const points: string[] = [];
  for (let angle = 0; angle <= angleLimit; angle += 4) {
    const radians = toRadians(angle);
    const value = channel === 'sin' ? Math.sin(radians) : Math.cos(radians);
    const x = oscFrame.waveX + (angle / 360) * oscFrame.waveWidth;
    const y = oscFrame.waveY - value * oscFrame.waveAmp;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
};
