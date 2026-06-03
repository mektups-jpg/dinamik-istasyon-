export const MODULE_ID = 'inequality-orbit';

export const ATOM_IDS = [
  'MAT.12.1.3.1',
  'MAT.12.1.3.2',
  'MAT.12.1.3.3',
  'MAT.12.1.3.4',
] as const;

export const TEST_ID_CONTRACT = [
  'inequality-orbit-scene',
  'inequality-orbit-manipulator',
  'inequality-orbit-roots',
  'inequality-orbit-forbidden',
  'inequality-orbit-positive',
  'inequality-orbit-negative',
  'inequality-orbit-solution',
  'inequality-orbit-check',
  'inequality-orbit-feedback',
  'inequality-orbit-reset',
] as const;

const mathMinus = '−';

export function formatOrbitMathText(value: string) {
  return value
    .replace(/(^|[\s([=,])-(?=\d|∞)/g, `$1${mathMinus}`)
    .replace(/(^|\s)-(?=\s|$)/g, `$1${mathMinus}`);
}

export type OrbitScanner = 'roots' | 'forbidden' | 'positive' | 'negative' | 'solution';
export type PointKind = 'root' | 'forbidden';
export type SignKind = 'positive' | 'negative';

export interface OrbitPoint {
  value: string;
  label: string;
  position: number;
  kind: PointKind;
  included: boolean;
}

export interface OrbitInterval {
  id: string;
  range: string;
  sign: SignKind;
  solution: boolean;
  from: number;
  to: number;
}

export interface OrbitMission {
  id: string;
  atomId: (typeof ATOM_IDS)[number];
  title: string;
  prompt: string;
  expression: string;
  relation: string;
  points: OrbitPoint[];
  intervals: OrbitInterval[];
  expectedScanner: OrbitScanner;
  targetValue: string;
  resultBadge: string;
  success: string;
  proof: string;
  failure: Record<OrbitScanner, string>;
}

export const scannerCopy: Record<OrbitScanner, { label: string; short: string; hint: string; accent: string }> = {
  roots: {
    label: 'Kökler',
    short: '0',
    hint: 'Kök tarayıcı açık: ifadeyi sıfır yapan istasyonları ara.',
    accent: '#00E5FF',
  },
  forbidden: {
    label: 'Yasak',
    short: '!',
    hint: 'Yasak tarayıcı açık: paydayı sıfır yapan istasyon geçilemez.',
    accent: '#FF8ABB',
  },
  positive: {
    label: 'Pozitif Bölge',
    short: '+',
    hint: 'Pozitif bölge tarayıcı açık: çarpım veya bölüm işareti artı olan ışık yollarını ara.',
    accent: '#00FF88',
  },
  negative: {
    label: 'Negatif Bölge',
    short: '-',
    hint: 'Negatif bölge tarayıcı açık: işaretin eksiye düştüğü aralıkları ara.',
    accent: '#FBBF24',
  },
  solution: {
    label: 'Çözüm',
    short: 'S',
    hint: 'Çözüm tarayıcı açık: eşitsizliğin istediği işaret ve açık/kapalı uçlar birlikte okunur.',
    accent: '#B388FF',
  },
};

export const orbitMissions: OrbitMission[] = [
  {
    id: 'polynomial-roots',
    atomId: 'MAT.12.1.3.1',
    title: 'Polinom kök kapıları',
    prompt: 'P(x) = (x + 1)(x - 3) denklemini sıfır yapan iki kök istasyonunu kilitle.',
    expression: 'P(x) = (x + 1)(x - 3)',
    relation: 'P(x) = 0',
    points: [
      { value: '-1', label: 'kök', position: 34, kind: 'root', included: true },
      { value: '3', label: 'kök', position: 68, kind: 'root', included: true },
    ],
    intervals: [
      { id: 'left-positive', range: '(-∞, -1)', sign: 'positive', solution: false, from: 10, to: 34 },
      { id: 'mid-negative', range: '(-1, 3)', sign: 'negative', solution: false, from: 34, to: 68 },
      { id: 'right-positive', range: '(3, ∞)', sign: 'positive', solution: false, from: 68, to: 92 },
    ],
    expectedScanner: 'roots',
    targetValue: 'x = -1 ve x = 3',
    resultBadge: '2 kök',
    success: 'Doğru: iki çarpan sıfır olduğunda x = -1 ve x = 3 kökleri açılır.',
    proof: '(x + 1) = 0 -> -1, (x - 3) = 0 -> 3.',
    failure: {
      roots: 'Kök tarayıcı doğru; şimdi iki sıfır istasyonunu kilitle.',
      forbidden: 'Bu polinomda payda yok; yasak nokta aranmaz.',
      positive: 'İşaret bölgeleri sonraki aşama; önce denklemin köklerini bul.',
      negative: 'Eksi bölge denklem kökü değildir; kök, ifadeyi sıfıra indirir.',
      solution: 'Çözüm aralığı değil, denklem kök istasyonları soruluyor.',
    },
  },
  {
    id: 'rational-forbidden',
    atomId: 'MAT.12.1.3.2',
    title: 'Rasyonel yasak kapı',
    prompt: 'R(x) için pay x - 2, payda x + 1. Kök ve yasak istasyonu ayır; önce yasak kapıyı kilitle.',
    expression: 'R(x) = (x - 2) / (x + 1)',
    relation: 'R(x) = 0',
    points: [
      { value: '-1', label: 'yasak', position: 34, kind: 'forbidden', included: false },
      { value: '2', label: 'kök', position: 64, kind: 'root', included: true },
    ],
    intervals: [
      { id: 'left-positive', range: '(-∞, -1)', sign: 'positive', solution: false, from: 10, to: 34 },
      { id: 'mid-negative', range: '(-1, 2)', sign: 'negative', solution: false, from: 34, to: 64 },
      { id: 'right-positive', range: '(2, ∞)', sign: 'positive', solution: false, from: 64, to: 92 },
    ],
    expectedScanner: 'forbidden',
    targetValue: 'x = -1 yasak',
    resultBadge: 'yasak',
    success: 'Doğru: x = -1 paydayı sıfır yapar; denklem çözümüne alınamaz.',
    proof: 'x + 1 = 0 olduğunda payda kapanır, istasyon kırmızı kilit olur.',
    failure: {
      roots: 'x = 2 kök olsa da bu görev önce payda yasağını ayırmanı istiyor.',
      forbidden: 'Yasak tarayıcı doğru; paydayı sıfırlayan istasyonu kilitle.',
      positive: 'Pozitif bölgeler eşitsizlik aşamasında okunur.',
      negative: 'Negatif bölge yasak kapı değildir; yasak payda sıfırından gelir.',
      solution: 'Çözüm kümesi kurulmadan önce yasak istasyon ayrılmalı.',
    },
  },
  {
    id: 'polynomial-sign-table',
    atomId: 'MAT.12.1.3.3',
    title: 'Polinom işaret yörüngesi',
    prompt: '(x + 2)(x - 1) > 0 için pozitif ışık bölgelerini seç; köklerde işaret değişir.',
    expression: '(x + 2)(x - 1)',
    relation: '> 0',
    points: [
      { value: '-2', label: 'kök', position: 30, kind: 'root', included: false },
      { value: '1', label: 'kök', position: 62, kind: 'root', included: false },
    ],
    intervals: [
      { id: 'left-positive', range: '(-∞, -2)', sign: 'positive', solution: true, from: 10, to: 30 },
      { id: 'mid-negative', range: '(-2, 1)', sign: 'negative', solution: false, from: 30, to: 62 },
      { id: 'right-positive', range: '(1, ∞)', sign: 'positive', solution: true, from: 62, to: 92 },
    ],
    expectedScanner: 'positive',
    targetValue: 'iki pozitif bölge',
    resultBadge: '+ +',
    success: 'Doğru: > 0 istendiği için iki dış pozitif bölge çözüm olur.',
    proof: 'Kökler -2 ve 1; işaret dış bölgelerde artı, ortada eksi.',
    failure: {
      roots: 'Kökleri buldun ama görev çözüm için pozitif bölgeleri boyamak.',
      forbidden: 'Bu polinom eşitsizliğinde payda yok; yasak istasyon yok.',
      positive: 'Pozitif bölge tarayıcı doğru; dış aralıkları kilitle.',
      negative: 'Ortadaki negatif bölge > 0 şartını sağlamaz.',
      solution: 'Çözüm tarayıcı yakın; ama bu görev önce pozitif bölgeleri okutuyor.',
    },
  },
  {
    id: 'rational-sign-table',
    atomId: 'MAT.12.1.3.4',
    title: 'Rasyonel çözüm koridoru',
    prompt: 'Pay x - 3, payda x + 1 olan rasyonel ifadede ≤ 0 için yasak kapıyı açık bırak, kökü kapalı al ve çözüm koridorunu kilitle.',
    expression: '(x - 3) / (x + 1)',
    relation: '≤ 0',
    points: [
      { value: '-1', label: 'yasak', position: 34, kind: 'forbidden', included: false },
      { value: '3', label: 'kök', position: 70, kind: 'root', included: true },
    ],
    intervals: [
      { id: 'left-positive', range: '(-∞, -1)', sign: 'positive', solution: false, from: 10, to: 34 },
      { id: 'mid-negative', range: '(-1, 3]', sign: 'negative', solution: true, from: 34, to: 70 },
      { id: 'right-positive', range: '(3, ∞)', sign: 'positive', solution: false, from: 70, to: 92 },
    ],
    expectedScanner: 'solution',
    targetValue: '(-1, 3]',
    resultBadge: '(-1,3]',
    success: 'Doğru: payda yasağı -1 açık kalır, kök 3 eşitlikten dolayı kapalı alınır.',
    proof: '≤ 0 için negatif orta koridor ve sıfır yapan x = 3 birlikte çözüm olur.',
    failure: {
      roots: 'Kök 3 önemli ama payda yasağı ve negatif koridorla birlikte okunmalı.',
      forbidden: 'Yasak -1 doğru bilgi; fakat çözüm koridorunu tek başına vermez.',
      positive: 'Pozitif bölgeler ≤ 0 şartını sağlamaz.',
      negative: 'Negatif bölge doğru yön; x = 3 kapalı ucunu da çözüm olarak kilitle.',
      solution: 'Çözüm tarayıcı doğru; açık yasak ve kapalı kökü birlikte kilitle.',
    },
  },
];

export function getActivePoints(mission: OrbitMission, scanner: OrbitScanner | null) {
  if (scanner === 'roots') return mission.points.filter((point) => point.kind === 'root');
  if (scanner === 'forbidden') return mission.points.filter((point) => point.kind === 'forbidden');
  if (scanner === 'solution') return mission.points.filter((point) => point.kind === 'root' && point.included);
  return [];
}

export function getActiveIntervals(mission: OrbitMission, scanner: OrbitScanner | null) {
  if (scanner === 'positive') return mission.intervals.filter((interval) => interval.sign === 'positive');
  if (scanner === 'negative') return mission.intervals.filter((interval) => interval.sign === 'negative');
  if (scanner === 'solution') return mission.intervals.filter((interval) => interval.solution);
  return [];
}
