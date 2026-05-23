export const MODULE_ID = 'derivative-rule-forge';

export const ATOM_IDS = [
  'MAT.12.2.5.1',
  'MAT.12.2.5.2',
  'MAT.12.2.5.3',
  'MAT.12.2.5.4',
  'MAT.12.2.5.5',
] as const;

export const TEST_ID_CONTRACT = [
  'derivative-rule-forge-scene',
  'derivative-rule-forge-manipulator',
  'derivative-rule-forge-sum',
  'derivative-rule-forge-difference',
  'derivative-rule-forge-product',
  'derivative-rule-forge-quotient',
  'derivative-rule-forge-chain',
  'derivative-rule-forge-check',
  'derivative-rule-forge-feedback',
  'derivative-rule-forge-reset',
  'derivative-rule-forge-step-derive-f',
  'derivative-rule-forge-step-derive-g',
  'derivative-rule-forge-step-bridge-plus',
  'derivative-rule-forge-step-bridge-minus',
  'derivative-rule-forge-step-keep-f',
  'derivative-rule-forge-step-keep-g',
  'derivative-rule-forge-step-subtract-pay',
  'derivative-rule-forge-step-shield-g2',
  'derivative-rule-forge-step-outer-shell',
  'derivative-rule-forge-step-inner-core',
] as const;

export type RuleTool = 'sum' | 'difference' | 'product' | 'quotient' | 'chain';

export type BuildStepId =
  | 'derive-f'
  | 'derive-g'
  | 'bridge-plus'
  | 'bridge-minus'
  | 'keep-f'
  | 'keep-g'
  | 'subtract-pay'
  | 'shield-g2'
  | 'outer-shell'
  | 'inner-core';

export type BuildStepTarget = 'f' | 'g' | 'bridge' | 'upper-arm' | 'lower-arm' | 'shield' | 'shell' | 'core';

export interface ForgeBuildStep {
  id: BuildStepId;
  label: string;
  action: string;
  note: string;
  accent: string;
  target: BuildStepTarget;
}

export interface ForgeMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  expectedTool: RuleTool;
  structure: string;
  expression: string;
  inputA: string;
  inputB: string;
  output: string;
  badge: string;
  mechanism: string;
  buildSteps: ForgeBuildStep[];
  success: string;
  proof: string;
  failure: Record<RuleTool, string>;
}

export const toolCopy: Record<RuleTool, { label: string; short: string; hint: string; accent: string }> = {
  sum: {
    label: 'Toplam Kartuşu',
    short: '+',
    hint: 'İki giriş ayrı ayrı türev ışınına ayrılır ve aynı çıkışa yönelir.',
    accent: '#00E5FF',
  },
  difference: {
    label: 'Fark Kartuşu',
    short: '-',
    hint: 'İkinci türev ışını ters polariteye hazırlanır; testte eksi yön kontrol edilir.',
    accent: '#9FF5FF',
  },
  product: {
    label: 'Çarpım Kolu',
    short: '×',
    hint: 'İki çapraz kol hazırlanır; bir parça korunurken diğeri türevlenir.',
    accent: '#00FF88',
  },
  quotient: {
    label: 'Bölüm Kalkanı',
    short: '÷',
    hint: 'Pay bandı ve payda zırhı ayrı çalışmaya hazırlanır.',
    accent: '#FFB84D',
  },
  chain: {
    label: 'Zincir Halkası',
    short: '⛓',
    hint: 'Dış halka ve iç çekirdek birlikte taranır.',
    accent: '#B388FF',
  },
};

