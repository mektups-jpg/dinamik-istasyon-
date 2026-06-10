export const MODULE_ID = 'optimization-terrain';

export const ATOM_IDS = [
  'MAT.12.2.6.1',
  'MAT.12.2.6.2',
  'MAT.12.2.6.3',
  'MAT.12.2.6.4',
  'MAT.12.2.6.5',
] as const;

export const TEST_ID_CONTRACT = [
  'optimization-terrain-scene',
  'optimization-terrain-manipulator',
  'optimization-terrain-increasing',
  'optimization-terrain-decreasing',
  'optimization-terrain-extremum',
  'optimization-terrain-peak-point',
  'optimization-terrain-valley-point',
  'optimization-terrain-max-volume',
  'optimization-terrain-min-cost',
  'optimization-terrain-check',
  'optimization-terrain-feedback',
  'optimization-terrain-reset',
] as const;

export type OptimizationTool = 'increasing' | 'decreasing' | 'extremum' | 'max-volume' | 'min-cost';
export type TerrainMode = 'climb' | 'descent' | 'peak' | 'capacity' | 'cost';

export interface TerrainPoint {
  x: number;
  y: number;
}

export interface OptimizationMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  mode: TerrainMode;
  expectedTool: OptimizationTool;
  sensor: string;
  formula: string;
  point: TerrainPoint;
  output: string;
  badge: string;
  mechanism: string;
  success: string;
  proof: string;
  failure: Record<OptimizationTool, string>;
}

export const toolCopy: Record<OptimizationTool, { label: string; short: string; hint: string; accent: string }> = {
  increasing: {
    label: 'Artan Bölge',
    short: '+',
    hint: 'Araç sağa giderken yükselme izini takip eder; karar testte kilitlenir.',
    accent: '#00FF88',
  },
  decreasing: {
    label: 'Azalan Bölge',
    short: '-',
    hint: 'Araç sağa giderken iniş frenleri hazırlanır; karar testte kilitlenir.',
    accent: '#FF4FA3',
  },
  extremum: {
    label: 'Tepe + Çukur',
    short: '0',
    hint: 'Tepe ve çukur adayları aynı sıfır eğim ailesinde görünür; karar testte kilitlenir.',
    accent: '#FBBF24',
  },
  'max-volume': {
    label: 'Maks Hacim',
    short: 'V↑',
    hint: 'Hacim tepesi en yüksek değeri işaretlediğinde maksimum karar testte kilitlenir.',
    accent: '#00E5FF',
  },
  'min-cost': {
    label: 'Min Maliyet',
    short: 'C↓',
    hint: 'Maliyet eğrisi vadinin dibine indiğinde en düşük kayıp noktası kilitlenir.',
    accent: '#B388FF',
  },
};

