export type NetworkTaskKind = 'convert' | 'probability' | 'chart';

export interface ChartBar {
  label: string;
  value: number;
  color: string;
}

export interface NetworkTask {
  id: string;
  kind: NetworkTaskKind;
  title: string;
  prompt: string;
  chips: string[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
  input?: string;
  outputUnit?: string;
  capsules?: string[];
  bars?: ChartBar[];
}

type ProbabilityKind = 'impossible' | 'certain' | 'possible';

interface ProbabilityScenario {
  id: string;
  kind: ProbabilityKind;
  title: string;
  prompt: string;
  chips: string[];
  answer: 'İmkânsız' | 'Kesin' | 'Olabilir';
  hint: string;
  successText: string;
  accent: string;
  atomId: string;
  capsules: string[];
}

export const MEASURE_CONVERSION_ATOMS = [
  { id: 'MAT.4.1.13.1', label: 'Milimetreyi santimetreye dönüştürür.' },
  { id: 'MAT.4.1.13.2', label: 'Santimetreyi metreye dönüştürür.' },
  { id: 'MAT.4.1.13.3', label: 'Tonu kilograma dönüştürür.' },
  { id: 'MAT.4.1.13.4', label: 'Kilogramı grama dönüştürür.' },
] as const;

export const PROBABILITY_LABEL_ATOMS = [
  { id: 'MAT.4.4.1.1', label: 'İmkânsız durumu seçer.' },
  { id: 'MAT.4.4.1.2', label: 'Kesin durumu seçer.' },
  { id: 'MAT.4.4.1.3', label: 'Olabilir durumu seçer.' },
] as const;

export const TWO_GROUP_BAR_CHART_ATOMS = [
  { id: 'MAT.4.4.2.1', label: 'İki veri grubunu sütun grafiğinde kıyaslar.' },
] as const;

export const NETWORK_OPTIMIZATION_ATOMS = [
  ...MEASURE_CONVERSION_ATOMS,
  ...PROBABILITY_LABEL_ATOMS,
  ...TWO_GROUP_BAR_CHART_ATOMS,
];

export function createNetworkOptimizationTasks(): NetworkTask[] {
  return [
    ...createMeasureConversion4Tasks(),
    ...createProbabilityLabel4Tasks(),
    ...createTwoGroupBarChart4Tasks().slice(0, 1),
  ];
}

export function createMeasureConversion4Tasks(): NetworkTask[] {
  return [
    createMmCmTask(),
    createCmMTask(),
    createTonKgTask(),
    createKgGTask(),
  ];
}

export function createProbabilityLabel4Tasks(): NetworkTask[] {
  return shuffle([
    createProbabilityTask('impossible'),
    createProbabilityTask('certain'),
    createProbabilityTask('possible'),
  ]);
}

export function createTwoGroupBarChart4Tasks(): NetworkTask[] {
  const first = createChartGreaterTask('fidan', 'Hangi sınıf daha çok fidan dikti?', 'fidan');
  const second = createChartFewerTask('kitap', 'Hangi sınıf daha az kitap okudu?');
  const third = createChartDifferenceTask('rozet', 'İki sınıf arasında kaç rozet fark var?', 'rozet');
  const fourth = createChartGreaterTask('geri-donusum', 'Hangi sınıf daha çok şişe topladı?', 'şişe');

  return [first, second, third, fourth];
}

function createChartGreaterTask(id: string, prompt: string, noun: string): NetworkTask {
  const a = randomItem([7, 9, 11, 13]);
  const b = a + randomItem([-3, -2, 2, 4]);
  const winner = a > b ? '4-A' : '4-B';

  return {
    id: `chart-more-${id}-${a}-${b}`,
    kind: 'chart',
    title: 'Büyük sütunu bul',
    prompt,
    chips: [`4-A: ${a}`, `4-B: ${b}`, 'Uzun sütun daha çok'],
    choices: shuffle([`${winner} daha çok`, 'İkisi eşit', winner === '4-A' ? '4-B daha çok' : '4-A daha çok']),
    answer: `${winner} daha çok`,
    hint: `Daha uzun sütun daha çok ${noun} gösterir.`,
    successText: 'Grafikte büyük olan grubu doğru seçtin.',
    accent: '#38BDF8',
    atomIds: ['MAT.4.4.2.1'],
    bars: [
      { label: '4-A', value: a, color: '#2EE7FF' },
      { label: '4-B', value: b, color: '#B388FF' },
    ],
  };
}

function createChartFewerTask(id: string, prompt: string): NetworkTask {
  const a = randomItem([8, 10, 12, 15]);
  const b = a + randomItem([-4, -2, 3, 5]);
  const lower = a < b ? '4-A' : '4-B';

  return {
    id: `chart-less-${id}-${a}-${b}`,
    kind: 'chart',
    title: 'Kısa sütunu bul',
    prompt,
    chips: [`4-A: ${a}`, `4-B: ${b}`, 'Kısa sütun daha az'],
    choices: shuffle([`${lower} daha az`, 'İkisi eşit', lower === '4-A' ? '4-B daha az' : '4-A daha az']),
    answer: `${lower} daha az`,
    hint: 'Daha kısa sütun daha küçük sayıyı gösterir.',
    successText: 'Grafikte az olan grubu doğru seçtin.',
    accent: '#A78BFA',
    atomIds: ['MAT.4.4.2.1'],
    bars: [
      { label: '4-A', value: a, color: '#2EE7FF' },
      { label: '4-B', value: b, color: '#B388FF' },
    ],
  };
}

function createChartDifferenceTask(id: string, prompt: string, noun: string): NetworkTask {
  const a = randomItem([10, 12, 14, 16]);
  const diff = randomItem([2, 3, 4]);
  const b = a - diff;

  return {
    id: `chart-diff-${id}-${a}-${b}`,
    kind: 'chart',
    title: 'Farkı bul',
    prompt,
    chips: [`4-A: ${a}`, `4-B: ${b}`, `${a} - ${b}`],
    choices: shuffle([`${diff} ${noun}`, `${diff + 2} ${noun}`, `${Math.max(1, diff - 1)} ${noun}`]),
    answer: `${diff} ${noun}`,
    hint: 'İki sütunun sayılarını çıkararak farkı bul.',
    successText: 'Grafikteki farkı doğru buldun.',
    accent: '#34D399',
    atomIds: ['MAT.4.4.2.1'],
    bars: [
      { label: '4-A', value: a, color: '#2EE7FF' },
      { label: '4-B', value: b, color: '#B388FF' },
    ],
  };
}

function createChartTask(): NetworkTask {
  return createChartGreaterTask('fidan', 'Hangi sınıf daha çok fidan dikti?', 'fidan');
}

function createMmCmTask(): NetworkTask {
  const cm = randomItem([3, 5, 8, 12]);
  return createConvertTask('mm-cm', `${cm * 10} mm`, 'cm', `${cm} cm`, [`${cm * 10} mm`, '10 mm = 1 cm', "10'a böl"], 'MAT.4.1.13.1', '#2EE7FF');
}

function createCmMTask(): NetworkTask {
  const meter = randomItem([2, 3, 4, 5]);
  return createConvertTask('cm-m', `${meter * 100} cm`, 'm', `${meter} m`, [`${meter * 100} cm`, '100 cm = 1 m', "100'lü grup"], 'MAT.4.1.13.2', '#B388FF');
}

function createTonKgTask(): NetworkTask {
  const ton = randomItem([2, 3, 4, 6]);
  return createConvertTask('ton-kg', `${ton} ton`, 'kg', `${formatNumber(ton * 1000)} kg`, [`${ton} ton`, '1 ton = 1000 kg', "1000'le çarp"], 'MAT.4.1.13.3', '#34D399');
}

function createKgGTask(): NetworkTask {
  const kg = randomItem([3, 5, 7, 9]);
  return createConvertTask('kg-g', `${kg} kg`, 'g', `${formatNumber(kg * 1000)} g`, [`${kg} kg`, '1 kg = 1000 g', "1000'le çarp"], 'MAT.4.1.13.4', '#FFB020');
}

function createConvertTask(id: string, input: string, outputUnit: string, answer: string, chips: string[], atomId: string, accent: string): NetworkTask {
  const numeric = Number(answer.replace(/\D/g, ''));
  return {
    id: `${id}-${input}`,
    kind: 'convert',
    title: 'Dönüştürme makinesi',
    prompt: `${input} kaç ${outputUnit} eder?`,
    chips,
    choices: shuffle([answer, `${formatNumber(numeric * 10)} ${outputUnit}`, `${Math.max(1, Math.floor(numeric / 10))} ${outputUnit}`]),
    answer,
    hint: `${chips[1]} kuralını kullan.`,
    successText: 'Ölçüyü doğru dönüştürdün.',
    accent,
    atomIds: [atomId],
    input,
    outputUnit,
  };
}

const probabilityScenarioBank: Record<ProbabilityKind, readonly ProbabilityScenario[]> = {
  impossible: [
    {
      id: 'die-eight',
      kind: 'impossible',
      title: 'İmkânsız olayı seç',
      prompt: 'Zardan 8 gelmesi nasıl bir olaydır?',
      chips: ['Zar yüzleri 1-6', '8 yok', 'Olmaz'],
      answer: 'İmkânsız',
      hint: 'Zarda 8 yazan yüz olmadığı için bu olay olmaz.',
      successText: 'İmkânsız olayı doğru seçtin.',
      accent: '#FB7185',
      atomId: 'MAT.4.4.1.1',
      capsules: ['1', '2', '3', '4', '5', '6'],
    },
    {
      id: 'red-from-blue-yellow',
      kind: 'impossible',
      title: 'İmkânsız olayı seç',
      prompt: 'Torba mavi ve sarı kapsüllerle dolu. Kırmızı gelmesi nasıl bir olaydır?',
      chips: ['Kırmızı yok', 'Mavi ve sarı var', 'Olmaz'],
      answer: 'İmkânsız',
      hint: 'Torbanın içinde kırmızı kapsül yoksa kırmızı gelmesi imkânsızdır.',
      successText: 'İmkânsız olayı doğru seçtin.',
      accent: '#FB7185',
      atomId: 'MAT.4.4.1.1',
      capsules: ['Mavi', 'Sarı', 'Mavi', 'Sarı', 'Mavi'],
    },
    {
      id: 'seven-from-one-five',
      kind: 'impossible',
      title: 'İmkânsız olayı seç',
      prompt: "Kutuda 1'den 5'e kadar kartlar var. 7 çekmek nasıl bir olaydır?",
      chips: ['Kartlar 1-5', '7 yok', 'Olmaz'],
      answer: 'İmkânsız',
      hint: 'Kutuda 7 kartı olmadığı için 7 çekmek olmaz.',
      successText: 'İmkânsız olayı doğru seçtin.',
      accent: '#FB7185',
      atomId: 'MAT.4.4.1.1',
      capsules: ['1', '2', '3', '4', '5'],
    },
  ],
  certain: [
    {
      id: 'all-blue',
      kind: 'certain',
      title: 'Kesin olayı seç',
      prompt: 'Torbadaki tüm kapsüller mavi. Mavi gelmesi nasıl bir olaydır?',
      chips: ['Hepsi mavi', 'Başka renk yok', 'Mutlaka olur'],
      answer: 'Kesin',
      hint: 'Torbadaki bütün kapsüller mavi ise mavi gelmesi kesindir.',
      successText: 'Kesin olay doğru seçildi.',
      accent: '#69D0FF',
      atomId: 'MAT.4.4.1.2',
      capsules: ['Mavi', 'Mavi', 'Mavi', 'Mavi', 'Mavi'],
    },
    {
      id: 'all-yellow',
      kind: 'certain',
      title: 'Kesin olayı seç',
      prompt: 'Torbadaki tüm kapsüller sarı. Sarı gelmesi nasıl bir olaydır?',
      chips: ['Hepsi sarı', 'Başka renk yok', 'Mutlaka olur'],
      answer: 'Kesin',
      hint: 'Torbadaki bütün kapsüller sarı ise sarı gelmesi kesindir.',
      successText: 'Kesin olay doğru seçildi.',
      accent: '#FACC15',
      atomId: 'MAT.4.4.1.2',
      capsules: ['Sarı', 'Sarı', 'Sarı', 'Sarı', 'Sarı'],
    },
    {
      id: 'less-than-seven',
      kind: 'certain',
      title: 'Kesin olayı seç',
      prompt: "Kutuda 1'den 6'ya kadar kartlar var. 7'den küçük kart çekmek nasıl bir olaydır?",
      chips: ['Tüm kartlar 7’den küçük', '1-6 var', 'Mutlaka olur'],
      answer: 'Kesin',
      hint: "1, 2, 3, 4, 5 ve 6'nın hepsi 7'den küçüktür.",
      successText: 'Kesin olay doğru seçildi.',
      accent: '#69D0FF',
      atomId: 'MAT.4.4.1.2',
      capsules: ['1', '2', '3', '4', '5', '6'],
    },
  ],
  possible: [
    {
      id: 'yellow-from-mix',
      kind: 'possible',
      title: 'Olabilir olayı seç',
      prompt: 'Torba mavi ve sarı kapsüllerle dolu. Sarı gelmesi nasıl bir olaydır?',
      chips: ['Sarı var', 'Mavi de var', 'Bazen olur'],
      answer: 'Olabilir',
      hint: 'Sarı kapsül var ama torbada başka renk de var.',
      successText: 'Olabilir olay doğru yakalandı.',
      accent: '#A3E635',
      atomId: 'MAT.4.4.1.3',
      capsules: ['Mavi', 'Sarı', 'Mavi', 'Sarı', 'Mavi'],
    },
    {
      id: 'blue-from-mix',
      kind: 'possible',
      title: 'Olabilir olayı seç',
      prompt: 'Torba mavi ve sarı kapsüllerle dolu. Mavi gelmesi nasıl bir olaydır?',
      chips: ['Mavi var', 'Sarı da var', 'Bazen olur'],
      answer: 'Olabilir',
      hint: 'Mavi kapsül var ama torbada sarı kapsül de var.',
      successText: 'Olabilir olay doğru yakalandı.',
      accent: '#A3E635',
      atomId: 'MAT.4.4.1.3',
      capsules: ['Mavi', 'Sarı', 'Mavi', 'Sarı', 'Mavi'],
    },
    {
      id: 'even-card',
      kind: 'possible',
      title: 'Olabilir olayı seç',
      prompt: "Kutuda 1'den 6'ya kadar kartlar var. Çift sayı çekmek nasıl bir olaydır?",
      chips: ['Çift kart var', 'Tek kart da var', 'Bazen olur'],
      answer: 'Olabilir',
      hint: 'Kutuda çift sayılar var ama bütün kartlar çift değildir.',
      successText: 'Olabilir olay doğru yakalandı.',
      accent: '#A3E635',
      atomId: 'MAT.4.4.1.3',
      capsules: ['1', '2', '3', '4', '5', '6'],
    },
  ],
};

const lastProbabilityScenarioIds: Partial<Record<ProbabilityKind, string>> = {};

function createProbabilityTask(kind: ProbabilityKind): NetworkTask {
  const scenario = pickProbabilityScenario(kind);
  return {
    id: `prob-${scenario.id}`,
    kind: 'probability',
    title: scenario.title,
    prompt: scenario.prompt,
    chips: scenario.chips,
    choices: shuffle(['Olabilir', 'Kesin', 'İmkânsız']),
    answer: scenario.answer,
    hint: scenario.hint,
    successText: scenario.successText,
    accent: scenario.accent,
    atomIds: [scenario.atomId],
    capsules: scenario.capsules,
  };
}

function pickProbabilityScenario(kind: ProbabilityKind): ProbabilityScenario {
  const scenarios = probabilityScenarioBank[kind];
  const lastId = lastProbabilityScenarioIds[kind];
  const pool = scenarios.filter((scenario) => scenario.id !== lastId);
  const scenario = randomItem(pool.length > 0 ? pool : scenarios);
  lastProbabilityScenarioIds[kind] = scenario.id;
  return scenario;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
