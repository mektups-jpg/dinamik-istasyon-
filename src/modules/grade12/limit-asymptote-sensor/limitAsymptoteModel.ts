export const MODULE_ID = 'limit-asymptote-sensor';

export const ATOM_IDS = [
  'MAT.12.2.1.1',
  'MAT.12.2.1.2',
  'MAT.12.2.2.1',
  'MAT.12.2.2.2',
  'MAT.12.2.2.3',
] as const;

export const TEST_ID_CONTRACT = [
  'limit-asymptote-sensor-scene',
  'limit-asymptote-sensor-scene-visual',
  'limit-asymptote-sensor-manipulator',
  'limit-asymptote-sensor-two-sided',
  'limit-asymptote-sensor-local',
  'limit-asymptote-sensor-infinity',
  'limit-asymptote-sensor-factor',
  'limit-asymptote-sensor-check',
  'limit-asymptote-sensor-feedback',
  'limit-asymptote-sensor-reset',
] as const;

export type LimitTool = 'two-sided' | 'local' | 'infinity' | 'factor';
export type LimitSceneKind = 'approach' | 'infinity' | 'local' | 'factor';

export interface LimitMission {
  id: string;
  atomId: (typeof ATOM_IDS)[number];
  title: string;
  prompt: string;
  expression: string;
  relation: string;
  sceneKind: LimitSceneKind;
  expectedTool: LimitTool;
  gateLabel: string;
  leftSensor: string;
  rightSensor: string;
  resultLabel: string;
  resultBadge: string;
  success: string;
  proof: string;
  failure: Record<LimitTool, string>;
}

export const toolCopy: Record<LimitTool, { label: string; short: string; panelHint: string; hint: string; accent: string }> = {
  'two-sided': {
    label: 'Soldan + Sağdan',
    short: 'L/R',
    panelHint: 'grafikte iki taraf',
    hint: 'Soldan ve sağdan limit aynı yüksekliğe yaklaşıyor mu diye oku.',
    accent: '#00E5FF',
  },
  local: {
    label: 'Yerine Yaz',
    short: 'a',
    panelHint: 'x = a koy',
    hint: 'x yerine hedef değeri koyan giriş-çıkış makinesini çalıştır.',
    accent: '#00FF88',
  },
  infinity: {
    label: 'Sonsuzda Oku',
    short: '∞',
    panelHint: 'yatay asimptot',
    hint: 'Uzakta rotanın hangi yatay tünele oturduğunu izle.',
    accent: '#B388FF',
  },
  factor: {
    label: '0/0 Sadeleştir',
    short: '0/0',
    panelHint: 'pay/payda ortak',
    hint: 'Payı çarpanlara ayır; pay ve paydadaki aynı (x - 2) çarpanını sadeleştir.',
    accent: '#FBBF24',
  },
};

