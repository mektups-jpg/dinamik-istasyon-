export const MODULE_ID = 'sequence-wheel';

export const ATOM_IDS = ['MAT.12.1.1.1', 'MAT.12.1.1.2', 'MAT.12.1.1.3'] as const;

export const TEST_ID_CONTRACT = [
  'sequence-wheel-scene',
  'sequence-wheel-manipulator',
  'sequence-wheel-arithmetic',
  'sequence-wheel-geometric',
  'sequence-wheel-function',
  'sequence-wheel-check',
  'sequence-wheel-feedback',
  'sequence-wheel-reset',
] as const;

export type WheelMode = 'arithmetic' | 'geometric' | 'function';

export interface ModeCopy {
  label: string;
  short: string;
  relation: string;
  engine: string;
  feedback: string;
}

export interface ModeTheme {
  accent: string;
  second: string;
  shadow: string;
  rail: string;
  meter: string;
}

export interface SequenceMission {
  id: string;
  atomId: (typeof ATOM_IDS)[number];
  title: string;
  prompt: string;
  values: number[];
  expectedMode: WheelMode;
  functionPower?: 2 | 3;
  success: string;
  failure: Record<WheelMode, string>;
  proof: string;
}

export const modeCopy: Record<WheelMode, ModeCopy> = {
  arithmetic: {
    label: 'Aritmetik',
    short: '+3',
    relation: '+3',
    engine: 'Sabit fark motoru',
    feedback: 'Fark merceği açık: iki komşu kapsül arasındaki artış aynı mı diye bak.',
  },
  geometric: {
    label: 'Geometrik',
    short: 'x2',
    relation: 'x2',
    engine: 'Sabit oran motoru',
    feedback: 'Oran merceği açık: her kapsül bir öncekinin aynı katı mı diye izle.',
  },
  function: {
    label: 'Bir Fonksiyondur',
    short: 'n²',
    relation: 'n²',
    engine: 'Ayrık adım motoru',
    feedback: 'Bir fonksiyon kuralı var: değerler eğriden değil, doğal sayı adımlarından okunur.',
  },
};

export const modeTheme: Record<WheelMode, ModeTheme> = {
  arithmetic: {
    accent: '#00E5FF',
    second: '#00FF88',
    shadow: 'rgba(0,229,255,0.28)',
    rail: 'from-[#00E5FF] via-[#7FFFD4] to-[#00FF88]',
    meter: 'Sabit fark',
  },
  geometric: {
    accent: '#B388FF',
    second: '#FFB86B',
    shadow: 'rgba(179,136,255,0.26)',
    rail: 'from-[#B388FF] via-[#F7B267] to-[#00E5FF]',
    meter: 'Sabit oran',
  },
  function: {
    accent: '#FBBF24',
    second: '#00E5FF',
    shadow: 'rgba(251,191,36,0.22)',
    rail: 'from-[#FBBF24] via-[#00E5FF] to-[#00FF88]',
    meter: 'Ayrık adım',
  },
};

