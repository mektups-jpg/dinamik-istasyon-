export const MODULE_ID = 'derivative-nonexistent-alarm';

export const ATOM_IDS = [
  'MAT.12.2.4.3',
  'MAT.12.2.4.4',
] as const;

export const TEST_ID_CONTRACT = [
  'derivative-nonexistent-alarm-scene',
  'derivative-nonexistent-alarm-manipulator',
  'derivative-nonexistent-alarm-corner',
  'derivative-nonexistent-alarm-gap',
  'derivative-nonexistent-alarm-check',
  'derivative-nonexistent-alarm-feedback',
  'derivative-nonexistent-alarm-reset',
] as const;

export type AlarmTool = 'corner' | 'gap';
export type AlarmMode = 'corner' | 'gap';

export interface AlarmMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  mode: AlarmMode;
  expectedTool: AlarmTool;
  sceneTitle: string;
  sceneSummary: string;
  badge: string;
  success: string;
  proof: string;
  failure: Record<AlarmTool, string>;
}

export const alarmTools: Record<AlarmTool, { label: string; short: string; description: string; hint: string; accent: string }> = {
  corner: {
    label: 'Sivri Uç',
    short: 'V',
    description: 'Soldan ve sağdan eğim farklıysa türev yoktur.',
    hint: 'Sivri uçta soldan ve sağdan gelen eğimler aynı teğette birleşmez; bu yüzden türev yoktur.',
    accent: '#FBBF24',
  },
  gap: {
    label: 'Kopuk Grafik',
    short: '!',
    description: 'Grafik kesintisiz değilse teğet kurulamaz.',
    hint: 'Fonksiyon grafiği kopuksa aynı noktada teğet kurulamaz; süreksizlikte türev yoktur.',
    accent: '#FF4FA3',
  },
};

export const alarmMissions: AlarmMission[] = [
  {
    id: 'sharp-corner',
    title: 'Sivri uçta türev yok',
    prompt: 'Grafikte x=2 noktasında sivri uç var. Soldan ve sağdan gelen eğimler aynı teğette birleşiyor mu?',
    atomId: 'MAT.12.2.4.3',
    mode: 'corner',
    expectedTool: 'corner',
    sceneTitle: 'Sivri uç istasyonu',
    sceneSummary: "Türev için x=2'de tek teğet yönü gerekir; iki farklı yön varsa türev yoktur.",
    badge: 'tek teğet yok',
    success: 'Doğru: sivri uçta soldan ve sağdan eğim farklıdır; o noktada türev yoktur.',
    proof: 'Türev için noktada tek bir teğet yönü gerekir. Sivri uç iki farklı yön verdiği için alarm açıktır.',
    failure: {
      corner: 'Sivri uç alarmı doğru hedef: sol ve sağ teğet kanatları aynı yönü vermiyor.',
      gap: 'Burada grafik kopuk değil; problem, sivri uçta iki farklı teğet yönü oluşması.',
    },
  },
  {
    id: 'broken-track',
    title: 'Kopuk grafikte türev yok',
    prompt: 'Grafik x=2 çevresinde kopuyor. Teğet kurulmadan önce fonksiyon orada kesintisiz mi?',
    atomId: 'MAT.12.2.4.4',
    mode: 'gap',
    expectedTool: 'gap',
    sceneTitle: 'Kopuk pist istasyonu',
    sceneSummary: "Türev için önce x=2'de kesintisiz grafik gerekir; kopukluk varsa türev yoktur.",
    badge: 'pist kopuk',
    success: 'Doğru: grafikte kopukluk var; fonksiyon o noktada kesintisiz olmadığı için türev yoktur.',
    proof: 'Türevden önce fonksiyonun noktada tek ve kesintisiz davranması gerekir. Kopuk pist alarmı bu eksikliği gösterir.',
    failure: {
      corner: 'Burada sivri uç değil, gerçek bir kopukluk var; grafik aynı noktada devam etmiyor.',
      gap: 'Kopuk pist doğru hedef: süreksizlik varsa teğet kızağı kurulamaz.',
    },
  },
];

export function scanStartForMission(mode: AlarmMode) {
  return mode === 'corner' ? 0.5 : 0.42;
}
