export type HologramDesignKind = 'block-build' | 'shape-build' | 'mirror-axis' | 'asymmetric' | 'number-pattern' | 'shape-pattern' | 'route-map';

export interface HologramDesignTask {
  id: string;
  kind: HologramDesignKind;
  title: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  code: string;
}

export const HOLOGRAM_DESIGN_2_ATOMS = [
  { id: 'MAT.2.3.2.1', label: '3D cisimleri üst üste dizerek model oluşturur.' },
  { id: 'MAT.2.3.3.1', label: '2D şekilleri yan yana dizerek yeni model oluşturur.' },
  { id: 'MAT.2.3.7.1', label: 'Ayna ekseniyle iki yarımın eşleştiğini doğrular.' },
  { id: 'MAT.2.3.7.2', label: 'Asimetrik şekli listeden eler.' },
  { id: 'MAT.2.1.5.1', label: 'Sayı örüntüsündeki artış kuralını bulur.' },
  { id: 'MAT.2.1.5.2', label: 'Şekil örüntüsünün büyüme kuralını test eder.' },
  { id: 'MAT.2.3.6.1', label: 'Kroki üzerinde adım ve yön komutunu çözer.' },
];

const BLOCK_CASES = [
  { answer: 'Küp baş', code: 'küp + silindir + küp' },
  { answer: 'Silindir gövde', code: 'küp + silindir + teker' },
  { answer: 'Küre teker', code: 'küp + prizma + küre' },
];

const SHAPE_CASES = [
  { answer: 'Üçgen burun', code: 'kare + üçgen + daire' },
  { answer: 'Daire pencere', code: 'dikdörtgen + daire' },
  { answer: 'Kare gövde', code: 'üçgen + kare + kare' },
];

const NUMBER_PATTERNS = [
  { sequence: [4, 7, 10], answer: '13', step: 3 },
  { sequence: [6, 10, 14], answer: '18', step: 4 },
  { sequence: [5, 7, 9], answer: '11', step: 2 },
];

const ROUTE_CASES = [
  { answer: 'Yıldız kapısı', code: '2 sağa, 1 yukarı' },
  { answer: 'Ay kapısı', code: '1 sağa, 2 yukarı' },
  { answer: 'Güneş kapısı', code: '3 sağa, 1 yukarı' },
];

const COLORS = ['#22D3EE', '#FACC15', '#A78BFA', '#FB7185', '#34D399', '#38BDF8', '#FFB020'];

export function createHologramDesignBase2Tasks(seed = Math.floor(Math.random() * 1000)): HologramDesignTask[] {
  const block = pickBySeed(BLOCK_CASES, seed);
  const shape = pickBySeed(SHAPE_CASES, seed + 1);
  const numberPattern = pickBySeed(NUMBER_PATTERNS, seed + 2);
  const route = pickBySeed(ROUTE_CASES, seed + 3);

  const tasks: HologramDesignTask[] = [
    {
      id: `block-build-${block.answer}`,
      kind: 'block-build',
      title: 'Robotu tamamla',
      prompt: '3D robot modeli için eksik cismi seç.',
      choices: shuffle(unique([block.answer, 'Üçgen parça', 'Düz çizgi'])),
      answer: block.answer,
      hint: 'Robot modeli küp, silindir, küre gibi cisimlerle kurulur.',
      successText: '3D cisimlerden modeli tamamladın.',
      atomIds: ['MAT.2.3.2.1'],
      color: COLORS[0],
      code: block.code,
    },
    {
      id: `shape-build-${shape.answer}`,
      kind: 'shape-build',
      title: 'Aracı tamamla',
      prompt: 'Hologram aracında eksik 2D şekli seç.',
      choices: shuffle(unique([shape.answer, 'Küre teker', 'Silindir boru'])),
      answer: shape.answer,
      hint: 'Bu tasarım düz şekillerle yapılır: üçgen, kare, daire.',
      successText: '2D şekillerle yeni modeli kurdun.',
      atomIds: ['MAT.2.3.3.1'],
      color: COLORS[1],
      code: shape.code,
    },
    {
      id: 'mirror-axis',
      kind: 'mirror-axis',
      title: 'Ayna çizgisini bul',
      prompt: 'İki yarımı eş yapan ayna çizgisi hangisi?',
      choices: shuffle(['Dikey ayna', 'Yatay ayna', 'Çapraz ayna']),
      answer: 'Dikey ayna',
      hint: 'Sol ve sağ yarımlar birbirini tutuyorsa ayna dikeydir.',
      successText: 'Ayna eksenini doğru yerden geçirdin.',
      atomIds: ['MAT.2.3.7.1'],
      color: COLORS[2],
      code: 'sol yarım = sağ yarım',
    },
    {
      id: 'asymmetric',
      kind: 'asymmetric',
      title: 'Bozuk hologramı ele',
      prompt: 'Aynada iki yanı eşleşmeyen tasarım hangisi?',
      choices: shuffle(['Eksik kanatlı araç', 'Çift kanatlı araç', 'Çift pencereli araç']),
      answer: 'Eksik kanatlı araç',
      hint: 'Bir tarafta parça eksikse iki yarım eşleşmez.',
      successText: 'Asimetrik tasarımı ayıkladın.',
      atomIds: ['MAT.2.3.7.2'],
      color: COLORS[3],
      code: 'eşleşmeyeni bul',
    },
    {
      id: `number-pattern-${numberPattern.sequence.join('-')}`,
      kind: 'number-pattern',
      title: 'Sayı ışığını sürdür',
      prompt: `${numberPattern.sequence.join(', ')}, ? örüntüsünde sıradaki sayı kaç?`,
      choices: makeNumberChoices(Number(numberPattern.answer), numberPattern.step),
      answer: numberPattern.answer,
      hint: `Her adımda ${numberPattern.step} artıyor.`,
      successText: 'Sayı örüntüsünün artış kuralını buldun.',
      atomIds: ['MAT.2.1.5.1'],
      color: COLORS[4],
      code: `+${numberPattern.step}`,
    },
    {
      id: 'shape-pattern',
      kind: 'shape-pattern',
      title: 'Şekil ritmini tamamla',
      prompt: 'Her adımda bir yıldız daha ekleniyor. Sıradaki kart hangisi?',
      choices: shuffle(['4 yıldızlı kart', '2 yıldızlı kart', 'Daire kartı']),
      answer: '4 yıldızlı kart',
      hint: 'Kartlar 1, 2, 3 yıldız diye büyüyor.',
      successText: 'Şekil örüntüsünün büyüme kuralını gördün.',
      atomIds: ['MAT.2.1.5.2'],
      color: COLORS[5],
      code: '1, 2, 3, ?',
    },
    {
      id: `route-map-${route.answer}`,
      kind: 'route-map',
      title: 'Krokide yolu bul',
      prompt: `AstroBot başlangıçtan ${route.code} giderse hangi kapıya ulaşır?`,
      choices: shuffle(unique([route.answer, 'Bulut kapısı', 'Küp kapısı'])),
      answer: route.answer,
      hint: 'Önce sağa adımları say, sonra yukarı çık.',
      successText: 'Adım ve yön komutunu kroki üzerinde çözdün.',
      atomIds: ['MAT.2.3.6.1'],
      color: COLORS[6],
      code: route.code,
    },
  ];

  return tasks.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function makeNumberChoices(answer: number, step: number): string[] {
  return shuffle(unique([answer, Math.max(1, answer - step), answer + step])).map(String);
}

function pickBySeed<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