export const optimizationMissions: OptimizationMission[] = [
  {
    id: 'positive-derivative',
    title: 'Tırmanış bölgesini yakala',
    prompt: "Araç sağa doğru ilerlerken pist yükseliyor. f'(x) işareti bu bölgede ne söyler?",
    atomId: 'MAT.12.2.6.1',
    mode: 'climb',
    expectedTool: 'increasing',
    sensor: "eğim sensörü: +",
    formula: "f'(x) > 0 -> f artar",
    point: { x: 246, y: 158 },
    output: 'Artan',
    badge: 'Yükseliş',
    mechanism: 'Yeşil tırmanış okları fonksiyon değerinin x ile birlikte arttığını gösterir.',
    success: "Doğru: birinci türev pozitifse araç sağa giderken yükselir; fonksiyon artandır.",
    proof: "Pozitif türev, grafiğin o aralıkta yukarı yönlü hareket ettiğini gösterir.",
    failure: {
      increasing: 'Artan bölge doğru hedef: pozitif türev yükseliş üretir.',
      decreasing: 'Pist aşağı inmiyor; pembe iniş freni bu bölgede yanlış karar olur.',
      extremum: 'Eğim sıfır değil; araç düzleşmiş tepe/çukur kapısında değil.',
      'max-volume': 'Bu görev gerçek hacim kısıtı değil; önce artan bölgeyi oku.',
      'min-cost': 'Maliyet vadisi yok; burada yalnız pozitif türev işareti okunuyor.',
    },
  },
  {
    id: 'negative-derivative',
    title: 'İniş bölgesini yakala',
    prompt: "Araç sağa gittikçe yükseklik azalıyor. f'(x) işareti fonksiyonun hangi davranışını verir?",
    atomId: 'MAT.12.2.6.2',
    mode: 'descent',
    expectedTool: 'decreasing',
    sensor: "eğim sensörü: -",
    formula: "f'(x) < 0 -> f azalır",
    point: { x: 502, y: 220 },
    output: 'Azalan',
    badge: 'İniş',
    mechanism: 'Pembe fren ışıkları x artarken fonksiyon değerinin düştüğünü gösterir.',
    success: "Doğru: birinci türev negatifse araç sağa giderken iner; fonksiyon azalır.",
    proof: "Negatif türev, grafiğin o aralıkta aşağı yönlü hareket ettiğini gösterir.",
    failure: {
      increasing: 'Yeşil tırmanış oku ters yönde kalır; bu pistte araç aşağı iniyor.',
      decreasing: 'Azalan bölge doğru hedef: negatif türev iniş üretir.',
      extremum: 'Eğim sıfır kapısında değiliz; hareket hâlâ aşağı yönlü.',
      'max-volume': 'Hacim tepesi değil; bu görev türev işaretinden azalmayı okumak.',
      'min-cost': 'Maliyet problemi kurulmadı; bu bir azalan aralık teşhisi.',
    },
  },
  {
    id: 'extremum-gate',
    title: 'Tepe ve çukur kapılarını aç',
    prompt: "Araç tepe ve çukurda yataylaşıyor. f'(x)=0 kapısı neyi yakalar?",
    atomId: 'MAT.12.2.6.3',
    mode: 'peak',
    expectedTool: 'extremum',
    sensor: "eğim sensörü: 0",
    formula: "f'(a)=0 -> ekstremum adayı",
    point: { x: 336, y: 100 },
    output: 'Ekstremum',
    badge: 'Tepe',
    mechanism: 'Altın sıfır kapıları hem tırmanıştan inişe geçen tepeyi hem de inişten çıkışa dönen çukuru işaretler.',
    success: "Doğru: türev sıfıra oturduğunda tepe veya çukur adayı yakalanır.",
    proof: "Ekstremum adaylarında teğet yataydır; ilk türev sıfıra eşitlenir.",
    failure: {
      increasing: 'Tepe ve çukurda sürekli artış yok; araç yön değiştirirken eğim yataylaşır.',
      decreasing: 'Tepe ve çukurda yalnız iniş yok; dönüş noktaları sıfır eğim kapısıdır.',
      extremum: "Tepe/Çukur kapısı doğru hedef: f'(a)=0 ekstremum adayını yakalar.",
      'max-volume': 'Bu görev soyut ekstremum teşhisi; gerçek hacim kutusu henüz devrede değil.',
      'min-cost': 'Bu bir maliyet vadisi problemi değil; grafikteki tepe/çukur sıfır eğimini oku.',
    },
  },
  {
    id: 'maximum-volume',
    title: 'Kapasite tepesini kilitle',
    prompt: 'Aynı malzemeyle yapılan kutu farklı açıklıklarda doluyor. En yüksek hacim nerede?',
    atomId: 'MAT.12.2.6.4',
    mode: 'capacity',
    expectedTool: 'max-volume',
    sensor: 'hacim sensörü: tepe',
    formula: "V'(x)=0 ve tepe -> maksimum hacim",
    point: { x: 500, y: 100 },
    output: 'Maksimum V',
    badge: 'Kapasite',
    mechanism: 'Mavi tepe işareti hacim eğrisindeki en yüksek dolum seviyesini gösteriyor.',
    success: 'Doğru: kısıtlı kutu probleminde hacim eğrisi tepe yaptığı noktada maksimum olur.',
    proof: "Gerçek optimizasyonda türev sıfır noktası, tepe kontrolüyle maksimum hacmi verir.",
    failure: {
      increasing: 'Kutunun hacmi yalnız artmıyor; tepeyi geçince kapasite düşer.',
      decreasing: 'Başlangıçta düşüş yok; karar tek bir iniş aralığı değil maksimum noktadır.',
      extremum: 'Sıfır eğim fikri doğruya yakın ama bu görev gerçek hacim tepesini kilitlemek.',
      'max-volume': 'Maksimum hacim doğru hedef: hacim tepesi en yüksek dolumu verir.',
      'min-cost': 'Bu maliyet değil; amaç kaybı azaltmak değil hacmi en büyütmek.',
    },
  },
  {
    id: 'minimum-cost',
    title: 'Maliyet vadisini bul',
    prompt: 'Üretim hattı fazla malzeme veya fazla işçilikte pahalılaşıyor. En düşük maliyet hangi noktada?',
    atomId: 'MAT.12.2.6.5',
    mode: 'cost',
    expectedTool: 'min-cost',
    sensor: 'maliyet sensörü: vadi',
    formula: "C'(x)=0 ve çukur -> minimum maliyet",
    point: { x: 500, y: 286 },
    output: 'Minimum C',
    badge: 'Tasarruf',
    mechanism: 'Mor maliyet vadisi en dip noktada kaybın en düşük seviyeye indiğini gösterir.',
    success: 'Doğru: maliyet eğrisi çukur yaptığı noktada minimum maliyet kararı verilir.',
    proof: "Gerçek optimizasyonda türev sıfır noktası, çukur kontrolüyle minimum maliyeti verir.",
    failure: {
      increasing: 'Maliyet yalnız artmıyor; önce düşüp sonra yükselen bir vadi var.',
      decreasing: 'Maliyet yalnız azalmıyor; vadinin dibinden sonra tekrar yükselir.',
      extremum: 'Sıfır eğim fikri gerekli ama bu görev özel olarak minimum maliyet vadisini ister.',
      'max-volume': 'Bu hacim tepesi değil; amaç hacmi büyütmek değil maliyeti azaltmak.',
      'min-cost': 'Minimum maliyet doğru hedef: çukur noktası en düşük kayıp kararını verir.',
    },
  },
];

export function isOptimizationCorrect(mission: OptimizationMission, tool: OptimizationTool | null) {
  return tool !== null && tool === mission.expectedTool;
}

export function previewOutput(tool: OptimizationTool) {
  const outputs: Record<OptimizationTool, string> = {
    increasing: 'yükseliş izi',
    decreasing: 'iniş izi',
    extremum: 'düz kapı',
    'max-volume': 'hacim tepesi',
    'min-cost': 'maliyet izi',
  };

  return outputs[tool];
}
