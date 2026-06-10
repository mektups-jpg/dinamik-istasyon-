export type MissionKind = 'priority' | 'balance';
export type FeedbackTone = 'info' | 'success' | 'error';
export type ChoiceKind = 'focus' | 'operation' | 'answer';

export interface EquationChoice {
  id: string;
  label: string;
  value: number | string;
  correct: boolean;
  testId: string;
  wrongReason: string;
  wrongTilt?: number;
}

export interface EquationMission {
  id: string;
  kind: MissionKind;
  title: string;
  atomIds: string[];
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  afterOperationLeftLabel: string;
  afterOperationRightLabel: string;
  focusChoices: EquationChoice[];
  operationChoices: EquationChoice[];
  answerChoices: EquationChoice[];
  success: string;
  proof: string;
}

export interface Feedback {
  tone: FeedbackTone;
  title: string;
  body: string;
}

type PriorityOperator = '×' | '÷';

interface PrioritySeed {
  id: string;
  base: number;
  left: number;
  operator: PriorityOperator;
  right: number;
  operationWrong: [number, number];
  finalWrong: [number, number];
  legacyTestIds?: {
    correctFocus: string;
    correctOperation: string;
    correctAnswer: string;
  };
}

interface BalanceSeed {
  id: string;
  sign: '+' | '-';
  amount: number;
  right: number;
  answerWrong: [number, number];
  legacyTestIds?: {
    correctOperation: string;
    correctAnswer: string;
  };
}

const prioritySeeds: PrioritySeed[] = [
  {
    id: 'shield',
    base: 8,
    left: 3,
    operator: '×',
    right: 4,
    operationWrong: [10, 15],
    finalWrong: [18, 24],
    legacyTestIds: {
      correctFocus: 'priority-shield',
      correctOperation: 'priority-option-12',
      correctAnswer: 'priority-final-20',
    },
  },
  { id: 'solar-panels', base: 6, left: 2, operator: '×', right: 5, operationWrong: [9, 14], finalWrong: [15, 30] },
  { id: 'crystal-array', base: 9, left: 4, operator: '×', right: 3, operationWrong: [11, 16], finalWrong: [19, 36] },
  { id: 'orbit-coils', base: 7, left: 5, operator: '×', right: 2, operationWrong: [9, 15], finalWrong: [16, 35] },
  { id: 'reactor-banks', base: 4, left: 3, operator: '×', right: 6, operationWrong: [15, 21], finalWrong: [20, 24] },
  { id: 'pulse-gates', base: 11, left: 2, operator: '×', right: 6, operationWrong: [10, 14], finalWrong: [21, 66] },
  { id: 'division-core', base: 10, left: 18, operator: '÷', right: 3, operationWrong: [5, 9], finalWrong: [15, 30] },
  { id: 'division-lens', base: 12, left: 24, operator: '÷', right: 4, operationWrong: [5, 8], finalWrong: [16, 72] },
];

const balanceSeeds: BalanceSeed[] = [
  {
    id: 'cancel',
    sign: '+',
    amount: 5,
    right: 17,
    answerWrong: [10, 22],
    legacyTestIds: {
      correctOperation: 'balance-operation-minus-5',
      correctAnswer: 'balance-answer-12',
    },
  },
  { id: 'minus-seven', sign: '+', amount: 7, right: 22, answerWrong: [14, 29] },
  { id: 'add-four', sign: '-', amount: 4, right: 13, answerWrong: [9, 52] },
  { id: 'minus-nine', sign: '+', amount: 9, right: 30, answerWrong: [18, 39] },
  { id: 'add-six', sign: '-', amount: 6, right: 18, answerWrong: [12, 108] },
  { id: 'minus-eight', sign: '+', amount: 8, right: 25, answerWrong: [16, 33] },
  { id: 'add-five', sign: '-', amount: 5, right: 16, answerWrong: [11, 80] },
  { id: 'minus-six', sign: '+', amount: 6, right: 19, answerWrong: [12, 25] },
];

export const missionSets: EquationMission[][] = prioritySeeds.map((prioritySeed, index) => [
  buildPriorityMission(prioritySeed),
  buildBalanceMission(balanceSeeds[index]),
]);

export const missions = missionSets[0];

export function getMissionSet(index: number): EquationMission[] {
  return missionSets[normalizeMissionSetIndex(index)];
}

