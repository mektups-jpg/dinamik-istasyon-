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

export const toolCopy: Record<RuleTool, { label: string; short: string; focusLabel: string; panelTitle: string; panelPrompt: string; formula: string; resultShape: string; hint: string; accent: string }> = {
  sum: {
    label: 'Toplam Kuralı',
    short: '+',
    focusLabel: 'Toplamın türevi',
    panelTitle: 'Toplamın türevini kur',
    panelPrompt: 'Toplamda f ve g ayrı ayrı türevlenir; sonuçlar toplanır.',
    formula: '(f + g)ʼ = fʼ + gʼ',
    resultShape: 'fʼ + gʼ',
    hint: 'Toplamın türevi alınırken fonksiyonlar ayrı ayrı türevlenir ve sonuçlar toplanır.',
    accent: '#00E5FF',
  },
  difference: {
    label: 'Fark Kuralı',
    short: '-',
    focusLabel: 'Farkın türevi',
    panelTitle: 'Farkın türevini kur',
    panelPrompt: 'Farkta f ve g ayrı ayrı türevlenir; gʼ, fʼten çıkarılır.',
    formula: '(f - g)ʼ = fʼ - gʼ',
    resultShape: 'fʼ - gʼ',
    hint: 'Farkın türevi alınırken iki fonksiyon ayrı ayrı türevlenir; gʼ, fʼten çıkarılır.',
    accent: '#9FF5FF',
  },
  product: {
    label: 'Çarpım Kuralı',
    short: '×',
    focusLabel: 'Çarpımın türevi',
    panelTitle: 'Çarpımın türevini kur',
    panelPrompt: 'Çarpımda iki terim oluşur: fʼg ve fgʼ birlikte toplanır.',
    formula: '(fg)ʼ = fʼg + fgʼ',
    resultShape: 'fʼg + fgʼ',
    hint: 'Çarpımda bir fonksiyon türevlenirken diğeri aynen bırakılır; sonra roller değişir.',
    accent: '#00FF88',
  },
  quotient: {
    label: 'Bölüm Kuralı',
    short: '÷',
    focusLabel: 'Bölümün türevi',
    panelTitle: 'Bölümün türevini kur',
    panelPrompt: 'Bölümde pay fʼg - fgʼ, payda g² olarak kurulur.',
    formula: '(f/g)ʼ = (fʼg - fgʼ)/g²',
    resultShape: '(fʼg - fgʼ)/g²',
    hint: 'Bölümde pay fʼg - fgʼ düzeniyle kurulur, payda ise g² olur.',
    accent: '#FFB84D',
  },
  chain: {
    label: 'Zincir Kuralı',
    short: 'F∘g',
    focusLabel: 'Bileşkenin türevi',
    panelTitle: 'Zincir kuralını kur',
    panelPrompt: 'Bileşkede dış türev alınır, iç türev çarpan olarak eklenir.',
    formula: '(F(g))ʼ = Fʼ(g) · gʼ',
    resultShape: 'Fʼ(g) · gʼ',
    hint: 'Bileşke fonksiyonda dış fonksiyon türevlenir, iç fonksiyonun türeviyle çarpılır.',
    accent: '#B388FF',
  },
};

