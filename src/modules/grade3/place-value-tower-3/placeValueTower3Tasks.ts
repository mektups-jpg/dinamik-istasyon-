export type PlaceValueTaskMode = 'read' | 'bundle' | 'decompose';

export interface PlaceValueTask {
  id: string;
  mode: PlaceValueTaskMode;
  title: string;
  prompt: string;
  value: number;
  hundreds: number;
  tens: number;
  ones: number;
  answer: string;
  choices: string[];
  atomIds: string[];
  successText: string;
  hint: string;
}

interface PlaceValueTemplate extends Omit<PlaceValueTask, 'choices'> {
  distractors: string[];
}

const TASK_GROUPS: PlaceValueTemplate[][] = [
  [
    {
      id: 'read-246',
      mode: 'read',
      title: 'Kuledeki sayıyı oku',
      prompt: 'Yüzlük, onluk ve birlikleri say. Doğru sayı kartına dokun.',
      value: 246,
      hundreds: 2,
      tens: 4,
      ones: 6,
      answer: '246',
      distractors: ['264', '206'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '246 doğru. 2 yüzlük, 4 onluk ve 6 birlik birlikte 246 eder.',
      hint: 'Önce yüzlükleri, sonra onlukları, en son birlikleri oku.',
    },
    {
      id: 'read-315',
      mode: 'read',
      title: 'Kuledeki sayıyı oku',
      prompt: 'Yüzlük, onluk ve birlikleri say. Doğru sayı kartına dokun.',
      value: 315,
      hundreds: 3,
      tens: 1,
      ones: 5,
      answer: '315',
      distractors: ['351', '305'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '315 doğru. 3 yüzlük, 1 onluk ve 5 birlik birlikte 315 eder.',
      hint: 'Yüzlük basamağı en soldaki büyük basamaktır.',
    },
    {
      id: 'read-628',
      mode: 'read',
      title: 'Kuledeki sayıyı oku',
      prompt: 'Yüzlük, onluk ve birlikleri say. Doğru sayı kartına dokun.',
      value: 628,
      hundreds: 6,
      tens: 2,
      ones: 8,
      answer: '628',
      distractors: ['682', '608'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '628 doğru. 6 yüzlük, 2 onluk ve 8 birlik birlikte 628 eder.',
      hint: 'Onluk sayısı ortadaki basamağı verir.',
    },
  ],
  [
    {
      id: 'zero-ten-507',
      mode: 'read',
      title: 'Boş onluğu fark et',
      prompt: 'Onluk katında hiç çubuk yok. Bu sayıyı doğru oku.',
      value: 507,
      hundreds: 5,
      tens: 0,
      ones: 7,
      answer: '507',
      distractors: ['570', '57'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '507 doğru. Onluk yoksa ortadaki basamak 0 olur.',
      hint: 'Onluk çubuğu yoksa sayının ortasında 0 durur.',
    },
    {
      id: 'zero-one-360',
      mode: 'read',
      title: 'Boş birliği fark et',
      prompt: 'Birlik katında hiç küp yok. Bu sayıyı doğru oku.',
      value: 360,
      hundreds: 3,
      tens: 6,
      ones: 0,
      answer: '360',
      distractors: ['306', '36'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '360 doğru. Birlik yoksa son basamak 0 olur.',
      hint: 'Birlik kutusu boşsa son basamak 0 olmalı.',
    },
    {
      id: 'zero-ten-804',
      mode: 'read',
      title: 'Boş onluğu fark et',
      prompt: 'Onluk katında hiç çubuk yok. Bu sayıyı doğru oku.',
      value: 804,
      hundreds: 8,
      tens: 0,
      ones: 4,
      answer: '804',
      distractors: ['840', '84'],
      atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.2'],
      successText: '804 doğru. 8 yüzlük, 0 onluk ve 4 birlik böyle yazılır.',
      hint: 'Boş onluk basamağını 0 ile göster.',
    },
  ],
  [
    {
      id: 'bundle-100',
      mode: 'bundle',
      title: 'On onluğu birleştir',
      prompt: '10 onluk çubuğu bir araya gelince hangi sayı olur?',
      value: 100,
      hundreds: 0,
      tens: 10,
      ones: 0,
      answer: '100',
      distractors: ['10', '110'],
      atomIds: ['MAT.3.1.2.1'],
      successText: 'Evet. 10 onluk birleşince 1 yüzlük, yani 100 olur.',
      hint: '10 tane onluk çubuğunu tek büyük yüzlük plaka gibi düşün.',
    },
    {
      id: 'bundle-105',
      mode: 'bundle',
      title: 'On onluğu birleştir',
      prompt: '10 onluk ve 5 birlik birlikte hangi sayı olur?',
      value: 105,
      hundreds: 0,
      tens: 10,
      ones: 5,
      answer: '105',
      distractors: ['15', '150'],
      atomIds: ['MAT.3.1.2.1', 'MAT.3.1.2.3'],
      successText: 'Doğru. 10 onluk 100 eder; 5 birlik eklenince 105 olur.',
      hint: '10 onluğu önce 100 yap, sonra birlikleri ekle.',
    },
    {
      id: 'bundle-120',
      mode: 'bundle',
      title: 'On onluğu birleştir',
      prompt: '10 onluk ve 2 onluk daha birlikte hangi sayı olur?',
      value: 120,
      hundreds: 0,
      tens: 12,
      ones: 0,
      answer: '120',
      distractors: ['12', '102'],
      atomIds: ['MAT.3.1.2.1', 'MAT.3.1.2.3'],
      successText: '120 doğru. 10 onluk 100 eder; 2 onluk daha 20 ekler.',
      hint: 'İlk 10 onluğu 100 yap, kalan onlukları üstüne ekle.',
    },
  ],
  [
    {
      id: 'decompose-738',
      mode: 'decompose',
      title: 'Sayıyı parçalara ayır',
      prompt: '738 sayısı hangi yüzlük, onluk ve birlikten oluşur?',
      value: 738,
      hundreds: 7,
      tens: 3,
      ones: 8,
      answer: '7 yüzlük + 3 onluk + 8 birlik',
      distractors: ['7 yüzlük + 8 onluk + 3 birlik', '3 yüzlük + 7 onluk + 8 birlik'],
      atomIds: ['MAT.3.1.2.2', 'MAT.3.1.2.3'],
      successText: '738 doğru parçalandı: 7 yüzlük, 3 onluk ve 8 birlik.',
      hint: '738 sayısında 7 yüzler, 3 onlar, 8 birler basamağındadır.',
    },
    {
      id: 'decompose-492',
      mode: 'decompose',
      title: 'Sayıyı parçalara ayır',
      prompt: '492 sayısı hangi yüzlük, onluk ve birlikten oluşur?',
      value: 492,
      hundreds: 4,
      tens: 9,
      ones: 2,
      answer: '4 yüzlük + 9 onluk + 2 birlik',
      distractors: ['9 yüzlük + 4 onluk + 2 birlik', '4 yüzlük + 2 onluk + 9 birlik'],
      atomIds: ['MAT.3.1.2.2', 'MAT.3.1.2.3'],
      successText: '492 doğru parçalandı: 4 yüzlük, 9 onluk ve 2 birlik.',
      hint: 'Basamakları soldan sağa yüzlük, onluk, birlik diye oku.',
    },
    {
      id: 'decompose-650',
      mode: 'decompose',
      title: 'Sayıyı parçalara ayır',
      prompt: '650 sayısı hangi yüzlük, onluk ve birlikten oluşur?',
      value: 650,
      hundreds: 6,
      tens: 5,
      ones: 0,
      answer: '6 yüzlük + 5 onluk + 0 birlik',
      distractors: ['6 yüzlük + 0 onluk + 5 birlik', '5 yüzlük + 6 onluk + 0 birlik'],
      atomIds: ['MAT.3.1.2.2', 'MAT.3.1.2.3'],
      successText: '650 doğru parçalandı: 6 yüzlük, 5 onluk ve 0 birlik.',
      hint: 'Sondaki 0, birlik olmadığını gösterir.',
    },
  ],
];

export const PLACE_VALUE_ATOMS = [
  { id: 'MAT.3.1.1.1', label: "1000'e kadar blok/nesne sayısını görsel olarak tanır." },
  { id: 'MAT.3.1.1.2', label: "1000'e kadar çokluğu doğru sayı sembolüyle eşleştirir." },
  { id: 'MAT.3.1.2.1', label: '10 adet onluk bloğun 1 yüzlük blok ettiğini birleştirerek ispatlar.' },
  { id: 'MAT.3.1.2.2', label: 'Üç basamaklı sayının yüzler basamağını dijital kümelerle gruplar.' },
  { id: 'MAT.3.1.2.3', label: 'Üç basamaklı sayıyı yüzlük, onluk ve birlik olarak parçalarına ayırır.' },
];

export function createPlaceValueTasks(previousTasks: PlaceValueTask[] = []): PlaceValueTask[] {
  const previousKey = tasksKey(previousTasks);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const slots = createAnswerSlots(TASK_GROUPS.length);
    const tasks = TASK_GROUPS.map((group, index) => {
      const template = group[randomInt(0, group.length - 1)];
      return withChoices(template, slots[index]);
    });

    if (tasksKey(tasks) !== previousKey) return tasks;
  }

  return TASK_GROUPS.map((group, index) => withChoices(group[index % group.length], index % 3));
}

function withChoices(template: PlaceValueTemplate, answerSlot: number): PlaceValueTask {
  const choices = [...template.distractors];
  choices.splice(answerSlot % 3, 0, template.answer);

  return {
    ...template,
    choices,
  };
}

function createAnswerSlots(count: number): number[] {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slots = Array.from({ length: count }, (_, index) => index % 3);
    const shuffled = shuffle(slots);
    if (shuffled.join(',') !== slots.join(',')) return shuffled;
  }

  return [1, 2, 0, 1].slice(0, count);
}

function tasksKey(tasks: PlaceValueTask[]): string {
  return tasks.map((task) => task.id).join('|');
}

function shuffle(values: number[]): number[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
