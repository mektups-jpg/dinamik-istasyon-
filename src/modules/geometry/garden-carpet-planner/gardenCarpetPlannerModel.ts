export type PlannerMission = {
  id: string;
  atomId: 'MAT.5.4.4.1' | 'MAT.5.4.4.2';
  title: string;
  mode: 'fence' | 'area';
  width: number;
  height: number;
  scenario: string;
  prompt: string;
  targetLabel: string;
  correctAnswer: number;
  unit: string;
  options: number[];
  success: string;
  error: string;
};

export const PLANNER_ATOMS = ['MAT.5.4.4.1', 'MAT.5.4.4.2'] as const;

type FencePreset = {
  id: string;
  title: string;
  place: string;
  width: number;
  height: number;
};

type GatePreset = FencePreset & {
  gate: number;
};

const fencePresets: FencePreset[] = [
  { id: 'school-yard', title: 'Oyun alanına çit', place: 'Okul bahçesindeki oyun alanı', width: 8, height: 5 },
  { id: 'sport-corner', title: 'Spor köşesine çit', place: 'Spor köşesi', width: 9, height: 4 },
  { id: 'class-garden', title: 'Sınıf bahçesine tel', place: 'Sınıf bahçesi', width: 7, height: 6 },
  { id: 'mini-field', title: 'Mini sahaya çit', place: 'Mini saha', width: 10, height: 5 },
];

const areaPresets: FencePreset[] = [
  { id: 'reading-corner', title: 'Okuma köşesine halı', place: 'Kütüphane okuma köşesi', width: 6, height: 4 },
  { id: 'art-floor', title: 'Resim alanına halı', place: 'Resim etkinlik alanı', width: 7, height: 5 },
  { id: 'game-mat', title: 'Oyun matı zemini', place: 'Oyun matı alanı', width: 8, height: 3 },
  { id: 'lab-carpet', title: 'Atölyeye kaplama', place: 'Matematik atölyesi', width: 9, height: 4 },
];

const gatePresets: GatePreset[] = [
  { id: 'garden-gate', title: 'Kapılı bahçe teli', place: 'Bahçe', width: 10, height: 4, gate: 2 },
  { id: 'park-gate', title: 'Park kapısı boşluğu', place: 'Park alanı', width: 9, height: 6, gate: 3 },
  { id: 'field-gate', title: 'Saha giriş boşluğu', place: 'Saha', width: 11, height: 5, gate: 2 },
  { id: 'yard-gate', title: 'Avlu kapısı boşluğu', place: 'Avlu', width: 8, height: 7, gate: 2 },
];

const soilPresets: FencePreset[] = [
  { id: 'flower-bed', title: 'Çiçekliğe toprak', place: 'Parktaki çiçeklik', width: 7, height: 3 },
  { id: 'seed-bed', title: 'Fide yatağına toprak', place: 'Okul fide yatağı', width: 8, height: 4 },
  { id: 'grass-patch', title: 'Çim alanı kapla', place: 'Çim alan', width: 9, height: 5 },
  { id: 'sand-pit', title: 'Kum alanını doldur', place: 'Kum oyun alanı', width: 6, height: 5 },
];

