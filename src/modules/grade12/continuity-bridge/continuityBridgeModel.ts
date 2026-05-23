export const MODULE_ID = 'continuity-bridge';

export const ATOM_IDS = ['MAT.12.2.3.1'] as const;

export const TEST_ID_CONTRACT = [
  'continuity-bridge-scene',
  'continuity-bridge-manipulator',
  'continuity-bridge-rails',
  'continuity-bridge-pin',
  'continuity-bridge-gap',
  'continuity-bridge-seal',
  'continuity-bridge-check',
  'continuity-bridge-feedback',
  'continuity-bridge-reset',
] as const;

export type BridgeTool = 'rails' | 'pin' | 'gap' | 'seal';
export type BridgeIssue = 'continuous' | 'missing-value' | 'jump' | 'wrong-value';

export interface BridgeMission {
  id: string;
  title: string;
  prompt: string;
  expression: string;
  atomId: (typeof ATOM_IDS)[number];
  issue: BridgeIssue;
  expectedTool: BridgeTool;
  gateLabel: string;
  limitValue: number;
  functionValue: number | null;
  leftApproach: number;
  rightApproach: number;
  badge: string;
  success: string;
  proof: string;
  partial?: Partial<Record<BridgeTool, string>>;
  failure: Record<BridgeTool, string>;
}

export const toolCopy: Record<BridgeTool, { label: string; short: string; hint: string; accent: string }> = {
  rails: {
    label: 'Sağ-Sol Limit',
    short: 'lim',
    hint: 'Soldan limit ile sağdan limit aynı değere yaklaşıyor mu kontrol et.',
    accent: '#00E5FF',
  },
  pin: {
    label: 'f(a) Değeri',
    short: 'f(a)',
    hint: 'Fonksiyonun x = a noktasındaki değeri tanımlı mı ve limit değeriyle aynı mı kontrol et.',
    accent: '#00FF88',
  },
  gap: {
    label: 'Süreksiz',
    short: '≠',
    hint: 'Koşullardan biri sağlanmıyorsa fonksiyon bu noktada süreksizdir; nedeni sahnede belirle.',
    accent: '#FF4FA3',
  },
  seal: {
    label: 'Sürekli',
    short: '=',
    hint: 'Limit vardır, f(a) tanımlıdır ve limit değeri f(a) değerine eşitse sürekli kararını seç.',
    accent: '#FBBF24',
  },
};

