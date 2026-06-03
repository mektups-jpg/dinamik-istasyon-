import { RuleTool, toolCopy } from './derivativeRuleModel';

export const bridgeStepCopy: Record<RuleTool, { label: string; action: string; note: string; accent: string }> = {
  sum: {
    label: 'topla',
    action: toolCopy.sum.resultShape,
    note: 'Toplam kuralında iki türev toplanır: fʼ + gʼ.',
    accent: '#9FF5FF',
  },
  difference: {
    label: 'çıkar',
    action: toolCopy.difference.resultShape,
    note: 'Fark kuralında iki fonksiyon ayrı ayrı türevlenir; gʼ, fʼten çıkarılır: fʼ - gʼ.',
    accent: '#FF8ABB',
  },
  product: {
    label: 'topla',
    action: toolCopy.product.resultShape,
    note: 'Çarpım kuralında iki terim toplanır: fʼg + fgʼ.',
    accent: '#00FF88',
  },
  quotient: {
    label: 'pay farkı',
    action: 'fʼg - fgʼ',
    note: 'Bölüm kuralında paydaki iki terim çıkarılır: fʼg - fgʼ.',
    accent: '#FF8ABB',
  },
  chain: {
    label: 'dış · iç',
    action: toolCopy.chain.resultShape,
    note: 'Zincir kuralında dış türev, iç türevle çarpılır.',
    accent: '#B388FF',
  },
};
