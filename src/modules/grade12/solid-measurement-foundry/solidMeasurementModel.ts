export const MODULE_ID = 'solid-measurement-foundry';

export const ATOM_IDS = [
  'MAT.12.4.1.1',
  'MAT.12.4.1.2',
  'MAT.12.4.1.3',
  'MAT.12.4.1.4',
  'MAT.12.4.1.5',
  'MAT.12.4.2.1',
  'MAT.12.4.2.2',
  'MAT.12.4.2.3',
  'MAT.12.4.2.4',
  'MAT.12.4.2.5',
] as const;

export const TEST_ID_CONTRACT = [
  'solid-measurement-foundry-scene',
  'solid-measurement-foundry-manipulator',
  'solid-measurement-foundry-prism',
  'solid-measurement-foundry-cylinder',
  'solid-measurement-foundry-pyramid',
  'solid-measurement-foundry-cone',
  'solid-measurement-foundry-sphere',
  'solid-measurement-foundry-volume',
  'solid-measurement-foundry-surface',
  'solid-measurement-foundry-check',
  'solid-measurement-foundry-feedback',
  'solid-measurement-foundry-reset',
] as const;

export type SolidKind = 'prism' | 'cylinder' | 'pyramid' | 'cone' | 'sphere';
export type MeasurementMode = 'volume' | 'surface';

export interface SolidMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  expectedSolid: SolidKind;
  expectedMode: MeasurementMode;
  formula: string;
  output: string;
  badge: string;
  mechanism: string;
  success: string;
  proof: string;
}

export const solidCopy: Record<SolidKind, { label: string; short: string; hint: string; accent: string }> = {
  prism: {
    label: 'Dik Prizma',
    short: 'prizma',
    hint: 'Prizmada taban katmanı yükseklik boyunca tekrar eder.',
    accent: '#00E5FF',
  },
  cylinder: {
    label: 'Silindir',
    short: 'silindir',
    hint: 'Silindirde daire tabanı yükseklik boyunca aynı kalınlıkta yükselir.',
    accent: '#00FF88',
  },
  pyramid: {
    label: 'Piramit',
    short: 'piramit',
    hint: 'Piramit tabandan tepeye daralır; aynı taban-yükseklik prizmasının üçte biri gibi düşünülür.',
    accent: '#FBBF24',
  },
  cone: {
    label: 'Koni',
    short: 'koni',
    hint: 'Koni daire tabandan tepeye daralır; silindir hacminin üçte biri ilişkisini taşır.',
    accent: '#B388FF',
  },
  sphere: {
    label: 'Küre',
    short: 'küre',
    hint: 'Kürede merkezden her yöne aynı yarıçap uzanır; hacim iç dolu çekirdektir.',
    accent: '#FF4FA3',
  },
};

export const modeCopy: Record<MeasurementMode, { label: string; short: string; hint: string; accent: string }> = {
  volume: {
    label: 'Hacim Sıvısı',
    short: 'iç dolum',
    hint: 'Hacim, cismin içinde kaplanan 3D boşluğu ölçer.',
    accent: '#00E5FF',
  },
  surface: {
    label: 'Alan Zırhı',
    short: 'dış kaplama',
    hint: 'Yüzey alanı, cismin dış kabuğunun kaplanacak toplam alanıdır.',
    accent: '#A3E635',
  },
};

