export const MODULE_ID = 'polynomial-vault';

export const ATOM_IDS = [
  'MAT.12.1.2.1',
  'MAT.12.1.2.2',
  'MAT.12.1.2.3',
  'MAT.12.1.2.4',
  'MAT.12.1.2.5',
] as const;

export const TEST_ID_CONTRACT = [
  'polynomial-vault-scene',
  'polynomial-vault-manipulator',
  'polynomial-vault-linear',
  'polynomial-vault-quadratic',
  'polynomial-vault-degree',
  'polynomial-vault-leading',
  'polynomial-vault-constant',
  'polynomial-vault-check',
  'polynomial-vault-feedback',
  'polynomial-vault-reset',
] as const;

export type VaultLens = 'linear' | 'quadratic' | 'degree' | 'leading' | 'constant';
export type PowerSlot = 0 | 1 | 2 | 3;

export interface TermBlock {
  power: PowerSlot;
  coefficient: number;
  label: string;
}

export interface PolynomialMission {
  id: string;
  atomId: (typeof ATOM_IDS)[number];
  title: string;
  prompt: string;
  expression: string;
  terms: TermBlock[];
  lensOptions: VaultLens[];
  expectedLens: VaultLens;
  targetValue: string;
  resultBadge: string;
  success: string;
  proof: string;
  failure: Record<VaultLens, string>;
}

export const slotLabels: Record<PowerSlot, string> = {
  3: 'x³',
  2: 'x²',
  1: 'x',
  0: 'x⁰',
};

export const lensCopy: Record<VaultLens, { label: string; short: string; hint: string; accent: string }> = {
  linear: {
    label: 'Doğrusal',
    short: '1°',
    hint: 'Doğrusal mercek açık: en yüksek dolu raf x ise bu 1. derece polinomdur.',
    accent: '#00E5FF',
  },
  quadratic: {
    label: 'Karesel',
    short: '2°',
    hint: 'Karesel mercek açık: x² rafı başroldeyse parabol polinom doğası görünür.',
    accent: '#B388FF',
  },
  degree: {
    label: 'Derece',
    short: 'n°',
    hint: 'Derece merceği açık: en yüksek dolu derece rafını tara.',
    accent: '#00FF88',
  },
  leading: {
    label: 'Başkatsayı',
    short: 'aₙ',
    hint: 'Başkatsayı merceği açık: en yüksek dereceli terimin katsayısını oku.',
    accent: '#FBBF24',
  },
  constant: {
    label: 'Sabit',
    short: 'x⁰',
    hint: 'Sabit mercek açık: değişkensiz x⁰ rafını tara.',
    accent: '#FF8ABB',
  },
};