export function getNextMissionSetIndex(currentIndex: number): number {
  if (missionSets.length <= 1) return 0;
  return normalizeMissionSetIndex(currentIndex + 1);
}

function buildPriorityMission(seed: PrioritySeed): EquationMission {
  const focusLabel = `${seed.left} ${seed.operator} ${seed.right}`;
  const leftLabel = `${seed.base} + (${focusLabel})`;
  const operationResult = seed.operator === '×' ? seed.left * seed.right : seed.left / seed.right;
  const finalResult = seed.base + operationResult;
  const operationName = seed.operator === '×' ? 'çarpma' : 'bölme';
  const correctFocusTestId = seed.legacyTestIds?.correctFocus ?? `priority-focus-${seed.id}`;
  const correctOperationTestId = seed.legacyTestIds?.correctOperation ?? `priority-option-${seed.id}`;
  const correctAnswerTestId = seed.legacyTestIds?.correctAnswer ?? `priority-final-${seed.id}`;

  return {
    id: `priority-${seed.id}`,
    kind: 'priority',
    title: 'İşlem önceliğini belirle',
    atomIds: ['MAT.5.2.2.1', 'MAT.5.2.2.2'],
    prompt: `${leftLabel} enerji cümlesinde önce hangi işlem yapılmalı?`,
    leftLabel,
    rightLabel: '?',
    afterOperationLeftLabel: `${seed.base} + ${operationResult}`,
    afterOperationRightLabel: String(finalResult),
    focusChoices: arrangeChoices([
      {
        id: `${seed.id}-base`,
        label: String(seed.base),
        value: String(seed.base),
        correct: false,
        testId: `priority-focus-base-${seed.id}`,
        wrongReason: `${seed.base} tek başına bekler. Parantez içindeki ${operationName} önce tamamlanmalı.`,
      },
      {
        id: `${seed.id}-focus`,
        label: focusLabel,
        value: focusLabel,
        correct: true,
        testId: correctFocusTestId,
        wrongReason: '',
      },
      {
        id: `${seed.id}-sum`,
        label: '+',
        value: '+',
        correct: false,
        testId: `priority-focus-plus-${seed.id}`,
        wrongReason: `Toplama son adımdır. Önce parantez içindeki ${operationName} işlemini yapmalısın.`,
        wrongTilt: 10,
      },
    ], correctSlot(seed.id, 'focus')),
    operationChoices: arrangeChoices([
      numberChoice(seed.operationWrong[0], `priority-option-low-${seed.id}`, false, `${focusLabel} sonucunu yeniden hesapla; bu değer kalkanı tam açmıyor.`),
      numberChoice(operationResult, correctOperationTestId, true),
      numberChoice(seed.operationWrong[1], `priority-option-high-${seed.id}`, false, `${focusLabel} için bu değer fazla geldi; yalnız parantez içindeki işlemi hesapla.`),
    ], correctSlot(seed.id, 'operation')),
    answerChoices: arrangeChoices([
      numberChoice(seed.finalWrong[0], `priority-final-low-${seed.id}`, false, `${seed.base} + ${operationResult} toplamı ${seed.finalWrong[0]} değil ${finalResult} olur.`),
      numberChoice(finalResult, correctAnswerTestId, true),
      numberChoice(seed.finalWrong[1], `priority-final-high-${seed.id}`, false, `${seed.finalWrong[1]}, işlem önceliğini karıştıran bir sonuç. Son adım yalnız toplama.`),
    ], correctSlot(seed.id, 'answer')),
    success: 'İşlem önceliği belirlendi.',
    proof: `Parantez içindeki ${focusLabel} önce ${operationResult} olur; sonra ${seed.base} + ${operationResult} = ${finalResult}.`,
  };
}