export const solidMissions: SolidMission[] = [
  {
    id: 'prism-volume',
    title: 'Prizma dolum tankı',
    prompt: 'Taban aynen korunuyor ve yükseklik boyunca katman katman yükseliyor. İç hacmi hangi kurulum ölçer?',
    atomId: 'MAT.12.4.1.1',
    expectedSolid: 'prism',
    expectedMode: 'volume',
    formula: 'V = B · h',
    output: 'taban alanı x yükseklik',
    badge: 'Katman',
    mechanism: 'Prizma içi tabandan tavana mavi katmanlarla dolar; aynı taban alanı yükseklik boyunca tekrar eder.',
    success: 'Doğru: prizmanın hacmi taban alanının yükseklik boyunca tekrarlanmasıdır.',
    proof: 'Dik prizmada her yatay kesit aynı taban alanını verir; hacim B · h olur.',
  },
  {
    id: 'cylinder-volume',
    title: 'Silindir sıvı çekirdeği',
    prompt: 'Daire taban yukarı doğru aynı kalınlıkta uzuyor. Hangi iç dolum hacim argümanını gösterir?',
    atomId: 'MAT.12.4.1.2',
    expectedSolid: 'cylinder',
    expectedMode: 'volume',
    formula: 'V = πr²h',
    output: 'daire tabanı x yükseklik',
    badge: 'Daire Katman',
    mechanism: 'Silindir içinde daire tabanlı nanobot sıvısı yükselir; her kesit πr² tabanını korur.',
    success: 'Doğru: silindir hacmi daire taban alanının yükseklikle çarpılmasıdır.',
    proof: 'Aynı daire tabanı h boyunca taşındığı için V = πr²h.',
  },
  {
    id: 'pyramid-volume',
    title: 'Piramit daralan hacim',
    prompt: 'Kare taban tepeye doğru küçülüyor. Hangi kurulum üçte bir hacim mantığını açar?',
    atomId: 'MAT.12.4.1.3',
    expectedSolid: 'pyramid',
    expectedMode: 'volume',
    formula: 'V = B · h / 3',
    output: 'daralan katmanlar',
    badge: '1/3',
    mechanism: 'Piramit iç dolumu tepeye yaklaşırken daralır; prizma dolumunun üçte biri sinyali yanar.',
    success: 'Doğru: piramitte katmanlar tepeye daraldığı için hacim B · h / 3 olur.',
    proof: 'Aynı taban ve yükseklikteki prizmanın üçte biri kadar hacim oluşur.',
  },
  {
    id: 'cone-volume',
    title: 'Koni akış hunisi',
    prompt: 'Daire taban tepe noktasına doğru kapanıyor. Hangi 3D dolum koni hacmini gösterir?',
    atomId: 'MAT.12.4.1.4',
    expectedSolid: 'cone',
    expectedMode: 'volume',
    formula: 'V = πr²h / 3',
    output: 'silindirin üçte biri',
    badge: 'Koni 1/3',
    mechanism: 'Koni içindeki sıvı daire tabandan tepeye doğru daralır; üçte bir oranı yanar.',
    success: 'Doğru: koni hacmi aynı taban ve yükseklikteki silindirin üçte biridir.',
    proof: 'Daire katmanları yukarı çıkarken küçüldüğü için V = πr²h / 3.',
  },
  {
    id: 'sphere-volume',
    title: 'Küre çekirdek dolumu',
    prompt: 'Merkezden her yöne yayılan iç dolu çekirdeğin hacmini hangi kurulum ölçer?',
    atomId: 'MAT.12.4.1.5',
    expectedSolid: 'sphere',
    expectedMode: 'volume',
    formula: 'V = 4/3πr³',
    output: 'iç çekirdek',
    badge: 'r³',
    mechanism: 'Kürenin iç çekirdeği merkezden dışa doğru parlar; yarıçap üç boyutta büyür.',
    success: 'Doğru: küre hacmi merkezden üç boyuta yayılan iç dolu bölgedir.',
    proof: 'Hacim yarıçapın küpüyle ölçeklenir: V = 4/3πr³.',
  },
  {
    id: 'prism-surface',
    title: 'Prizma dış zırhı',
    prompt: 'Bu kez iç boşluk değil, prizmanın tüm dış yüzlerini kaplayacak zırh aranıyor.',
    atomId: 'MAT.12.4.2.1',
    expectedSolid: 'prism',
    expectedMode: 'surface',
    formula: 'A = 2Tₐ + Yₐ',
    output: '6 yüz kaplama',
    badge: 'Zırh',
    mechanism: 'Prizmanın tüm dış yüzleri jelatin zırhla sarılır; iç hacim ışığı söner.',
    success: 'Doğru: yüzey alanı prizmanın dış yüzlerinin toplam kaplamasıdır.',
    proof: 'Prizmada iki taban ve yan yüzlerin tamamı dış kaplamaya katılır.',
  },
  {
    id: 'cylinder-surface',
    title: 'Silindir ambalaj bandı',
    prompt: 'Silindirin yan dikdörtgen bandı ve iki daire kapağı kaplanacak. Hangi ölçüm modu gerekir?',
    atomId: 'MAT.12.4.2.2',
    expectedSolid: 'cylinder',
    expectedMode: 'surface',
    formula: 'A = 2πr² + 2πrh',
    output: 'kapaklar + yan bant',
    badge: 'Ambalaj',
    mechanism: 'Silindirin yan yüzü yeşil ambalaj bandı, iki kapağı ayrı zırh diskleri olarak yanar.',
    success: 'Doğru: silindir yüzey alanı iki kapak ve yan dikdörtgen bandın toplamıdır.',
    proof: 'Kaplama iç hacmi değil dış yüzeyi sayar: 2πr² + 2πrh.',
  },
  {
    id: 'pyramid-surface',
    title: 'Piramit üçgen panelleri',
    prompt: 'Kare taban ve dört üçgen yan panel kaplanacak. Hangi dış zırh kurulumu doğru?',
    atomId: 'MAT.12.4.2.3',
    expectedSolid: 'pyramid',
    expectedMode: 'surface',
    formula: 'A = taban + üçgen yanlar',
    output: 'yan paneller',
    badge: 'Panel',
    mechanism: 'Piramit tabanı ve üçgen yan paneller ayrı ayrı zırh plakalarıyla vurgulanır.',
    success: 'Doğru: piramit yüzey alanı taban ve tüm üçgen yan yüzlerin toplamıdır.',
    proof: 'Yüzey alanında iç dolum değil, dıştaki her panel sayılır.',
  },
  {
    id: 'cone-surface',
    title: 'Koni dış kılıfı',
    prompt: 'Daire taban ve kıvrık yan kılıf kaplanacak. Hangi cisim ve mod bu ölçümü verir?',
    atomId: 'MAT.12.4.2.4',
    expectedSolid: 'cone',
    expectedMode: 'surface',
    formula: 'A = πr² + πrl',
    output: 'taban + yan kılıf',
    badge: 'Kılıf',
    mechanism: 'Koni tabanı ve eğik yan kılıf dış zırhla parlayarak kaplama alanını gösterir.',
    success: 'Doğru: koni yüzey alanı daire taban ve yan kılıf alanının toplamıdır.',
    proof: 'Koni kaplamasında iç hacim değil dış taban ve eğik yan yüzey ölçülür.',
  },
  {
    id: 'sphere-surface',
    title: 'Küre jelatin kabuğu',
    prompt: 'Kürenin içi değil, yalnız dış kabuğu jelatinle kaplanacak. Hangi ölçüm kilitlenir?',
    atomId: 'MAT.12.4.2.5',
    expectedSolid: 'sphere',
    expectedMode: 'surface',
    formula: 'A = 4πr²',
    output: 'dış kabuk',
    badge: '4πr²',
    mechanism: 'Kürenin yalnız dış zırhı yanar; iç çekirdek dolumu kapalı kalır.',
    success: 'Doğru: kürenin yüzey alanı dış kabuğun 4πr² kaplamasıdır.',
    proof: 'Yüzey alanı iki boyutlu dış kabuktur; bu yüzden r² ile ölçeklenir.',
  },
];