export const bridgeMissions: BridgeMission[] = [
  {
    id: 'perfect-bridge',
    title: 'Üç şart aynı noktada',
    prompt: 'x = 2 noktasında soldan limit, sağdan limit ve f(2) değeri aynı mı?',
    expression: 'lim x→2 f(x) = f(2)',
    atomId: 'MAT.12.2.3.1',
    issue: 'continuous',
    expectedTool: 'seal',
    gateLabel: 'x = 2',
    limitValue: 4,
    functionValue: 4,
    leftApproach: 4,
    rightApproach: 4,
    badge: 'Sürekli',
    success: 'Doğru: soldan limit, sağdan limit ve f(2) değeri aynı olduğu için fonksiyon x = 2 noktasında süreklidir.',
    proof: 'Bir noktada süreklilik için limit vardır, f(a) tanımlıdır ve limit değeri f(a) değerine eşittir.',
    partial: {
      rails: 'Doğru ara kontrol: soldan ve sağdan limit aynı. Şimdi f(2) değeriyle eşit olduğunu görüp Sürekli kararını seç.',
      pin: 'Doğru ara kontrol: f(2) tanımlı ve aynı seviyede. Son karar için Sürekli seçeneğini işaretle.',
    },
    failure: {
      rails: 'Soldan ve sağdan limit aynı; fakat bu görevde son karar Sürekli olmalı.',
      pin: 'f(2) değeri doğru seviyede; son karar için Sürekli seç.',
      gap: 'Bu noktada süreksizlik yok: soldan limit, sağdan limit ve f(2) aynı değerde.',
      seal: 'Sürekli: üç şart da sağlanıyor.',
    },
  },
  {
    id: 'missing-pin',
    title: 'Limit var, f(1) tanımsız',
    prompt: 'Soldan ve sağdan limit 3 değerinde birleşiyor ama f(1) tanımlı değil.',
    expression: 'lim x→1 f(x) = 3, f(1) yok',
    atomId: 'MAT.12.2.3.1',
    issue: 'missing-value',
    expectedTool: 'pin',
    gateLabel: 'x = 1',
    limitValue: 3,
    functionValue: null,
    leftApproach: 3,
    rightApproach: 3,
    badge: 'Pim eksik',
    success: 'Doğru: limit oluşsa bile f(1) tanımlı olmadığı için fonksiyon x = 1 noktasında sürekli değildir.',
    proof: 'Süreklilik yalnız limitin varlığı değildir; o noktadaki fonksiyon değeri de tanımlı olmalıdır.',
    partial: {
      rails: 'Doğru ara kontrol: soldan ve sağdan limit var. Ama süreklilik için f(1) değerinin de tanımlı olması gerekir.',
      gap: 'Evet, sonuç süreksiz. Şimdi nedeni açıkça f(a) Değeri olarak seç: f(1) tanımlı değil.',
    },
    failure: {
      rails: 'Soldan ve sağdan limit birleşiyor; sorun limitte değil, f(1) değerinin tanımsız olmasında.',
      pin: 'f(a) Değeri doğru teşhis: f(1) tanımlı olmadığı için süreklilik yok.',
      gap: 'Süreksiz sonucu doğru, ama bu görevde neden f(a) değerinin tanımsız olmasıdır.',
      seal: 'Sürekli denemez; f(1) tanımlı olmadığı için limit = f(a) şartı kurulamaz.',
    },
  },
  {
    id: 'jump-bridge',
    title: 'Sağ-sol limit farklı',
    prompt: 'x = 0 noktasına soldan 2, sağdan 5 değerine yaklaşılıyor; iki taraflı limit var mı?',
    expression: 'lim x→0- f(x) ≠ lim x→0+ f(x)',
    atomId: 'MAT.12.2.3.1',
    issue: 'jump',
    expectedTool: 'rails',
    gateLabel: 'x = 0',
    limitValue: 2,
    functionValue: 2,
    leftApproach: 2,
    rightApproach: 5,
    badge: 'Limit yok',
    success: 'Doğru: soldan limit ile sağdan limit farklı olduğu için iki taraflı limit yoktur; süreklilik kurulamaz.',
    proof: 'Limit oluşmadan f(a) ile eşitlik konuşulamaz; süreklilik daha ilk şartta sağlanmaz.',
    partial: {
      gap: 'Evet, sonuç süreksiz. Şimdi matematiksel nedeni Sağ-Sol Limit olarak seç: iki taraflı limit yok.',
    },
    failure: {
      rails: 'Sağ-Sol Limit doğru teşhis: soldan ve sağdan limit farklı.',
      pin: 'f(0) tanımlı görünse bile iki taraflı limit olmadığı için süreklilik kurulamaz.',
      gap: 'Süreksiz sonucu doğru, ama bu görevde neden sağ ve sol limitin farklı olmasıdır.',
      seal: 'Sürekli denemez; önce soldan ve sağdan limit aynı olmalıdır.',
    },
  },
  {
    id: 'wrong-height-pin',
    title: 'f(a) değeri farklı',
    prompt: 'Limit değeri 1 olarak oluşuyor; fakat f(3) değeri 4 olarak verilmiş.',
    expression: 'lim x→3 f(x) = 1, f(3) = 4',
    atomId: 'MAT.12.2.3.1',
    issue: 'wrong-value',
    expectedTool: 'pin',
    gateLabel: 'x = 3',
    limitValue: 1,
    functionValue: 4,
    leftApproach: 1,
    rightApproach: 1,
    badge: 'Eşit değil',
    success: 'Doğru: limit değeri 1 iken f(3) = 4 olduğu için fonksiyon x = 3 noktasında sürekli değildir.',
    proof: 'Limit var ve f(a) tanımlı; ancak süreklilik için bu iki değer aynı olmalıdır.',
    partial: {
      rails: 'Doğru ara kontrol: iki taraflı limit var. Şimdi f(3) değerinin limitten farklı olduğunu yakala.',
      gap: 'Evet, sonuç süreksiz. Şimdi nedeni f(a) Değeri olarak seç: f(3), limit değerine eşit değil.',
    },
    failure: {
      rails: 'Soldan ve sağdan limit aynı; sorun limitte değil, f(3) değerinin limitten farklı olmasında.',
      pin: 'f(a) Değeri doğru teşhis: f(3) = 4, limit değeri ise 1.',
      gap: 'Süreksiz sonucu doğru, ama bu görevde neden f(a) değerinin limitten farklı olmasıdır.',
      seal: 'Sürekli denemez; limit değeri 1 iken f(3) = 4.',
    },
  },
  {
    id: 'final-continuous',
    title: 'Süreklilik kararı',
    prompt: 'x = -1 noktasında sağ-sol limit ve f(-1) değeri aynı; süreklilik kararını ver.',
    expression: 'lim x→-1 f(x) = f(-1)',
    atomId: 'MAT.12.2.3.1',
    issue: 'continuous',
    expectedTool: 'seal',
    gateLabel: 'x = -1',
    limitValue: 2,
    functionValue: 2,
    leftApproach: 2,
    rightApproach: 2,
    badge: 'Kanıt',
    success: 'Doğru: limit değeri ile f(-1) aynı olduğu için fonksiyon x = -1 noktasında süreklidir.',
    proof: 'Üç şart aynı anda sağlandı: limit var, f(a) var ve limit = f(a).',
    partial: {
      rails: 'Doğru ara kontrol: sağ ve sol limit aynı. Şimdi f(-1) değeriyle eşitliği tamamla ve Sürekli seç.',
      pin: 'Doğru ara kontrol: f(-1) tanımlı ve limit seviyesinde. Son karar için Sürekli seç.',
    },
    failure: {
      rails: 'Soldan ve sağdan limit doğru hizalanmış; son karar için Sürekli seçilmeli.',
      pin: 'f(-1) değeri doğru seviyede; son karar için Sürekli seçilmeli.',
      gap: 'Bu noktada süreksizlik yok; tüm süreklilik şartları sağlanıyor.',
      seal: 'Sürekli kararını seç ve kanıtı tamamla.',
    },
  },
];

export function isToolCorrect(mission: BridgeMission, tool: BridgeTool | null) {
  return tool !== null && tool === mission.expectedTool;
}

export function mapHeight(value: number) {
  const min = 0;
  const max = 5;
  const clamped = Math.min(Math.max(value, min), max);
  return 268 - (clamped / max) * 190;
}