export const polynomialMissions: PolynomialMission[] = [
  {
    id: 'linear-nature',
    atomId: 'MAT.12.1.2.1',
    title: 'Doğrusal kimliği aç',
    prompt: 'P(x) = 5x + 2 kasasında en yüksek dolu raf x. Bunun 1. derece polinom olduğunu kilitle.',
    expression: 'P(x) = 5x + 2',
    terms: [
      { power: 1, coefficient: 5, label: '5x' },
      { power: 0, coefficient: 2, label: '+2' },
    ],
    lensOptions: ['linear', 'quadratic', 'degree'],
    expectedLens: 'linear',
    targetValue: '1. derece',
    resultBadge: '1°',
    success: 'Doğru: en yüksek dolu raf x olduğu için 5x + 2 doğrusal bir polinomdur.',
    proof: 'x rafı dolu, x² ve x³ rafları boş: derece 1.',
    failure: {
      linear: 'Doğrusal mercek doğru; şimdi kasayı kilitle.',
      quadratic: 'x² rafı boş; bu kasa karesel değil.',
      degree: 'Dereceyi okuyorsun ama bu görev doğrusal polinom kimliğini kilitlemeni istiyor.',
      leading: 'Başkatsayı 5 olsa da bu görev polinomun 1. derece kimliğini soruyor.',
      constant: 'Sabit terim +2 doğru bir parça, ama kimlik kilidi x rafındadır.',
    },
  },
  {
    id: 'quadratic-nature',
    atomId: 'MAT.12.1.2.2',
    title: 'Karesel kasayı doğrula',
    prompt: 'P(x) = 2x² - 3x + 1 ifadesinde x² rafı başrolde. Karesel polinom doğasını kilitle.',
    expression: 'P(x) = 2x² - 3x + 1',
    terms: [
      { power: 2, coefficient: 2, label: '2x²' },
      { power: 1, coefficient: -3, label: '-3x' },
      { power: 0, coefficient: 1, label: '+1' },
    ],
    lensOptions: ['quadratic', 'linear', 'degree'],
    expectedLens: 'quadratic',
    targetValue: '2. derece',
    resultBadge: '2°',
    success: 'Doğru: x² rafı en yüksek dolu raf. Bu parabol 2. derece polinomdur.',
    proof: 'x² rafı dolu ve x³ boş: derece 2.',
    failure: {
      linear: 'x² rafı dolu olduğu için bu yalnız doğrusal değildir.',
      quadratic: 'Karesel mercek doğru; şimdi kasayı kilitle.',
      degree: 'Derece okuması yaklaştı, ama bu görev karesel polinom kimliğini istiyor.',
      leading: 'Başkatsayı 2 doğru bir parça, ama kimlik kilidi x² rafındadır.',
      constant: 'Sabit +1 kasada duruyor; yine de parabol kimliğini o belirlemez.',
    },
  },
  {
    id: 'degree-scan',
    atomId: 'MAT.12.1.2.3',
    title: 'En yüksek rafı bul',
    prompt: 'P(x) = -4x³ + 3x - 2 kasasında en yüksek dolu rafı tara ve dereceyi kilitle.',
    expression: 'P(x) = -4x³ + 3x - 2',
    terms: [
      { power: 3, coefficient: -4, label: '-4x³' },
      { power: 1, coefficient: 3, label: '+3x' },
      { power: 0, coefficient: -2, label: '-2' },
    ],
    lensOptions: ['degree', 'leading', 'constant'],
    expectedLens: 'degree',
    targetValue: '3. derece',
    resultBadge: '3°',
    success: 'Doğru: x³ rafı dolu olan en yüksek raf. Polinomun derecesi 3.',
    proof: 'x³ terimi var; x² boş olsa da en yüksek dolu raf 3.',
    failure: {
      linear: 'Bu kasa yalnız x rafında bitmiyor; x³ rafı daha yukarıda.',
      quadratic: 'x² rafı boş ve x³ dolu; bu 2. derece değil.',
      degree: 'Derece merceği doğru; şimdi en yüksek rafı kilitle.',
      leading: 'Başkatsayı bir sonraki görev; önce derecenin 3 olduğunu bul.',
      constant: 'Sabit terim -2, fakat dereceyi en yüksek dolu raf belirler.',
    },
  },
  {
    id: 'leading-coefficient',
    atomId: 'MAT.12.1.2.4',
    title: 'Başkatsayı mühürle',
    prompt: 'Aynı kasada x³ rafındaki katsayıyı oku. En yüksek dereceli terimin katsayısı başkatsayıdır.',
    expression: 'P(x) = -4x³ + 3x - 2',
    terms: [
      { power: 3, coefficient: -4, label: '-4x³' },
      { power: 1, coefficient: 3, label: '+3x' },
      { power: 0, coefficient: -2, label: '-2' },
    ],
    lensOptions: ['leading', 'degree', 'constant'],
    expectedLens: 'leading',
    targetValue: '-4',
    resultBadge: '-4',
    success: 'Doğru: en yüksek dereceli terim -4x³, bu yüzden başkatsayı -4.',
    proof: 'Baş terim -4x³ ve katsayısı -4.',
    failure: {
      linear: 'x rafındaki +3 başkatsayı değildir; x³ rafı daha yüksekte.',
      quadratic: 'x² rafı boş; başkatsayıyı boş raftan okuyamazsın.',
      degree: 'Derece 3 doğru bağlam, ama bu görev katsayı değerini istiyor.',
      leading: 'Başkatsayı merceği doğru; şimdi -4 değerini kilitle.',
      constant: 'Sabit -2 değişkensiz terimdir; başkatsayı değildir.',
    },
  },
  {
    id: 'constant-term',
    atomId: 'MAT.12.1.2.5',
    title: 'Sabit terimi çıkar',
    prompt: 'P(x) = 7x² - 5 kasasında değişkensiz x⁰ rafını tara ve sabit terimi kilitle.',
    expression: 'P(x) = 7x² - 5',
    terms: [
      { power: 2, coefficient: 7, label: '7x²' },
      { power: 0, coefficient: -5, label: '-5' },
    ],
    lensOptions: ['constant', 'leading', 'degree'],
    expectedLens: 'constant',
    targetValue: '-5',
    resultBadge: '-5',
    success: 'Doğru: değişkensiz x⁰ rafındaki değer sabit terimdir. Sabit terim -5.',
    proof: 'x⁰ rafı -5 değerini taşır.',
    failure: {
      linear: 'x rafı boş; bu kasada doğrusal kimlik aranmıyor.',
      quadratic: 'Karesel yapı var, ama görev x⁰ rafındaki sabit değeri istiyor.',
      degree: 'Derece 2 olsa da bu kilit sabit terim kilididir.',
      leading: 'Başkatsayı 7; fakat sabit terim değişkensiz raftadır.',
      constant: 'Sabit mercek doğru; şimdi x⁰ rafını kilitle.',
    },
  },
];

export const slotOrder: PowerSlot[] = [3, 2, 1, 0];

export function getTermForPower(mission: PolynomialMission, power: PowerSlot) {
  return mission.terms.find((term) => term.power === power);
}

export function getHighlightedPowers(mission: PolynomialMission, lens: VaultLens | null): PowerSlot[] {
  if (lens === null) return [];

  if (lens === 'linear') return [1];
  if (lens === 'quadratic') return [2];
  if (lens === 'constant') return [0];

  const topTerm = [...mission.terms].sort((a, b) => b.power - a.power)[0];
  return topTerm ? [topTerm.power] : [];
}