export const limitMissions: LimitMission[] = [
  {
    id: 'graph-two-sided',
    atomId: 'MAT.12.2.1.1',
    title: 'Grafik yaklaşma kapısı',
    prompt: 'x = 2 kapısına soldan ve sağdan yaklaş; iki limit grafikteki y = 4 çizgisinde birleşirse limit okunur.',
    expression: 'lim x->2 f(x)',
    relation: 'grafikten oku',
    sceneKind: 'approach',
    expectedTool: 'two-sided',
    gateLabel: 'x = 2',
    leftSensor: 'soldan -> 4',
    rightSensor: 'sağdan -> 4',
    resultLabel: 'iki taraf aynı y = 4 çizgisinde birleşiyor',
    resultBadge: '4',
    success: 'Doğru: sol ve sağ yaklaşım aynı yükseklikte birleştiği için limit 4 olur.',
    proof: 'Limit, f(2) noktası değil; x değerleri 2 kapısına yaklaşırken rotanın hedeflediği y değeridir.',
    failure: {
      'two-sided': 'Soldan + sağdan limit okuması doğru; iki yaklaşımı birlikte oku.',
      local: 'Bu görevde denklem verilmedi; grafik üzerindeki yaklaşımı okumalısın.',
      infinity: 'Sonsuz tünel değil, belirli x = 2 kapısına yerel yaklaşım soruluyor.',
      factor: 'Bu görevde 0/0 yok; çarpan sadeleştirme gerekmez.',
    },
  },
  {
    id: 'graph-infinity',
    atomId: 'MAT.12.2.1.2',
    title: 'Sonsuz asimptot tüneli',
    prompt: 'x sağa doğru sonsuza giderken rota hangi yatay tünele oturuyor?',
    expression: 'lim x->∞ f(x)',
    relation: 'asimptot eğilimi',
    sceneKind: 'infinity',
    expectedTool: 'infinity',
    gateLabel: '∞',
    leftSensor: 'uzak rota',
    rightSensor: 'y = 2 tüneli',
    resultLabel: 'rota yatay y = 2 asimptotuna yapışıyor',
    resultBadge: '2',
    success: 'Doğru: sonsuza giderken rota y = 2 tüneline oturur.',
    proof: 'Grafik çok uzağa gittikçe yeni bir kesişim aramaz; yaklaştığı yatay çizgi limit değeridir.',
    failure: {
      'two-sided': 'Burada belirli bir kapıya iki taraftan yaklaşmıyoruz; x sonsuza gidiyor.',
      local: 'Tek bir x değeri koymak sonsuzdaki davranışı göstermez.',
      infinity: 'Sonsuz tünel doğru; yatay asimptot çizgisini kilitle.',
      factor: 'Bu görevde 0/0 yok; çarpan kaldırma yapılmaz.',
    },
  },
  {
    id: 'algebra-local',
    atomId: 'MAT.12.2.2.1',
    title: 'Yerel cebir makinesi',
    prompt: 'x = 3 kapsülünü fonksiyon makinesinden geçir; çıkan değer limiti verir.',
    expression: 'lim x->3 (2x + 1)',
    relation: 'yerel hesap',
    sceneKind: 'local',
    expectedTool: 'local',
    gateLabel: 'x = 3',
    leftSensor: 'giriş 3',
    rightSensor: 'çıkış 7',
    resultLabel: '2 · 3 + 1 = 7',
    resultBadge: '7',
    success: 'Doğru: fonksiyon bu noktada güvenli olduğu için x = 3 yerine yazılır ve limit 7 olur.',
    proof: '2·3 + 1 = 7; bu görevde grafik deliği veya belirsizlik yoktur.',
    failure: {
      'two-sided': 'Soldan + sağdan limit fikri grafik için yararlı ama burada cebirsel hesap isteniyor.',
      local: 'Yerel hesap doğru; x = 3 girişini makineden geçir.',
      infinity: 'Sonsuza gitmiyoruz; x belirli bir değere yaklaşıyor.',
      factor: '0/0 oluşmuyor; çarpan sadeleştirme gereksiz.',
    },
  },
  {
    id: 'algebra-infinity',
    atomId: 'MAT.12.2.2.2',
    title: 'Katsayı asimptot tüneli',
    prompt: 'En büyük derece katsayılarını oku; sonsuzda oran hangi yatay tünele yaklaşır?',
    expression: 'lim x->∞ (2x + 1)/(x + 4)',
    relation: 'sonsuz limit',
    sceneKind: 'infinity',
    expectedTool: 'infinity',
    gateLabel: '∞',
    leftSensor: '2x',
    rightSensor: '1x',
    resultLabel: 'baş katsayı oranı 2/1 = 2',
    resultBadge: '2',
    success: 'Doğru: en büyük derece terimleri 2x ve x olduğundan sonsuzdaki limit 2 olur.',
    proof: 'x büyüdükçe sabitler etkisini kaybeder; rota 2 katsayı tüneline oturur.',
    failure: {
      'two-sided': 'Yerel sol-sağ yaklaşım değil; x sonsuza giderken baskın terimlere bak.',
      local: 'Tek bir x koymak sonsuz limitini vermez.',
      infinity: 'Sonsuz tünel doğru; baş katsayı oranını kilitle.',
      factor: 'Bu görevde 0/0 yok; baskın terim oranı okunmalı.',
    },
  },
  {
    id: 'zero-over-zero',
    atomId: 'MAT.12.2.2.3',
    title: '0/0 sadeleştirme yolu',
    prompt: 'Doğrudan x = 2 koyunca 0/0 çıkar; payı çarpanlara ayır ve ortak (x - 2) çarpanını sadeleştir.',
    expression: 'lim x->2 (x² - 4)/(x - 2)',
    relation: '0/0 belirsizliği',
    sceneKind: 'factor',
    expectedTool: 'factor',
    gateLabel: 'x = 2',
    leftSensor: '(x - 2)(x + 2)',
    rightSensor: 'x - 2',
    resultLabel: 'x + 2 kalır; x = 2 için 4',
    resultBadge: '4',
    success: 'Doğru: pay ve paydadaki ortak (x - 2) sadeleşince x + 2 kalır; limit 4 olur.',
    proof: 'x² - 4 = (x - 2)(x + 2). Pay ve paydadaki ortak (x - 2) sadeleşir; kalan x + 2 ifadesinde x = 2 yazılır.',
    failure: {
      'two-sided': 'Yaklaşma fikri doğru ama önce 0/0 engelini kaldırmak gerekiyor.',
      local: 'Doğrudan x = 2 koymak 0/0 verir; önce ortak çarpanı sadeleştir.',
      infinity: 'Sonsuza gitmiyoruz; hedef x = 2 civarı.',
      factor: '0/0 sadeleştirme doğru; pay ve paydadaki ortak (x - 2) sadeleşir, kalan x + 2 okunur.',
    },
  },
];

export function isToolCorrect(mission: LimitMission, tool: LimitTool | null) {
  return tool !== null && tool === mission.expectedTool;
}
