import { GateMode, GateSide, IntervalBuild, IntervalMission, Point } from './types';

export const TRACK_MIN = -6;
export const TRACK_MAX = 6;
export const TRACK_LEFT = 92;
export const TRACK_RIGHT = 628;
export const TRACK_Y = 292;

export const intervalMissions: IntervalMission[] = [
  {
    id: 'closed-doors',
    title: 'Kapalı Aralık Kapısı',
    atomId: 'MAT.9.1.3.1',
    prompt: 'Uçları dahil olan kapıları kur: -2 ve 3 istasyonları aralığın içinde kalsın.',
    kind: 'single',
    target: createBuild(-2, 'closed', 3, 'closed'),
    shortRule: 'Kapalı uç: sınır sayı aralığa dahildir.',
    mechanic: 'Kapıları -2 ve 3 üzerine taşı; iki kapıyı da dolu bırak.',
  },
  {
    id: 'open-doors',
    title: 'Açık Aralık Kapısı',
    atomId: 'MAT.9.1.3.2',
    prompt: 'Uçları hariç olan kapıları kur: -1 ve 4 sınırda dursun ama aralığın içine alınmasın.',
    kind: 'single',
    target: createBuild(-1, 'open', 4, 'open'),
    shortRule: 'Açık uç: sınır sayı aralığa dahil değildir.',
    mechanic: 'Kapıları -1 ve 4 üzerine taşı; iki kapıyı halka kapıya çevir.',
  },
  {
    id: 'intersection-lens',
    title: 'Kesişim Geçidi',
    atomId: 'MAT.9.1.3.3',
    prompt: 'İki aralığın ortak ışıkta kalan bölümünü kur.',
    kind: 'intersection',
    target: createBuild(0, 'closed', 2, 'closed'),
    shortRule: 'Kesişim: yalnız ortak bölge kalır.',
    mechanic: 'İki ışın da aynı anda yanıyorsa o bölüm sonuç bandıdır.',
    given: [
      { id: 'a', label: 'A = [-4, 2]', build: createBuild(-4, 'closed', 2, 'closed'), tone: 'cyan' },
      { id: 'b', label: 'B = [0, 5)', build: createBuild(0, 'closed', 5, 'open'), tone: 'purple' },
    ],
  },
  {
    id: 'union-bridge',
    title: 'Birleşim Köprüsü',
    atomId: 'MAT.9.1.3.4',
    prompt: 'İki aralığın birlikte aydınlattığı tek uzun köprüyü kur.',
    kind: 'union',
    target: createBuild(-3, 'open', 5, 'open'),
    shortRule: 'Birleşim: iki aralıktan en az birinin kapsadığı her nokta alınır.',
    mechanic: 'Işıklar 1 noktasında temas ettiği için arada boşluk bırakma.',
    given: [
      { id: 'a', label: 'A = (-3, 1]', build: createBuild(-3, 'open', 1, 'closed'), tone: 'cyan' },
      { id: 'b', label: 'B = [1, 5)', build: createBuild(1, 'closed', 5, 'open'), tone: 'purple' },
    ],
  },
];

export const initialBuild = createBuild(-1, 'closed', 1, 'closed');

export function createBuild(left: number, leftMode: GateMode, right: number, rightMode: GateMode): IntervalBuild {
  return {
    left: { value: left, mode: leftMode },
    right: { value: right, mode: rightMode },
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function valueToX(value: number): number {
  const ratio = (value - TRACK_MIN) / (TRACK_MAX - TRACK_MIN);
  return TRACK_LEFT + ratio * (TRACK_RIGHT - TRACK_LEFT);
}

export function xToValue(x: number): number {
  const ratio = (clamp(x, TRACK_LEFT, TRACK_RIGHT) - TRACK_LEFT) / (TRACK_RIGHT - TRACK_LEFT);
  return Math.round(TRACK_MIN + ratio * (TRACK_MAX - TRACK_MIN));
}

export function updateEndpoint(build: IntervalBuild, side: GateSide, nextValue: number): IntervalBuild {
  if (side === 'left') {
    const value = clamp(nextValue, TRACK_MIN, build.right.value - 1);
    return { ...build, left: { ...build.left, value } };
  }

  const value = clamp(nextValue, build.left.value + 1, TRACK_MAX);
  return { ...build, right: { ...build.right, value } };
}

export function toggleGate(build: IntervalBuild, side: GateSide): IntervalBuild {
  const current = build[side];
  const mode: GateMode = current.mode === 'closed' ? 'open' : 'closed';
  return { ...build, [side]: { ...current, mode } };
}

export function buildMatches(actual: IntervalBuild, target: IntervalBuild): boolean {
  return actual.left.value === target.left.value
    && actual.right.value === target.right.value
    && actual.left.mode === target.left.mode
    && actual.right.mode === target.right.mode;
}

export function intervalLabel(build: IntervalBuild): string {
  const leftBracket = build.left.mode === 'closed' ? '[' : '(';
  const rightBracket = build.right.mode === 'closed' ? ']' : ')';
  return `${leftBracket}${formatNumber(build.left.value)}, ${formatNumber(build.right.value)}${rightBracket}`;
}

export function formatNumber(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : String(value);
}

export function getGatePoint(build: IntervalBuild, side: GateSide): Point {
  return {
    x: valueToX(build[side].value),
    y: TRACK_Y,
  };
}