export const sequenceMissions: SequenceMission[] = [
  {
    id: 'constant-difference',
    atomId: 'MAT.12.1.1.1',
    title: 'Sabit farkı yakala',
    prompt: '4, 7, 10, 13, 16 dizisinde her geçişte aynı farkı kilitle.',
    values: [4, 7, 10, 13, 16],
    expectedMode: 'arithmetic',
    success: 'Doğru: her komşu terimde +3 var. Aritmetik dizi sabit farkla ilerler.',
    failure: {
      arithmetic: 'Aritmetik mercek doğru; şimdi kilitle.',
      geometric: 'Bu ray geometrik değil: oranlar sabit kalmıyor, sadece artış miktarı aynı.',
      function: 'Bu görevde önce komşu terimler arasındaki farkı oku; fonksiyon ayrımı sonraki görev.',
    },
    proof: '7-4 = 10-7 = 13-10 = 16-13 = 3',
  },
  {
    id: 'constant-ratio',
    atomId: 'MAT.12.1.1.2',
    title: 'Sabit oranı kilitle',
    prompt: '2, 4, 8, 16, 32 dizisinde çarpan rayını bul.',
    values: [2, 4, 8, 16, 32],
    expectedMode: 'geometric',
    success: 'Doğru: her kapsül bir öncekinin 2 katı. Geometrik dizi sabit oranla büyür.',
    failure: {
      arithmetic: 'Farklar 2, 4, 8, 16 diye değişiyor; sabit fark yok.',
      geometric: 'Geometrik mercek doğru; şimdi kilitle.',
      function: 'Burada ayrık fonksiyon değil, aynı çarpanla büyüyen oran rayı aranıyor.',
    },
    proof: '4/2 = 8/4 = 16/8 = 32/16 = 2',
  },
  {
    id: 'discrete-function',
    atomId: 'MAT.12.1.1.3',
    title: 'Diziyi fonksiyondan ayır',
    prompt: '1, 4, 9, 16, 25 değerleri y = x² kuralından gelir; ama yalnız n = 1,2,3... adımlarında okunur.',
    values: [1, 4, 9, 16, 25],
    expectedMode: 'function',
    functionPower: 2,
    success: 'Doğru: bu bir dizi okuması. Kural y=x² gibi görünür ama tanım adımları n=1,2,3... ile ayrık kalır.',
    failure: {
      arithmetic: 'Farklar 3, 5, 7, 9 diye değişiyor; aritmetik dizi değil.',
      geometric: 'Oranlar sabit değil; geometrik dizi gibi büyümüyor.',
      function: 'Bir fonksiyondur seçimi doğru; şimdi kilitle.',
    },
    proof: 'aₙ = n²; n yalnız doğal sayı adımlarında ilerler',
  },
  {
    id: 'constant-difference-plus-five',
    atomId: 'MAT.12.1.1.1',
    title: 'İkinci fark rayı',
    prompt: '3, 8, 13, 18, 23 dizisinde sabit artış miktarını tekrar yakala.',
    values: [3, 8, 13, 18, 23],
    expectedMode: 'arithmetic',
    success: 'Doğru: bu kez her geçişte +5 var. Aritmetik dizi yine sabit farkla ilerliyor.',
    failure: {
      arithmetic: 'Aritmetik mercek doğru; şimdi kilitle.',
      geometric: 'Oranlar aynı değil; bu ray çarpanla değil, eşit artışla ilerliyor.',
      function: 'Burada fonksiyon okuması değil, komşu terimler arasındaki sabit fark aranıyor.',
    },
    proof: '8-3 = 13-8 = 18-13 = 23-18 = 5',
  },
  {
    id: 'constant-ratio-times-three',
    atomId: 'MAT.12.1.1.2',
    title: 'Üçlü çarpan rayı',
    prompt: '1, 3, 9, 27, 81 dizisinde aynı çarpanı kilitle.',
    values: [1, 3, 9, 27, 81],
    expectedMode: 'geometric',
    success: 'Doğru: her kapsül bir öncekinin 3 katı. Geometrik dizi sabit oranla büyür.',
    failure: {
      arithmetic: 'Farklar 2, 6, 18, 54 diye değişiyor; sabit fark yok.',
      geometric: 'Geometrik mercek doğru; şimdi kilitle.',
      function: 'Bu görevde doğal sayı adımı değil, her kapsülde korunan çarpan aranıyor.',
    },
    proof: '3/1 = 9/3 = 27/9 = 81/27 = 3',
  },
  {
    id: 'discrete-function-cube',
    atomId: 'MAT.12.1.1.3',
    title: 'Küp kuralını dizi gibi oku',
    prompt: '1, 8, 27, 64, 125 değerleri y = x³ kuralından gelir; ama yalnız n = 1,2,3... adımlarında okunur.',
    values: [1, 8, 27, 64, 125],
    expectedMode: 'function',
    functionPower: 3,
    success: 'Doğru: bu da fonksiyon kuralından gelen bir dizi okuması. Kural x³, ama okuma yalnız doğal sayı adımlarında.',
    failure: {
      arithmetic: 'Farklar 7, 19, 37, 61 diye değişiyor; aritmetik dizi değil.',
      geometric: 'Oranlar sabit değil; bu ray geometrik dizi gibi tek çarpanla büyümüyor.',
      function: 'Bir fonksiyondur seçimi doğru; şimdi kilitle.',
    },
    proof: 'aₙ = n³; n yalnız doğal sayı adımlarında ilerler',
  },
];

export function relationLabels(values: number[], mode: WheelMode, functionPower: SequenceMission['functionPower'] = 2) {
  if (mode === 'arithmetic') {
    return values.slice(0, -1).map((value, index) => formatSigned(values[index + 1] - value));
  }

  if (mode === 'geometric') {
    return values.slice(0, -1).map((value, index) => formatRatio(values[index + 1] / value));
  }

  return values
    .slice(0, -1)
    .map((_, index) => formatFunctionStep(index + 1, functionPower));
}

export function formatSigned(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

export function nextTermProjection(values: number[], mode: WheelMode, functionPower: SequenceMission['functionPower'] = 2) {
  const last = values[values.length - 1];
  const previous = values[values.length - 2];
  const nextIndex = values.length + 1;

  if (mode === 'arithmetic') {
    const difference = last - previous;
    return {
      value: last + difference,
      formula: `${last} ${difference >= 0 ? '+' : '-'} ${Math.abs(difference)}`,
    };
  }

  if (mode === 'geometric') {
    const ratio = last / previous;
    return {
      value: Math.round(last * ratio * 100) / 100,
      formula: `${last} x ${formatDisplayNumber(ratio)}`,
    };
  }

  return {
    value: nextIndex ** functionPower,
    formula: `${nextIndex}${formatFunctionPower(functionPower)}`,
  };
}

export function formatFunctionRule(power: SequenceMission['functionPower'] = 2) {
  return `n${formatFunctionPower(power)}`;
}

export function formatFunctionStep(index: number, power: SequenceMission['functionPower'] = 2) {
  return `${index}${formatFunctionPower(power)}`;
}

function formatFunctionPower(power: SequenceMission['functionPower'] = 2) {
  return power === 3 ? '³' : '²';
}

function formatRatio(value: number) {
  if (Number.isInteger(value)) return `x${value}`;
  return `x${value.toFixed(2).replace(/0$/, '')}`;
}

function formatDisplayNumber(value: number) {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}
