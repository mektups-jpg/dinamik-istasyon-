export type FractionBalanceKind =
  | 'classify'
  | 'mixed'
  | 'equivalent'
  | 'unit-compare'
  | 'same-denom'
  | 'set-part'
  | 'whole'
  | 'add'
  | 'subtract';

export interface FractionShape {
  numerator: number;
  denominator: number;
  label: string;
}

export interface FractionBalanceTask {
  id: string;
  kind: FractionBalanceKind;
  title: string;
  prompt: string;
  fractions: FractionShape[];
  chips: string[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
}

export const FRACTION_BALANCE_ATOMS = [
  { id: 'MAT.4.1.6.1', label: 'Basit kesri ayırt eder.' },
  { id: 'MAT.4.1.6.2', label: 'Bileşik kesri ayırt eder.' },
  { id: 'MAT.4.1.6.3', label: 'Tam sayılı kesri modelle kurar.' },
  { id: 'MAT.4.1.7.1', label: 'Kesri genişletince denkliğin bozulmadığını görür.' },
  { id: 'MAT.4.1.7.2', label: 'Kesri sadeleştirince denkliğin bozulmadığını görür.' },
  { id: 'MAT.4.1.8.1', label: 'Birim kesirlerde payda büyüdükçe parçanın küçüldüğünü uygular.' },
  { id: 'MAT.4.1.9.1', label: 'Eş paydalı kesirlerde payı büyük olanı seçer.' },
  { id: 'MAT.4.1.10.1', label: 'Bir çokluğun belirtilen kesir kadarını bulur.' },
  { id: 'MAT.4.1.10.2', label: 'Birim kesir kadarı verilen bütünü bulur.' },
  { id: 'MAT.4.1.11.1', label: 'Eş paydalı kesirleri toplar.' },
  { id: 'MAT.4.1.11.2', label: 'Eş paydalı kesirleri çıkarır.' },
  { id: 'MAT.4.1.12.1', label: 'Kesir işlemini günlük yaşam problemine uygular.' },
];

export function createFractionBalanceTasks(): FractionBalanceTask[] {
  return [
    createClassifyTask(),
    createMixedTask(),
    createEquivalentTask(),
    createUnitCompareTask(),
    createSameDenomTask(),
    createSetPartTask(),
    createWholeTask(),
    createAddTask(),
    createSubtractTask(),
  ];
}

export function fractionLabel(numerator: number, denominator: number): string {
  return `${numerator}/${denominator}`;
}

function mixedFractionLabel(whole: number, numerator: number, denominator: number): string {
  return `${whole} tam ${fractionLabel(numerator, denominator)}`;
}

function createClassifyTask(): FractionBalanceTask {
  const fraction = randomItem([
    { numerator: 3, denominator: 5 },
    { numerator: 4, denominator: 7 },
    { numerator: 7, denominator: 5 },
    { numerator: 9, denominator: 6 },
  ]);
  const isSimple = fraction.numerator < fraction.denominator;

  return {
    id: `classify-${fraction.numerator}-${fraction.denominator}`,
    kind: 'classify',
    title: 'Kesir türünü seç',
    prompt: `${fractionLabel(fraction.numerator, fraction.denominator)} nasıl bir kesir?`,
    fractions: [{ ...fraction, label: fractionLabel(fraction.numerator, fraction.denominator) }],
    chips: [`Pay ${fraction.numerator}`, `Payda ${fraction.denominator}`, isSimple ? 'Pay paydadan küçük' : 'Pay paydaya eşit ya da büyük'],
    choices: shuffle(['Basit kesir', 'Bileşik kesir', 'Tam sayılı kesir']),
    answer: isSimple ? 'Basit kesir' : 'Bileşik kesir',
    hint: isSimple ? 'Pay paydadan küçükse basit kesirdir.' : 'Pay paydaya eşit ya da büyükse bileşik kesirdir.',
    successText: 'Kesrin türünü doğru ayırdın.',
    accent: '#2EE7FF',
    atomIds: isSimple ? ['MAT.4.1.6.1'] : ['MAT.4.1.6.2'],
  };
}

function createMixedTask(): FractionBalanceTask {
  const denominator = randomItem([3, 4, 5]);
  const numerator = randomItem([1, 2]);
  const answer = mixedFractionLabel(1, numerator, denominator);
  const wrongNumerator = numerator === 1 ? 2 : 1;

  return {
    id: `mixed-${numerator}-${denominator}`,
    kind: 'mixed',
    title: 'Tam sayılı kesri kur',
    prompt: `1 tam ve ${fractionLabel(numerator, denominator)} parça birlikte tam sayılı kesir olarak nasıl yazılır?`,
    fractions: [
      { numerator: denominator, denominator, label: '1 tam' },
      { numerator, denominator, label: fractionLabel(numerator, denominator) },
    ],
    chips: ['Tam sayılı yazım', '1 tam tank', `${denominator} eş parçadan ${numerator} dolu`],
    choices: shuffle([
      answer,
      mixedFractionLabel(2, numerator, denominator),
      mixedFractionLabel(1, wrongNumerator, denominator),
    ]),
    answer,
    hint: 'Bileşik kesre çevirmeden, 1 tamın yanına kalan kesir parçasını yaz.',
    successText: 'Tam sayılı kesri doğru kurdun.',
    accent: '#B388FF',
    atomIds: ['MAT.4.1.6.3'],
  };
}

function createEquivalentTask(): FractionBalanceTask {
  const base = randomItem([
    { numerator: 1, denominator: 2, scale: 2 },
    { numerator: 2, denominator: 3, scale: 2 },
    { numerator: 2, denominator: 4, scale: 2 },
  ]);
  const expanded = { numerator: base.numerator * base.scale, denominator: base.denominator * base.scale };
  const answer = fractionLabel(expanded.numerator, expanded.denominator);

  return {
    id: `equivalent-${answer}`,
    kind: 'equivalent',
    title: 'Denk kesri yakala',
    prompt: `${fractionLabel(base.numerator, base.denominator)} kesrini ${base.scale} ile genişlet.`,
    fractions: [
      { numerator: base.numerator, denominator: base.denominator, label: fractionLabel(base.numerator, base.denominator) },
      { numerator: expanded.numerator, denominator: expanded.denominator, label: answer },
    ],
    chips: [`Pay × ${base.scale}`, `Payda × ${base.scale}`],
    choices: shuffle([answer, fractionLabel(expanded.numerator + 1, expanded.denominator), fractionLabel(base.numerator, expanded.denominator)]),
    answer,
    hint: 'Denk kesirde pay ve payda aynı sayı ile çarpılır.',
    successText: 'Denk kesri doğru buldun.',
    accent: '#34D399',
    atomIds: ['MAT.4.1.7.1', 'MAT.4.1.7.2'],
  };
}

function createUnitCompareTask(): FractionBalanceTask {
  const smallDenom = randomItem([3, 4, 5]);
  const bigDenom = smallDenom + randomItem([2, 3, 4]);
  const left = fractionLabel(1, smallDenom);
  const right = fractionLabel(1, bigDenom);
  const answer = `${left} daha büyüktür`;

  return {
    id: `unit-${smallDenom}-${bigDenom}`,
    kind: 'unit-compare',
    title: 'Birim kesri karşılaştır',
    prompt: `${left} ve ${right}: hangisi daha büyük?`,
    fractions: [
      { numerator: 1, denominator: smallDenom, label: left },
      { numerator: 1, denominator: bigDenom, label: right },
    ],
    chips: ['Birim kesir', 'Pay hep 1'],
    choices: shuffle([answer, `${right} daha büyüktür`, 'İkisi eşittir']),
    answer,
    hint: 'Pay 1 ise payda büyüdükçe parça küçülür.',
    successText: 'Birim kesir kuralını gördün.',
    accent: '#FFB020',
    atomIds: ['MAT.4.1.8.1'],
  };
}

function createSameDenomTask(): FractionBalanceTask {
  const denominator = randomItem([6, 7, 8]);
  const first = randomItem([2, 3, 4]);
  const second = first + randomItem([1, 2]);
  const answer = `${fractionLabel(second, denominator)} daha büyüktür`;

  return {
    id: `same-${first}-${second}-${denominator}`,
    kind: 'same-denom',
    title: 'Eş paydalı kesri seç',
    prompt: `Paydalar aynı. ${fractionLabel(first, denominator)} mi, ${fractionLabel(second, denominator)} mi daha büyük?`,
    fractions: [
      { numerator: first, denominator, label: fractionLabel(first, denominator) },
      { numerator: second, denominator, label: fractionLabel(second, denominator) },
    ],
    chips: [`Payda ${denominator}`, 'Payı büyük olan kazanır'],
    choices: shuffle([answer, `${fractionLabel(first, denominator)} daha büyüktür`, 'İkisi eşittir']),
    answer,
    hint: 'Paydalar aynıysa dolu parça sayısı büyük olan kesir daha büyüktür.',
    successText: 'Payı büyük olan kesri doğru seçtin.',
    accent: '#69D0FF',
    atomIds: ['MAT.4.1.9.1'],
  };
}

function createSetPartTask(): FractionBalanceTask {
  const denominator = randomItem([4, 8]);
  const total = randomItem(denominator === 8 ? [24, 32] : [20, 24, 28, 32]);
  const numerator = randomItem([2, 3]);
  const answerValue = (total / denominator) * numerator;

  return {
    id: `set-${total}-${numerator}-${denominator}`,
    kind: 'set-part',
    title: 'Çokluğun kesrini bul',
    prompt: `${total} yıldızın ${fractionLabel(numerator, denominator)} kadarı kaç yıldız eder?`,
    fractions: [{ numerator, denominator, label: fractionLabel(numerator, denominator) }],
    chips: [`Toplam ${total}`, `${denominator} eş grup`, `${numerator} grup alınır`],
    choices: makeNumberChoices(answerValue, [answerValue + denominator, Math.max(1, answerValue - denominator)]),
    answer: String(answerValue),
    hint: `Önce ${total} sayısını ${denominator} eş gruba ayır, sonra ${numerator} grubu al.`,
    successText: 'Çokluktan istenen kesir kadarını aldın.',
    accent: '#F472B6',
    atomIds: ['MAT.4.1.10.1'],
  };
}

function createWholeTask(): FractionBalanceTask {
  const denominator = randomItem([3, 4, 5, 6]);
  const unitValue = randomItem([4, 5, 6, 7]);
  const answerValue = denominator * unitValue;

  return {
    id: `whole-${denominator}-${unitValue}`,
    kind: 'whole',
    title: 'Bütünü geri kur',
    prompt: `1/${denominator} parça ${unitValue} ise bütün kaçtır?`,
    fractions: [{ numerator: 1, denominator, label: fractionLabel(1, denominator) }],
    chips: [`1 parça ${unitValue}`, `${denominator} parça bütün`],
    choices: makeNumberChoices(answerValue, [answerValue + unitValue, Math.max(1, answerValue - unitValue)]),
    answer: String(answerValue),
    hint: `Bütün, ${denominator} tane aynı parçadan oluşur.`,
    successText: 'Bütünü doğru geri kurdun.',
    accent: '#A3E635',
    atomIds: ['MAT.4.1.10.2'],
  };
}

function createAddTask(): FractionBalanceTask {
  const denominator = randomItem([6, 7, 8]);
  const first = randomItem([1, 2, 3]);
  const second = randomItem([1, 2]);
  const answer = fractionLabel(first + second, denominator);

  return {
    id: `add-${first}-${second}-${denominator}`,
    kind: 'add',
    title: 'Payları birleştir',
    prompt: `${fractionLabel(first, denominator)} + ${fractionLabel(second, denominator)} toplamını seç.`,
    fractions: [
      { numerator: first, denominator, label: fractionLabel(first, denominator) },
      { numerator: second, denominator, label: fractionLabel(second, denominator) },
    ],
    chips: ['Payda sabit kalır', 'Paylar toplanır'],
    choices: shuffle([answer, fractionLabel(first + second, denominator + denominator), fractionLabel(first + second + 1, denominator)]),
    answer,
    hint: 'Eş paydalı toplamda payda değişmez; sadece dolu parçalar birleşir.',
    successText: 'Payları doğru birleştirdin.',
    accent: '#38BDF8',
    atomIds: ['MAT.4.1.11.1', 'MAT.4.1.12.1'],
  };
}

function createSubtractTask(): FractionBalanceTask {
  const denominator = randomItem([6, 7, 8]);
  const first = randomItem([4, 5, 6]);
  const second = randomItem([1, 2, 3]);
  const answer = fractionLabel(first - second, denominator);

  return {
    id: `sub-${first}-${second}-${denominator}`,
    kind: 'subtract',
    title: 'Paydan çıkar',
    prompt: `${fractionLabel(first, denominator)} - ${fractionLabel(second, denominator)} farkını seç.`,
    fractions: [
      { numerator: first, denominator, label: fractionLabel(first, denominator) },
      { numerator: second, denominator, label: fractionLabel(second, denominator) },
    ],
    chips: ['Payda sabit kalır', 'Paydan çıkar'],
    choices: shuffle([answer, fractionLabel(first - second, denominator + denominator), fractionLabel(first - second + 1, denominator)]),
    answer,
    hint: 'Eş paydalı çıkarmada payda aynı kalır; sadece paydan çıkar.',
    successText: 'Paydan doğru çıkardın.',
    accent: '#FB7185',
    atomIds: ['MAT.4.1.11.2', 'MAT.4.1.12.1'],
  };
}

function makeNumberChoices(answer: number, distractors: number[]): string[] {
  return shuffle(unique([answer, ...distractors]).filter((value) => value >= 0)).slice(0, 3).map(String);
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