export function isSolidAnswerCorrect(
  mission: SolidMission,
  solid: SolidKind | null,
  mode: MeasurementMode | null,
) {
  return solid === mission.expectedSolid && mode === mission.expectedMode;
}

export function explainSolidMismatch(
  mission: SolidMission,
  solid: SolidKind | null,
  mode: MeasurementMode | null,
) {
  if (solid === null || mode === null) {
    return 'Önce bir cisim ve ölçüm modu seç: dökümhane neyi ölçtüğünü görmeden test edemez.';
  }

  if (solid !== mission.expectedSolid && mode !== mission.expectedMode) {
    return `İki sinyal de şaştı: görev ${solidCopy[mission.expectedSolid].label} için ${modeCopy[mission.expectedMode].label} istiyor.`;
  }

  if (solid !== mission.expectedSolid) {
    return `Cisim eşleşmedi: bu görev ${solidCopy[mission.expectedSolid].label} geometrisini arıyor; ${solidCopy[solid].label} farklı kesit davranışı verir.`;
  }

  return mission.expectedMode === 'volume'
    ? 'Mod yanlış: görev iç hacim dolumunu istiyor, dış zırh kaplamasını değil.'
    : 'Mod yanlış: görev dış yüzey alanı zırhını istiyor, iç hacim sıvısını değil.';
}