export const forgeMissions: ForgeMission[] = [
  {
    id: 'sum-rule',
    title: 'Toplam bandını birleştir',
    prompt: 'f(x)=x² ve g(x)=3x aynı banda giriyor. Türevi hangi kartuş birleştirir?',
    atomId: 'MAT.12.2.5.1',
    expectedTool: 'sum',
    structure: '(f + g)ʼ = ?',
    expression: '(f + g)ʼ = fʼ + gʼ',
    inputA: 'f=x²',
    inputB: 'g=3x',
    output: '2x + 3',
    badge: 'Toplam',
    mechanism: 'İki bağımsız türev ışını paralel çıkar ve artı köprüsünde birleşir.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'f ışını',
        action: 'türevle f',
        note: 'f kendi ışınında türevlenir: toplamda ilk parça bağımsız kalır.',
        accent: '#00E5FF',
        target: 'f',
      },
      {
        id: 'derive-g',
        label: 'g ışını',
        action: 'türevle g',
        note: 'g de ayrı türevlenir; toplamda fonksiyonlar birbirine karışmaz.',
        accent: '#00FF88',
        target: 'g',
      },
      {
        id: 'bridge-plus',
        label: '+ köprüsü',
        action: 'topla',
        note: 'İki türev ışını artı köprüsünde birleşir: fʼ + gʼ.',
        accent: '#9FF5FF',
        target: 'bridge',
      },
    ],
    success: 'Doğru: toplamda iki fonksiyon ayrı ayrı türevlenir ve sonuçlar toplanır.',
    proof: 'Toplam kuralı, iki bağımsız değişim ışınını aynı çıkışta toplar.',
    failure: {
      sum: 'Toplam kartuşu doğru hedef: f ve g ayrı türevlenip toplanır.',
      difference: 'Burada eksi işaret yok; ikinci türev ışını çıkarılmıyor.',
      product: 'Fonksiyonlar çarpılmıyor; iki çapraz kol gerekmiyor.',
      quotient: 'Kesir bandı yok; g² payda zırhı oluşmamalı.',
      chain: 'İç içe fonksiyon yok; dış-iç halka manevrası gerekmiyor.',
    },
  },
  {
    id: 'difference-rule',
    title: 'Fark ışınını ters çevir',
    prompt: 'f(x)=x² ve g(x)=3x bu kez çıkarma bandında. İkinci ışın nasıl davranmalı?',
    atomId: 'MAT.12.2.5.2',
    expectedTool: 'difference',
    structure: '(f - g)ʼ = ?',
    expression: '(f - g)ʼ = fʼ - gʼ',
    inputA: 'f=x²',
    inputB: 'g=3x',
    output: '2x - 3',
    badge: 'Fark',
    mechanism: 'İkinci türev ışını ters polariteye döner ve çıkıştan çıkar.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'f ışını',
        action: 'türevle f',
        note: 'f ışını önce türevlenir; farkta ana bant buradan başlar.',
        accent: '#00E5FF',
        target: 'f',
      },
      {
        id: 'derive-g',
        label: 'g ışını',
        action: 'türevle g',
        note: 'g de türevlenir; fark kuralında çıkarılan parça gʼ olur.',
        accent: '#00FF88',
        target: 'g',
      },
      {
        id: 'bridge-minus',
        label: '- köprüsü',
        action: 'tersle',
        note: 'İkinci ışın eksi polariteye döner: fʼ - gʼ.',
        accent: '#FF8ABB',
        target: 'bridge',
      },
    ],
    success: 'Doğru: farkta iki fonksiyon ayrı türevlenir, ikinci türev çıkarılır.',
    proof: 'Fark kuralı toplam bandının aynı düzenidir; yalnız ikinci ışın eksi yönlüdür.',
    failure: {
      sum: 'Toplam işareti ikinci ışını da ekler; bu görevde g türevi çıkarılmalı.',
      difference: 'Fark kartuşu doğru hedef: f’ ışınından g’ ışını çıkar.',
      product: 'Çarpım kolu fazla parça üretir; burada f·g çarpımı yok.',
      quotient: 'Bölüm kalkanı gereksiz; kesir yapısı kurulmadı.',
      chain: 'İç-dış fonksiyon halkası yok; yalnız iki ayrı fonksiyonun farkı var.',
    },
  },
  {
    id: 'product-rule',
    title: 'İki çarpım kolunu eşleştir',
    prompt: 'f(x)=x² ve g(x)=x+1 çarpılıyor. Hangi kural iki parçayı birlikte döker?',
    atomId: 'MAT.12.2.5.3',
    expectedTool: 'product',
    structure: '(f · g)ʼ = ?',
    expression: '(fg)ʼ = fʼg + fgʼ',
    inputA: 'f=x²',
    inputB: 'g=x+1',
    output: '2x(x+1)+x²',
    badge: 'Çarpım',
    mechanism: 'Sol kol f’ üretirken g korunur; sağ kol f’yi değil, g’yi üretip f ile taşır.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'sol türev',
        action: 'türevle f',
        note: 'Sol kolda f türevlenir; fʼ parçası doğar.',
        accent: '#00E5FF',
        target: 'upper-arm',
      },
      {
        id: 'keep-g',
        label: 'g koru',
        action: 'koru g',
        note: 'Aynı sol kolda g korunur; ilk çarpım parçası fʼ·g olur.',
        accent: '#00FF88',
        target: 'upper-arm',
      },
      {
        id: 'keep-f',
        label: 'f koru',
        action: 'koru f',
        note: 'Sağ kolda f korunur; ikinci parça için zemin hazırdır.',
        accent: '#00E5FF',
        target: 'lower-arm',
      },
      {
        id: 'derive-g',
        label: 'sağ türev',
        action: 'türevle g',
        note: 'Sağ kolda g türevlenir; ikinci çarpım parçası f·gʼ olur.',
        accent: '#00FF88',
        target: 'lower-arm',
      },
      {
        id: 'bridge-plus',
        label: '+ köprüsü',
        action: 'topla',
        note: 'İki çarpım kolu toplanır: fʼg + fgʼ.',
        accent: '#9FF5FF',
        target: 'bridge',
      },
    ],
    success: 'Doğru: çarpımda iki kol gerekir; f’·g ve f·g’ parçaları birlikte toplanır.',
    proof: 'Çarpım kuralı bir fonksiyonu türevlerken diğerini koruyan iki eş zamanlı koldur.',
    failure: {
      sum: 'Sadece f’ + g’ yazmak çarpımın korunan parçalarını kaybeder.',
      difference: 'Bu görevde eksi bant yok; iki çarpım parçası toplanmalı.',
      product: 'Çarpım kolu doğru hedef: bir kol f’·g, diğer kol f·g’ üretir.',
      quotient: 'Payda zırhı yok; fonksiyonlar bölünmüyor.',
      chain: 'Bileşke değil; iki ayrı fonksiyon yan yana çarpılıyor.',
    },
  },
  {
    id: 'quotient-rule',
    title: 'Pay ve payda kalkanını ayır',
    prompt: 'f(x)=x² üstte, g(x)=x+1 altta. Bölüm türevi hangi kalkanla korunur?',
    atomId: 'MAT.12.2.5.4',
    expectedTool: 'quotient',
    structure: '(f / g)ʼ = ?',
    expression: '(f/g)ʼ = (fʼg - fgʼ) / g²',
    inputA: 'f=x²',
    inputB: 'g=x+1',
    output: '[2x(x+1)-x²]/(x+1)²',
    badge: 'Bölüm',
    mechanism: 'Pay bandı iki çarpım parçasını çıkarır; altta g² zırhı hiç kaybolmaz.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'üst fʼ',
        action: 'türevle f',
        note: 'Payın ilk çarpımında f türevlenir: fʼ·g.',
        accent: '#00E5FF',
        target: 'upper-arm',
      },
      {
        id: 'keep-g',
        label: 'g koru',
        action: 'koru g',
        note: 'İlk pay parçasında g korunur; üst bant fʼg üretir.',
        accent: '#00FF88',
        target: 'upper-arm',
      },
      {
        id: 'keep-f',
        label: 'f koru',
        action: 'koru f',
        note: 'Payın ikinci parçasında f korunur; çıkarılacak kol hazırlanır.',
        accent: '#00E5FF',
        target: 'lower-arm',
      },
      {
        id: 'derive-g',
        label: 'alt gʼ',
        action: 'türevle g',
        note: 'İkinci pay parçasında g türevlenir; fgʼ oluşur.',
        accent: '#00FF88',
        target: 'lower-arm',
      },
      {
        id: 'subtract-pay',
        label: 'pay eksi',
        action: 'çıkar',
        note: 'Pay bandı ters işaretle kilitlenir: fʼg - fgʼ.',
        accent: '#FF8ABB',
        target: 'bridge',
      },
      {
        id: 'shield-g2',
        label: 'g² zırh',
        action: 'kare koru',
        note: 'Paydanın karesi altta korunur; bölüm kalkanı g² ile tamamlanır.',
        accent: '#FFB84D',
        target: 'shield',
      },
    ],
    success: 'Doğru: bölümde üst bandı f’g - fg’ çalışır, payda g² olarak korunur.',
    proof: 'Bölüm kuralı çarpımın iki kolunu ters işaretli pay bandına ve kare payda zırhına bağlar.',
    failure: {
      sum: 'Sadece türevleri toplamak payda yapısını yok eder.',
      difference: 'Basit fark kuralı payda zırhını kurmaz.',
      product: 'Çarpım kolu payda kalkanını üretmez; bölümde g² gerekir.',
      quotient: 'Bölüm kalkanı doğru hedef: f’g - fg’ üstte, g² altta kalır.',
      chain: 'İç içe fonksiyon yok; burada üst-alt bölüm yapısı var.',
    },
  },
  {
    id: 'chain-rule',
    title: 'İç çekirdeği dış kabuğa kilitle',
    prompt: 'h(x)=(3x+1)⁴. Dış kuvvet kabuğu ve iç doğrusal çekirdek beraber nasıl türevlenir?',
    atomId: 'MAT.12.2.5.5',
    expectedTool: 'chain',
    structure: '(F(g(x)))ʼ = ?',
    expression: '(F(g(x)))ʼ = Fʼ(g(x)) · gʼ(x)',
    inputA: 'dış: u⁴',
    inputB: 'iç: 3x+1',
    output: '12(3x+1)³',
    badge: 'Zincir',
    mechanism: 'Dış halka 4u³ olur; iç çekirdek 3 çarpanı olarak çıkışa kilitlenir.',
    buildSteps: [
      {
        id: 'outer-shell',
        label: 'dış kabuk',
        action: 'dışı türevle',
        note: 'Dış fonksiyon önce türevlenir ama iç ifade yerinde kalır.',
        accent: '#B388FF',
        target: 'shell',
      },
      {
        id: 'inner-core',
        label: 'iç çekirdek',
        action: 'içi çarp',
        note: 'İç çekirdeğin türevi çıkışa çarpan olarak kilitlenir.',
        accent: '#00E5FF',
        target: 'core',
      },
    ],
    success: 'Doğru: zincir kuralında dış kabuk türevlenir, iç türev çarpan olarak eklenir.',
    proof: 'Bileşkede dış değişim tek başına yetmez; iç çekirdeğin değişim hızı da çarpılır.',
    failure: {
      sum: 'Toplam bandı iç-dış bağı görmez; burada iki ayrı fonksiyon toplanmıyor.',
      difference: 'Eksi ışını yok; bileşke içeri doğru kilitlenmiş.',
      product: 'Bu iki bağımsız çarpan değil; dış fonksiyon iç fonksiyonun üstünde duruyor.',
      quotient: 'Kesir yok; payda kalkanı kurulmaz.',
      chain: 'Zincir halkası doğru hedef: dış kabuk ve iç çekirdek birlikte türevlenir.',
    },
  },
];

export function isRuleCorrect(mission: ForgeMission, tool: RuleTool | null) {
  return tool !== null && tool === mission.expectedTool;
}