export const forgeMissions: ForgeMission[] = [
  {
    id: 'sum-rule',
    title: 'Toplamın türevini kur',
    prompt: 'f(x) = x² ve g(x) = 3x için (f + g)ʼ isteniyor. Hangi türev kuralı kullanılır?',
    atomId: 'MAT.12.2.5.1',
    expectedTool: 'sum',
    structure: '(f + g)ʼ = ?',
    expression: '(f + g)ʼ = fʼ + gʼ',
    inputA: 'f(x) = x²',
    inputB: 'g(x) = 3x',
    output: '2x + 3',
    badge: 'Toplam',
    mechanism: 'Toplamda her fonksiyon ayrı türevlenir; fʼ ve gʼ sonuçları toplanır.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'f türevi',
        action: 'fʼ al',
        note: 'Önce f(x) türevlenir: x² fonksiyonunun türevi 2x olur.',
        accent: '#00E5FF',
        target: 'f',
      },
      {
        id: 'derive-g',
        label: 'g türevi',
        action: 'gʼ al',
        note: 'Sonra g(x) türevlenir: 3x fonksiyonunun türevi 3 olur.',
        accent: '#00FF88',
        target: 'g',
      },
      {
        id: 'bridge-plus',
        label: 'topla',
        action: 'fʼ + gʼ',
        note: 'Toplam kuralı iki türevi birleştirir: fʼ + gʼ = 2x + 3.',
        accent: '#9FF5FF',
        target: 'bridge',
      },
    ],
    success: 'Doğru: toplamın türevi, fonksiyonların türevlerinin toplamıdır.',
    proof: 'Toplam kuralında f ve g ayrı ayrı türevlenir; işaret artı olarak kalır.',
    failure: {
      sum: 'Toplam kuralı doğru: f ve g ayrı türevlenip toplanır.',
      difference: 'Bu görev toplam: fʼ ve gʼ toplanmalı, gʼ çıkarılmaz.',
      product: 'Fonksiyonlar çarpılmıyor; birini aynen bırakma adımı gerekmez.',
      quotient: 'Kesir yok; pay ve payda kuralı bu görev için fazla.',
      chain: 'İç içe fonksiyon yok; zincir kuralı bu yapı için kullanılmaz.',
    },
  },
  {
    id: 'difference-rule',
    title: 'Farkın türevini kur',
    prompt: 'f(x) = x² ve g(x) = 3x için (f - g)ʼ isteniyor. Hangi türev kuralı kullanılır?',
    atomId: 'MAT.12.2.5.2',
    expectedTool: 'difference',
    structure: '(f - g)ʼ = ?',
    expression: '(f - g)ʼ = fʼ - gʼ',
    inputA: 'f(x) = x²',
    inputB: 'g(x) = 3x',
    output: '2x - 3',
    badge: 'Fark',
    mechanism: 'Farkta iki fonksiyon ayrı türevlenir; gʼ, fʼten çıkarılır.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'f türevi',
        action: 'fʼ al',
        note: 'Önce f(x) türevlenir: x² için fʼ(x) = 2x.',
        accent: '#00E5FF',
        target: 'f',
      },
      {
        id: 'derive-g',
        label: 'g türevi',
        action: 'gʼ al',
        note: 'Sonra g(x) türevlenir: 3x için gʼ(x) = 3.',
        accent: '#00FF88',
        target: 'g',
      },
      {
        id: 'bridge-minus',
        label: 'çıkar',
        action: 'fʼ - gʼ',
        note: 'Fark kuralında iki fonksiyon ayrı ayrı türevlenir; gʼ, fʼten çıkarılır: fʼ - gʼ = 2x - 3.',
        accent: '#FF8ABB',
        target: 'bridge',
      },
    ],
    success: 'Doğru: farkın türevi, fonksiyonların türevlerinin farkıdır.',
    proof: 'Fark kuralında f ve g ayrı ayrı türevlenir; aradaki eksi işareti korunur.',
    failure: {
      sum: 'Toplam kuralı gʼ sonucunu da ekler; bu görevde gʼ çıkarılmalı.',
      difference: 'Fark kuralı doğru: fʼ sonucundan gʼ sonucu çıkarılır.',
      product: 'Çarpım yok; aynen bırakılan fonksiyon adımı gerekmiyor.',
      quotient: 'Bölüm yok; payda karesi kurulmaz.',
      chain: 'Bileşke fonksiyon yok; yalnız iki fonksiyonun farkı var.',
    },
  },
  {
    id: 'product-rule',
    title: 'Çarpımın türevini kur',
    prompt: 'f(x) = x² ve g(x) = x + 1 için (f · g)ʼ isteniyor. Hangi türev kuralı kullanılır?',
    atomId: 'MAT.12.2.5.3',
    expectedTool: 'product',
    structure: '(f · g)ʼ = ?',
    expression: '(fg)ʼ = fʼg + fgʼ',
    inputA: 'f(x) = x²',
    inputB: 'g(x) = x + 1',
    output: '2x(x+1)+x²',
    badge: 'Çarpım',
    mechanism: 'Çarpımda iki terim oluşur: önce f türevlenip g aynen kalır, sonra f aynen kalıp g türevlenir.',
    buildSteps: [
      {
        id: 'derive-f',
        label: '1. terim',
        action: 'fʼ al',
        note: 'Birinci terimde f türevlenir: fʼ · g terimi başlar.',
        accent: '#00E5FF',
        target: 'upper-arm',
      },
      {
        id: 'keep-g',
        label: 'g aynen',
        action: 'g kalsın',
        note: 'Aynı terimde g(x) aynen bırakılır: ilk terim fʼ · g olur.',
        accent: '#00FF88',
        target: 'upper-arm',
      },
      {
        id: 'keep-f',
        label: 'f aynen',
        action: 'f kalsın',
        note: 'İkinci terimde f(x) aynen bırakılır.',
        accent: '#00E5FF',
        target: 'lower-arm',
      },
      {
        id: 'derive-g',
        label: '2. terim',
        action: 'gʼ al',
        note: 'İkinci terimde g türevlenir: f · gʼ terimi oluşur.',
        accent: '#00FF88',
        target: 'lower-arm',
      },
      {
        id: 'bridge-plus',
        label: 'topla',
        action: 'iki terimi topla',
        note: 'İki çarpım terimi toplanır: fʼg + fgʼ.',
        accent: '#9FF5FF',
        target: 'bridge',
      },
    ],
    success: 'Doğru: çarpımın türevi fʼg + fgʼ biçiminde iki terimin toplamıdır.',
    proof: 'Çarpım kuralında sırayla bir fonksiyon türevlenir, diğeri aynen bırakılır.',
    failure: {
      sum: 'Sadece fʼ + gʼ yazmak çarpımdaki aynen kalan fonksiyonları kaybettirir.',
      difference: 'Bu görevde iki çarpım terimi toplanır; basit fark kuralı değil.',
      product: 'Çarpım kuralı doğru: fʼg ve fgʼ terimleri birlikte yazılır.',
      quotient: 'Bölme yok; payda karesi gerekmiyor.',
      chain: 'Bileşke değil; iki ayrı fonksiyon çarpılıyor.',
    },
  },
  {
    id: 'quotient-rule',
    title: 'Bölümün türevini kur',
    prompt: 'f(x) = x² ve g(x) = x + 1 için (f / g)ʼ isteniyor. Hangi türev kuralı kullanılır?',
    atomId: 'MAT.12.2.5.4',
    expectedTool: 'quotient',
    structure: '(f / g)ʼ = ?',
    expression: '(f/g)ʼ = (fʼg - fgʼ) / g²',
    inputA: 'f(x) = x²',
    inputB: 'g(x) = x + 1',
    output: '[fʼg-fgʼ]/g²',
    badge: 'Bölüm',
    mechanism: 'Bölümde pay fʼg - fgʼ olur; payda ise ikinci fonksiyonun karesi g² olarak kalır.',
    buildSteps: [
      {
        id: 'derive-f',
        label: 'pay 1',
        action: 'fʼ al',
        note: 'Payın ilk teriminde f türevlenir: fʼ · g.',
        accent: '#00E5FF',
        target: 'upper-arm',
      },
      {
        id: 'keep-g',
        label: 'g aynen',
        action: 'g kalsın',
        note: 'İlk pay teriminde g(x) aynen bırakılır; fʼg oluşur.',
        accent: '#00FF88',
        target: 'upper-arm',
      },
      {
        id: 'keep-f',
        label: 'pay 2',
        action: 'f kalsın',
        note: 'Payın ikinci teriminde f(x) aynen bırakılır.',
        accent: '#00E5FF',
        target: 'lower-arm',
      },
      {
        id: 'derive-g',
        label: 'g türevi',
        action: 'gʼ al',
        note: 'İkinci pay teriminde g türevlenir; fgʼ oluşur.',
        accent: '#00FF88',
        target: 'lower-arm',
      },
      {
        id: 'subtract-pay',
        label: 'pay farkı',
        action: 'fʼg - fgʼ',
        note: 'Bölüm kuralında paydaki iki terim çıkarılır: fʼg - fgʼ.',
        accent: '#FF8ABB',
        target: 'bridge',
      },
      {
        id: 'shield-g2',
        label: 'payda',
        action: 'g² yaz',
        note: 'Payda, ikinci fonksiyonun karesidir: g² = (x + 1)².',
        accent: '#FFB84D',
        target: 'shield',
      },
    ],
    success: 'Doğru: bölümün türevi (fʼg - fgʼ) / g² biçimindedir.',
    proof: 'Bölüm kuralında payda g² olur; pay kısmında fʼg ile fgʼ farkı yazılır.',
    failure: {
      sum: 'Sadece türevleri toplamak payda yapısını yok eder.',
      difference: 'Basit fark kuralı payda karesini kurmaz.',
      product: 'Çarpım kuralında payda g² yoktur; burada bölüm yapısı var.',
      quotient: 'Bölüm kuralı doğru: pay fʼg - fgʼ, payda g² olur.',
      chain: 'İç içe fonksiyon yok; burada pay ve payda ilişkisi var.',
    },
  },
  {
    id: 'chain-rule',
    title: 'Zincir kuralını kur',
    prompt: 'h(x) = (3x + 1)⁴ bir bileşke fonksiyondur. Hangi türev kuralı kullanılır?',
    atomId: 'MAT.12.2.5.5',
    expectedTool: 'chain',
    structure: '(F(g(x)))ʼ = ?',
    expression: '(F(g(x)))ʼ = Fʼ(g(x)) · gʼ(x)',
    inputA: 'dış F(u)=u⁴',
    inputB: 'iç g(x)=3x+1',
    output: '12(3x+1)³',
    badge: 'Zincir',
    mechanism: 'Zincirde dış fonksiyon türevlenir, iç ifade yerinde kalır; sonra iç fonksiyonun türeviyle çarpılır.',
    buildSteps: [
      {
        id: 'outer-shell',
        label: 'dış türev',
        action: 'dışı türevle',
        note: 'Önce dış fonksiyon türevlenir: u⁴ → 4u³; iç ifade yerinde kalır.',
        accent: '#B388FF',
        target: 'shell',
      },
      {
        id: 'inner-core',
        label: 'iç türev',
        action: 'iç türevle',
        note: 'Sonra iç fonksiyonun türevi alınır ve çarpılır: (3x + 1)ʼ = 3.',
        accent: '#00E5FF',
        target: 'core',
      },
    ],
    success: 'Doğru: bileşke fonksiyonun türevinde dış türev, iç türevle çarpılır.',
    proof: 'Zincir kuralında dış fonksiyonun türevi iç fonksiyon yerinde kalacak şekilde alınır; ardından iç türev çarpılır.',
    failure: {
      sum: 'Toplam yok; bu ifade iç içe geçmiş bir fonksiyondur.',
      difference: 'Fark yok; arada çıkarma işlemi olan iki fonksiyon bulunmuyor.',
      product: 'Bu iki bağımsız çarpan değil; dış fonksiyon iç fonksiyonun üzerine kurulmuş.',
      quotient: 'Kesir yok; pay ve payda ilişkisi kurulmaz.',
      chain: 'Zincir kuralı doğru: dış türev ve iç türev birlikte kullanılır.',
    },
  },
];

export function isRuleCorrect(mission: ForgeMission, tool: RuleTool | null) {
  return tool !== null && tool === mission.expectedTool;
}
