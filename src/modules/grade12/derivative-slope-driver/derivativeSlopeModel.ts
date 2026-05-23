export const MODULE_ID = 'derivative-slope-driver';

export const ATOM_IDS = [
  'MAT.12.2.4.1',
  'MAT.12.2.4.2',
] as const;

export const TEST_ID_CONTRACT = [
  'derivative-slope-driver-scene',
  'derivative-slope-driver-manipulator',
  'derivative-slope-driver-secant',
  'derivative-slope-driver-tangent',
  'derivative-slope-driver-check',
  'derivative-slope-driver-feedback',
  'derivative-slope-driver-reset',
] as const;

export type SlopeTool = 'secant' | 'tangent' | 'corner' | 'gap';
export type TrackMode = 'average' | 'tangent' | 'corner' | 'gap';

export interface TrackPoint {
  x: number;
  y: number;
}

export interface SlopeMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  mode: TrackMode;
  expectedTool: SlopeTool;
  expression: string;
  badge: string;
  a: TrackPoint;
  b: TrackPoint;
  tangentAngle: number;
  secantLabel: string;
  tangentLabel: string;
  success: string;
  proof: string;
  failure: Record<SlopeTool, string>;
}

export const toolCopy: Record<SlopeTool, { label: string; short: string; description: string; hint: string; accent: string }> = {
  secant: {
    label: 'Kesen Doğru',
    short: 'Δ',
    description: 'A ile B arasındaki genel değişimi ölçer.',
    hint: 'Bir noktadaki eğimi değil, iki nokta arasındaki genel değişimi ölçüyoruz. Kesen doğru bu aralığı gösterir.',
    accent: '#FBBF24',
  },
  tangent: {
    label: 'Teğet Kızağı',
    short: "f'",
    description: 'B, A’ya iyice yaklaşınca tek noktadaki eğimi gösterir.',
    hint: 'B aracı A noktasına yaklaştıkça kesen doğru tek noktadaki teğete dönüşür. İşte bu teğetin eğimi türevdir.',
    accent: '#00FF88',
  },
  corner: {
    label: 'Sivri Uç Alarmı',
    short: '⌃',
    description: 'Soldan ve sağdan eğim aynı çizgide birleşmez.',
    hint: 'Sol ve sağ teğet kanatları farklıysa kızağı kapatma; türev yoktur.',
    accent: '#FBBF24',
  },
  gap: {
    label: 'Kopuk Pist',
    short: '!',
    description: 'Grafik kopuksa aynı noktada teğet kurulamaz.',
    hint: 'Pist kopuksa araç aynı noktadan geçemez; süreksizlikte türev kurulamaz.',
    accent: '#FF4FA3',
  },
};

export const slopeMissions: SlopeMission[] = [
  {
    id: 'average-secant',
    title: 'İki araç arası ortalama eğim',
    prompt: 'A ve B araçları aralığın iki ucunda. Ortalama değişim oranını hangi parça gösterir?',
    atomId: 'MAT.12.2.4.1',
    mode: 'average',
    expectedTool: 'secant',
    expression: 'ortalama değişim = Δy / Δx',
    badge: 'Ortalama',
    a: { x: 250, y: 274 },
    b: { x: 720, y: 136 },
    tangentAngle: -15,
    secantLabel: 'Δy / Δx ≈ 0.23',
    tangentLabel: 'B noktası A’dan uzak',
    success: 'Doğru: bir noktadaki eğimi değil, iki nokta arasındaki genel değişimi ölçtün.',
    proof: 'Ortalama değişim tek noktaya değil, A-B aralığının tamamına bakar.',
    failure: {
      secant: 'Kesen doğru doğru hedef: aralık eğimi iki nokta arasında okunur.',
      tangent: 'Teğet tek noktadaki anlık eğim içindir; bu görevde B hâlâ A’dan uzak, yani iki nokta arası genel değişimi okumalıyız.',
      corner: 'Pist sivri değil; burada iki uç arasındaki ortalama eğimi okumalıyız.',
      gap: 'Pist kopuk değil; sorun süreksizlik değil, doğru eğim parçasını seçmek.',
    },
  },
  {
    id: 'instant-tangent',
    title: 'Kesen teğete dönüşüyor',
    prompt: 'B aracı A noktasına yaklaştı. Tek noktadaki anlık eğimi hangi çizgi gösterir?',
    atomId: 'MAT.12.2.4.2',
    mode: 'tangent',
    expectedTool: 'tangent',
    expression: "f'(a) = teğetin eğimi",
    badge: 'Anlık',
    a: { x: 455, y: 184 },
    b: { x: 625, y: 128 },
    tangentAngle: -32,
    secantLabel: 'B -> A',
    tangentLabel: "f'(a) ≈ 0.33",
    success: 'Doğru: B noktası A’ya yaklaşınca kesen doğru teğete dönüşür; teğetin eğimi anlık değişimdir.',
    proof: 'Türev, tek noktadaki anlık değişimi teğetin eğimi olarak görselleştirir.',
    failure: {
      secant: 'Kesen doğru başlangıç fikrini verir ama B artık A noktasına yaklaştı; anlık karar teğettir.',
      tangent: 'Teğet kızağı doğru hedef: anlık eğim bu çizginin yönüdür.',
      corner: 'Pist bu noktada pürüzsüz; sivri uç alarmı gerekmiyor.',
      gap: 'Pist kopuk değil; teğet kızağı kurulabiliyor.',
    },
  },
  {
    id: 'final-tangent-lock',
    title: 'Anlık eğim kilidi',
    prompt: 'Son pist pürüzsüz. Kesen doğru neredeyse teğete oturdu; türev kanıtını kilitle.',
    atomId: 'MAT.12.2.4.2',
    mode: 'tangent',
    expectedTool: 'tangent',
    expression: "f'(a) teğet yönüdür",
    badge: 'Kilitli',
    a: { x: 618, y: 128 },
    b: { x: 688, y: 136 },
    tangentAngle: 4,
    secantLabel: 'B -> A',
    tangentLabel: "f'(a) ≈ 0",
    success: 'Doğru: pürüzsüz pistte anlık eğim teğet kızağının yönüyle kilitlendi.',
    proof: 'Kesen doğru yaklaşımı teğete oturduğunda türev okunabilir hale gelir.',
    failure: {
      secant: 'Bu finalde kesen doğru neredeyse teğete dönüştü; karar anlık eğim kızağıdır.',
      tangent: 'Teğet kızağı doğru hedef: anlık eğim kilitlenir.',
      corner: 'Pist pürüzsüz; sivri uç alarmı yok.',
      gap: 'Pist kopuk değil; teğet kesintisiz kuruluyor.',
    },
  },
];

export function isToolCorrect(mission: SlopeMission, tool: SlopeTool | null) {
  return tool !== null && tool === mission.expectedTool;
}

export function lineAngle(a: TrackPoint, b: TrackPoint) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