function buildBalanceMission(seed: BalanceSeed): EquationMission {
  const leftLabel = `x ${seed.sign} ${seed.amount}`;
  const correctOperation = seed.sign === '+' ? `-${seed.amount}` : `+${seed.amount}`;
  const wrongOperation = seed.sign === '+' ? `+${seed.amount}` : `-${seed.amount}`;
  const readableCorrectOperation = seed.sign === '+' ? `- ${seed.amount}` : `+ ${seed.amount}`;
  const finalResult = seed.sign === '+' ? seed.right - seed.amount : seed.right + seed.amount;
  const correctOperationTestId = seed.legacyTestIds?.correctOperation ?? `balance-operation-${seed.id}`;
  const correctAnswerTestId = seed.legacyTestIds?.correctAnswer ?? `balance-answer-${seed.id}`;
  const loadWord = seed.sign === '+' ? `+${seed.amount} yükünü kaldır` : `-${seed.amount} yükünü dengele`;

  return {
    id: `balance-${seed.id}`,
    kind: 'balance',
    title: 'Eşitliği koru',
    atomIds: ['MAT.5.2.1.1', 'MAT.5.2.1.2'],
    prompt: `${leftLabel} = ${seed.right} terazisinde x yalnız kalmalı. İki kefeye aynı işlemi uygula.`,
    leftLabel,
    rightLabel: String(seed.right),
    afterOperationLeftLabel: 'x',
    afterOperationRightLabel: String(finalResult),
    focusChoices: [],
    operationChoices: arrangeChoices([
      {
        id: `${seed.id}-wrong-operation`,
        label: wrongOperation,
        value: wrongOperation,
        correct: false,
        testId: `balance-operation-wrong-${seed.id}`,
        wrongReason: `${wrongOperation} uygularsan sol taraf x'i yalnız bırakmaz. Önce ${loadWord}.`,
        wrongTilt: wrongOperation.startsWith('+') ? -10 : 10,
      },
      {
        id: `${seed.id}-correct-operation`,
        label: correctOperation,
        value: correctOperation,
        correct: true,
        testId: correctOperationTestId,
        wrongReason: '',
      },
      {
        id: `${seed.id}-divide`,
        label: `÷${seed.amount}`,
        value: `÷${seed.amount}`,
        correct: false,
        testId: `balance-operation-divide-${seed.id}`,
        wrongReason: `Bölme, ${leftLabel} ifadesindeki ekleme/çıkarma yükünü doğrudan ayıramaz. İki kefeye ${correctOperation} uygulanmalı.`,
      },
    ], correctSlot(seed.id, 'balance-operation')),
    answerChoices: arrangeChoices([
      numberChoice(seed.answerWrong[0], `balance-answer-low-${seed.id}`, false, `${seed.right} ${readableCorrectOperation} işlemini tekrar say; x ${seed.answerWrong[0]} değil ${finalResult}.`, `x = ${seed.answerWrong[0]}`),
      numberChoice(finalResult, correctAnswerTestId, true, '', `x = ${finalResult}`),
      numberChoice(seed.answerWrong[1], `balance-answer-high-${seed.id}`, false, `${seed.answerWrong[1]}, iki kefeye aynı işlemi uygulama kuralını bozuyor. x = ${finalResult} kalmalı.`, `x = ${seed.answerWrong[1]}`),
    ], correctSlot(seed.id, 'balance-answer')),
    success: 'Terazi dengesi korundu',
    proof: `Her iki tarafa ${correctOperation} uygulanınca ${leftLabel} ${readableCorrectOperation} = ${seed.right} ${readableCorrectOperation} ve x = ${finalResult} kalır.`,
  };
}

function numberChoice(value: number, testId: string, correct: boolean, wrongReason = '', label = String(value)): EquationChoice {
  return {
    id: testId,
    label,
    value,
    correct,
    testId,
    wrongReason,
  };
}

function arrangeChoices(choices: [EquationChoice, EquationChoice, EquationChoice], correctIndex: number): EquationChoice[] {
  const [firstWrong, correct, secondWrong] = choices;

  if (correctIndex === 0) return [correct, firstWrong, secondWrong];
  if (correctIndex === 2) return [firstWrong, secondWrong, correct];
  return [firstWrong, correct, secondWrong];
}

function correctSlot(seedId: string, stage: string): number {
  const key = `${seedId}:${stage}`;
  return Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0) % 3;
}

function normalizeMissionSetIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return ((Math.trunc(index) % missionSets.length) + missionSets.length) % missionSets.length;
}

export const initialFeedback: Feedback = {
  tone: 'info',
  title: 'AstroBot hazır',
  body: 'Büyük denklem terazisinde parlayan parçaya dokun. Yanlış seçimde hangi kuralın bozulduğunu hemen söyleyeceğim.',
};
