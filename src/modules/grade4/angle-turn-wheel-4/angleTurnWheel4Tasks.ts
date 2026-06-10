export type AngleTaskKind = 'rotation' | 'tool' | 'classify';

export interface AngleTurnTask {
  id: string;
  kind: AngleTaskKind;
  title: string;
  prompt: string;
  angle: number;
  chips: string[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
}

export const ANGLE_TURN_ATOMS = [
  { id: 'MAT.4.3.5.1', label: 'Açıyı dönme miktarı olarak görür.' },
  { id: 'MAT.4.3.6.1', label: 'İletkiyi doğru yerleştirme fikrini tanır.' },
  { id: 'MAT.4.3.7.1', label: 'Dik açıyı 90 derece olarak sınıflandırır.' },
  { id: 'MAT.4.3.7.2', label: 'Dar açıyı 90 dereceden küçük olarak sınıflandırır.' },
  { id: 'MAT.4.3.7.3', label: 'Geniş açıyı 90 dereceden büyük olarak sınıflandırır.' },
];

export function createAngleTurnTasks(): AngleTurnTask[] {
  return [
    createRotationTask(),
    createToolTask(),
    createRightTask(),
    createAcuteTask(),
    createObtuseTask(),
  ];
}

function createRotationTask(): AngleTurnTask {
  const angle = randomItem([35, 50, 65, 75]);
  return {
    id: `rotation-${angle}`,
    kind: 'rotation',
    title: 'Kapı döndü',
    prompt: 'Bu modelde açı neyi gösterir?',
    angle,
    chips: [`Kapı ${angle} derece döndü`, 'Menteşe sabit', 'Kol hareket etti'],
    choices: shuffle(['Dönme miktarı', 'Kapının rengi', 'Kolun uzunluğu']),
    answer: 'Dönme miktarı',
    hint: 'Menteşe sabit kalır; hareket eden kolun dönüşü açıyı gösterir.',
    successText: 'Açıyı dönme olarak doğru okudun.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.3.5.1'],
  };
}

function createToolTask(): AngleTurnTask {
  const angle = randomItem([40, 70, 115, 135]);
  return {
    id: `tool-${angle}`,
    kind: 'tool',
    title: 'İletkiyi yerleştir',
    prompt: 'İletkiyi doğru ölçmek için nereye koyarsın?',
    angle,
    chips: ['Merkez noktası', 'Menteşe', '0 çizgisi tabanda'],
    choices: shuffle(['Merkez menteşeye gelir', 'İletki uca konur', 'İletki ters çevrilir']),
    answer: 'Merkez menteşeye gelir',
    hint: 'İletkinin merkezi açının köşe noktasına, yani menteşeye gelir.',
    successText: 'İletki merkezi doğru yere oturdu.',
    accent: '#B388FF',
    atomIds: ['MAT.4.3.6.1'],
  };
}

function createRightTask(): AngleTurnTask {
  return {
    id: 'right-90',
    kind: 'classify',
    title: 'Tam köşeyi seç',
    prompt: '90 derece olan bu açı hangi türdür?',
    angle: 90,
    chips: ['90 derece', 'L gibi köşe', 'Tam dik durur'],
    choices: shuffle(['Dik açı', 'Dar açı', 'Geniş açı']),
    answer: 'Dik açı',
    hint: '90 derece tam dik açı demektir.',
    successText: 'Dik açıyı doğru sınıflandırdın.',
    accent: '#34D399',
    atomIds: ['MAT.4.3.7.1'],
  };
}

function createAcuteTask(): AngleTurnTask {
  const angle = randomItem([25, 40, 55, 70]);
  return {
    id: `acute-${angle}`,
    kind: 'classify',
    title: 'Dike ulaşmadı',
    prompt: `${angle} derece olan açı hangi türdür?`,
    angle,
    chips: [`${angle} derece`, '90 dereceden küçük', 'Dike ulaşmadı'],
    choices: shuffle(['Dar açı', 'Dik açı', 'Geniş açı']),
    answer: 'Dar açı',
    hint: '90 dereceden küçük açılar dar açıdır.',
    successText: 'Dar açıyı doğru yakaladın.',
    accent: '#FFB020',
    atomIds: ['MAT.4.3.7.2'],
  };
}

function createObtuseTask(): AngleTurnTask {
  const angle = randomItem([110, 125, 140, 155]);
  return {
    id: `obtuse-${angle}`,
    kind: 'classify',
    title: '90 dereceyi geçti',
    prompt: `${angle} derece olan açı hangi türdür?`,
    angle,
    chips: [`${angle} derece`, '90 dereceden büyük', '90 dereceyi geçti'],
    choices: shuffle(['Geniş açı', 'Dik açı', 'Dar açı']),
    answer: 'Geniş açı',
    hint: '90 dereceden büyük açılar geniş açıdır.',
    successText: 'Geniş açıyı doğru seçtin.',
    accent: '#FB7185',
    atomIds: ['MAT.4.3.7.3'],
  };
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