export function createPlannerMissions(): PlannerMission[] {
  const fence = pick(fencePresets);
  const carpet = pick(areaPresets);
  const gate = pick(gatePresets);
  const soil = pick(soilPresets);

  const fencePerimeter = 2 * (fence.width + fence.height);
  const carpetArea = carpet.width * carpet.height;
  const gatePerimeter = 2 * (gate.width + gate.height);
  const gateAnswer = gatePerimeter - gate.gate;
  const soilArea = soil.width * soil.height;

  return [
    {
      id: `${fence.id}-${fence.width}x${fence.height}`,
      atomId: 'MAT.5.4.4.1',
      title: fence.title,
      mode: 'fence',
      width: fence.width,
      height: fence.height,
      scenario: `${fence.place} ${fence.width} m x ${fence.height} m.`,
      prompt: 'Çit tüm dış kenarı dolaşacak. Kaç metre çit gerekir?',
      targetLabel: 'Dış çizgiyi ölç',
      correctAnswer: fencePerimeter,
      unit: 'm çit',
      options: buildOptions(fencePerimeter, [fence.width + fence.height, fence.width * fence.height]),
      success: `Doğru: çevre ${fence.width} + ${fence.height} + ${fence.width} + ${fence.height} = ${fencePerimeter} metredir.`,
      error: 'Çit yalnız iç alanı kaplamaz; dış kenarların hepsi toplanmalı.',
    },
    {
      id: `${carpet.id}-${carpet.width}x${carpet.height}`,
      atomId: 'MAT.5.4.4.2',
      title: carpet.title,
      mode: 'area',
      width: carpet.width,
      height: carpet.height,
      scenario: `${carpet.place} ${carpet.width} m x ${carpet.height} m.`,
      prompt: 'Zemini kaplamak için kaç metrekare halı gerekir?',
      targetLabel: 'İç kareleri say',
      correctAnswer: carpetArea,
      unit: 'm² halı',
      options: buildOptions(carpetArea, [carpet.width + carpet.height, 2 * (carpet.width + carpet.height)]),
      success: `Doğru: alan ${carpet.width} x ${carpet.height} = ${carpetArea} metrekaredir.`,
      error: 'Halı zeminin içini kaplar; kenarları toplamak yerine uzunluk ile genişliği çarp.',
    },
    {
      id: `${gate.id}-${gate.width}x${gate.height}-gate-${gate.gate}`,
      atomId: 'MAT.5.4.4.1',
      title: gate.title,
      mode: 'fence',
      width: gate.width,
      height: gate.height,
      scenario: `${gate.place} ${gate.width} m x ${gate.height} m; ${gate.gate} m kapı kısmı tel ile kapanmayacak.`,
      prompt: 'Kapı boşluğu çıkarılınca kaç metre tel gerekir?',
      targetLabel: 'Çevreden kapıyı çıkar',
      correctAnswer: gateAnswer,
      unit: 'm tel',
      options: buildOptions(gateAnswer, [gatePerimeter, gateAnswer - gate.gate]),
      success: `Doğru: çevre ${gatePerimeter} m, kapı ${gate.gate} m; gereken tel ${gateAnswer} m.`,
      error: 'Önce tüm çevreyi bul, sonra kapı boşluğunu telden çıkar.',
    },
    {
      id: `${soil.id}-${soil.width}x${soil.height}`,
      atomId: 'MAT.5.4.4.2',
      title: soil.title,
      mode: 'area',
      width: soil.width,
      height: soil.height,
      scenario: `${soil.place} ${soil.width} m x ${soil.height} m olacak.`,
      prompt: 'Toprak serilecek iç alan kaç metrekaredir?',
      targetLabel: 'Zemini kapla',
      correctAnswer: soilArea,
      unit: 'm² toprak',
      options: buildOptions(soilArea, [soil.width + soil.height, 2 * (soil.width + soil.height)]),
      success: `Doğru: iç alan ${soil.width} x ${soil.height} = ${soilArea} metrekaredir.`,
      error: 'Toprak iç bölgeyi kaplar; yalnız kenar uzunluklarını toplamak alanı vermez.',
    },
  ];
}

export function areaOf(mission: PlannerMission) {
  return mission.width * mission.height;
}

export function perimeterOf(mission: PlannerMission) {
  return 2 * (mission.width + mission.height);
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildOptions(correct: number, distractors: number[]) {
  const values = [correct, ...distractors].filter((value) => value > 0);
  const uniqueValues = [...new Set(values)];
  let next = correct + 3;
  while (uniqueValues.length < 3) {
    if (!uniqueValues.includes(next)) uniqueValues.push(next);
    next += 2;
  }
  return shuffleNumbers(uniqueValues.slice(0, 3));
}

function shuffleNumbers(values: number[]) {
  return [...values].sort(() => Math.random() - 0.5);
}
