export type BlockId = 'a2' | 'abColumn' | 'abRow' | 'b2';
export type SlotId = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type FeedbackTone = 'info' | 'success' | 'error';

export interface AlgebraBlock {
  id: BlockId;
  label: string;
  sizeLabel: string;
  slotId: SlotId;
  colorClass: string;
  glowClass: string;
  previewClass: string;
}

export interface TargetSlot {
  id: SlotId;
  title: string;
  accepts: BlockId;
  area: string;
  className: string;
  hint: string;
  wrongReason: string;
}

export interface Feedback {
  tone: FeedbackTone;
  title: string;
  body: string;
}

export const blocks: AlgebraBlock[] = [
  {
    id: 'a2',
    label: 'a²',
    sizeLabel: 'a × a',
    slotId: 'top-left',
    colorClass: 'from-orange-400 to-amber-500 text-slate-950',
    glowClass: 'shadow-orange-500/40',
    previewClass: 'aspect-square min-h-24',
  },
  {
    id: 'abColumn',
    label: 'ab',
    sizeLabel: 'b × a',
    slotId: 'top-right',
    colorClass: 'from-cyan-300 to-sky-500 text-slate-950',
    glowClass: 'shadow-cyan-400/40',
    previewClass: 'aspect-[2/3] min-h-28',
  },
  {
    id: 'abRow',
    label: 'ab',
    sizeLabel: 'a × b',
    slotId: 'bottom-left',
    colorClass: 'from-teal-300 to-emerald-500 text-slate-950',
    glowClass: 'shadow-emerald-400/40',
    previewClass: 'aspect-[3/2] min-h-20',
  },
  {
    id: 'b2',
    label: 'b²',
    sizeLabel: 'b × b',
    slotId: 'bottom-right',
    colorClass: 'from-fuchsia-300 to-pink-500 text-slate-950',
    glowClass: 'shadow-fuchsia-400/40',
    previewClass: 'aspect-square min-h-20',
  },
];

export const slots: TargetSlot[] = [
  {
    id: 'top-left',
    title: 'a genişlik, a yükseklik',
    accepts: 'a2',
    area: 'a²',
    className: 'col-start-1 row-start-1',
    hint: 'Sol üst kare',
    wrongReason: 'Bu bölgenin iki kenarı da a. Buraya yalnızca a × a alanlı a² parçası oturur.',
  },
  {
    id: 'top-right',
    title: 'b genişlik, a yükseklik',
    accepts: 'abColumn',
    area: 'ab',
    className: 'col-start-2 row-start-1',
    hint: 'Üst sağ dikdörtgen',
    wrongReason: 'Bu yuvada yükseklik a, genişlik b. Ölçüleri b × a olan dikey ab parçasını dene.',
  },
  {
    id: 'bottom-left',
    title: 'a genişlik, b yükseklik',
    accepts: 'abRow',
    area: 'ab',
    className: 'col-start-1 row-start-2',
    hint: 'Alt sol dikdörtgen',
    wrongReason: 'Bu yuvada genişlik a, yükseklik b. Yatay ab parçası bu alanı tamamlar.',
  },
  {
    id: 'bottom-right',
    title: 'b genişlik, b yükseklik',
    accepts: 'b2',
    area: 'b²',
    className: 'col-start-2 row-start-2',
    hint: 'Alt sağ kare',
    wrongReason: 'Bu küçük karede iki kenar da b. b × b alanlı b² parçası gerekir.',
  },
];

export const initialFeedback: Feedback = {
  tone: 'info',
  title: 'AstroBot hazır',
  body: 'Parçayı sürükleyip doğru yuvaya bırak ya da parçayı seçip yuvaya dokun. Amaç (a + b) kenarlı alanı dağılım özelliğiyle kurmak.',
};

export const getSlotTestId = (slotId: SlotId) => `identity-slot-${slotId}`;
