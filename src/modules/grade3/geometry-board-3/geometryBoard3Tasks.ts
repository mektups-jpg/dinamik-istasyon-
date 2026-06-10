export type GeometryBoardKind =
  | 'solid-face'
  | 'solid-edge'
  | 'solid-corner'
  | 'polygon'
  | 'draw'
  | 'perimeter-trace'
  | 'perimeter-sum'
  | 'symmetry-lines'
  | 'mirror-complete'
  | 'code-symmetry';

export interface BoardPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  ghost?: boolean;
}

export interface BoardSegment {
  from: string;
  to: string;
  length?: number;
  dashed?: boolean;
}

export interface GeometryBoardTask {
  id: string;
  kind: GeometryBoardKind;
  title: string;
  prompt: string;
  boardTitle: string;
  boardHint: string;
  answer: string;
  choices: string[];
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  points: BoardPoint[];
  segments: BoardSegment[];
  badges: string[];
  axisX?: number;
  closeShape?: boolean;
}

export const GEOMETRY_BOARD_3_ATOMS = [
  { id: 'MAT.3.3.1.1', label: '3D cisimlerin yüz sayılarını tabloya işler.' },
  { id: 'MAT.3.3.1.2', label: '3D cisimlerin ayrıt sayılarını tabloya işler.' },
  { id: 'MAT.3.3.1.3', label: '3D cisimlerin köşe sayılarını tabloya işler.' },
  { id: 'MAT.3.3.2.1', label: 'Çokgenleri kenar sayılarına göre adlandırır.' },
  { id: 'MAT.3.3.3.1', label: 'Sanal cetvelle yönergeye uygun şekil çizer.' },
  { id: 'MAT.3.3.4.1', label: 'Çevrenin dış kenarların toplamı olduğunu gösterir.' },
  { id: 'MAT.3.3.4.2', label: 'Kenar uzunluklarını toplayarak çevreyi hesaplar.' },
  { id: 'MAT.3.3.6.1', label: 'Bir şeklin simetri doğrularını çizer.' },
  { id: 'MAT.3.3.7.1', label: 'Ayna eksenine göre eksik yarıyı tamamlar.' },
  { id: 'MAT.3.3.8.1', label: 'Kodlama yönergesiyle simetrik parçayı kurar.' },
];

const COLORS = ['#22D3EE', '#34D399', '#FACC15', '#FB7185', '#A78BFA', '#60A5FA'];

const SOLID_FACE_POINTS: BoardPoint[] = [
  { id: 'a', x: 1, y: 1, label: 'A' },
  { id: 'b', x: 3, y: 1, label: 'B' },
  { id: 'c', x: 3, y: 3, label: 'C' },
  { id: 'd', x: 1, y: 3, label: 'D' },
  { id: 'e', x: 2, y: 0.4, label: 'E' },
  { id: 'f', x: 4, y: 0.4, label: 'F' },
  { id: 'g', x: 4, y: 2.4, label: 'G' },
  { id: 'h', x: 2, y: 2.4, label: 'H' },
];

const CUBE_SEGMENTS: BoardSegment[] = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'c', to: 'd' },
  { from: 'd', to: 'a' },
  { from: 'e', to: 'f' },
  { from: 'f', to: 'g' },
  { from: 'g', to: 'h' },
  { from: 'h', to: 'e' },
  { from: 'a', to: 'e' },
  { from: 'b', to: 'f' },
  { from: 'c', to: 'g' },
  { from: 'd', to: 'h' },
];

const PENTAGON_POINTS: BoardPoint[] = [
  { id: 'a', x: 2.5, y: 0.5, label: '1' },
  { id: 'b', x: 4, y: 1.8, label: '2' },
  { id: 'c', x: 3.4, y: 3.8, label: '3' },
  { id: 'd', x: 1.6, y: 3.8, label: '4' },
  { id: 'e', x: 1, y: 1.8, label: '5' },
];

const HEXAGON_POINTS: BoardPoint[] = [
  { id: 'a', x: 2, y: 0.5, label: '1' },
  { id: 'b', x: 3.6, y: 0.5, label: '2' },
  { id: 'c', x: 4.5, y: 2.2, label: '3' },
  { id: 'd', x: 3.6, y: 3.9, label: '4' },
  { id: 'e', x: 2, y: 3.9, label: '5' },
  { id: 'f', x: 1.1, y: 2.2, label: '6' },
];

const RECTANGLE_POINTS: BoardPoint[] = [
  { id: 'a', x: 1, y: 1, label: 'A' },
  { id: 'b', x: 4, y: 1, label: 'B' },
  { id: 'c', x: 4, y: 3, label: 'C' },
  { id: 'd', x: 1, y: 3, label: 'D' },
];

const SQUARE_SYMMETRY_POINTS: BoardPoint[] = [
  ...RECTANGLE_POINTS,
  { id: 'midTop', x: 2.5, y: 1 },
  { id: 'midBottom', x: 2.5, y: 3 },
  { id: 'midLeft', x: 1, y: 2 },
  { id: 'midRight', x: 4, y: 2 },
];

const TRIANGLE_PRISM_POINTS: BoardPoint[] = [
  { id: 'a', x: 1, y: 1, label: '1' },
  { id: 'b', x: 2.4, y: 0.5, label: '2' },
  { id: 'c', x: 3.4, y: 1.6, label: '3' },
  { id: 'd', x: 1, y: 3.2, label: '4' },
  { id: 'e', x: 2.4, y: 2.7, label: '5' },
  { id: 'f', x: 3.4, y: 3.8, label: '6' },
];

const TRIANGLE_PRISM_SEGMENTS: BoardSegment[] = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'c', to: 'a' },
  { from: 'd', to: 'e' },
  { from: 'e', to: 'f' },
  { from: 'f', to: 'd' },
  { from: 'a', to: 'd' },
  { from: 'b', to: 'e' },
  { from: 'c', to: 'f' },
];

export function createGeometryBoard3Tasks(seed = Math.floor(Math.random() * 1000)): GeometryBoardTask[] {
  const polygon = pickBySeed([
    polygonTask('polygon-pentagon', 'Beşgeni tanı', 'Tahtadaki çokgen kaç kenarlı? Adını seç.', PENTAGON_POINTS, 'Beşgen', ['Dörtgen', 'Altıgen'], '5 kenar'),
    polygonTask('polygon-hexagon', 'Altıgeni tanı', 'Tahtadaki çokgen kaç kenarlı? Adını seç.', HEXAGON_POINTS, 'Altıgen', ['Beşgen', 'Dörtgen'], '6 kenar'),
  ], seed);
  const perimeter = pickBySeed([
    perimeterTask('perimeter-14', 3, 2, '14 birim'),
    perimeterTask('perimeter-16', 4, 2, '16 birim'),
    perimeterTask('perimeter-18', 4, 3, '18 birim'),
  ], seed + 1);

  return [
    {
      id: 'cube-faces',
      kind: 'solid-face',
      title: 'Yüzleri say',
      prompt: 'Küpün kaç yüzü vardır?',
      boardTitle: 'Küp modeli',
      boardHint: 'Ön, arka, sağ, sol, üst ve alt yüzleri düşün.',
      answer: '6 yüz',
      choices: shuffle(['6 yüz', '8 yüz', '12 yüz']),
      hint: 'Küpün her tarafı kare yüzlerden oluşur.',
      successText: 'Küpün 6 yüzü olduğunu doğru buldun.',
      atomIds: ['MAT.3.3.1.1'],
      color: COLORS[0],
      points: SOLID_FACE_POINTS,
      segments: CUBE_SEGMENTS,
      badges: ['3D cisim', 'yüz say'],
    },
    {
      id: 'prism-edges',
      kind: 'solid-edge',
      title: 'Ayrıtları say',
      prompt: 'Dikdörtgen prizmanın kaç ayrıtı vardır?',
      boardTitle: 'Prizma iskeleti',
      boardHint: 'Çizgi gibi görünen bütün dış yollar ayrıttır.',
      answer: '12 ayrıt',
      choices: shuffle(['12 ayrıt', '8 ayrıt', '6 ayrıt']),
      hint: 'Üstte 4, altta 4, arada 4 ayrıt var.',
      successText: 'Prizmanın 12 ayrıtını yakaladın.',
      atomIds: ['MAT.3.3.1.2'],
      color: COLORS[1],
      points: SOLID_FACE_POINTS,
      segments: CUBE_SEGMENTS,
      badges: ['iskelet', '12 çizgi'],
    },
    {
      id: 'tri-prism-corners',
      kind: 'solid-corner',
      title: 'Köşeleri say',
      prompt: 'Üçgen prizmanın kaç köşesi vardır?',
      boardTitle: 'Üçgen prizma',
      boardHint: 'Noktaları tek tek say; hepsi köşedir.',
      answer: '6 köşe',
      choices: shuffle(['6 köşe', '5 köşe', '9 köşe']),
      hint: 'İki üçgenin her birinde 3 köşe bulunur.',
      successText: 'Üçgen prizmanın 6 köşesini doğru saydın.',
      atomIds: ['MAT.3.3.1.3'],
      color: COLORS[2],
      points: TRIANGLE_PRISM_POINTS,
      segments: TRIANGLE_PRISM_SEGMENTS,
      badges: ['2 üçgen', 'köşe say'],
    },
    polygon,
    {
      id: 'ruler-rectangle',
      kind: 'draw',
      title: 'Cetvelle çiz',
      prompt: 'A-B-C-D çivileri sanal cetvelle birleşince hangi şekil oluşur?',
      boardTitle: 'Sanal cetvel izi',
      boardHint: 'Köşeler sırayla bağlanınca iki uzun, iki kısa kenar oluşur.',
      answer: 'Dikdörtgen',
      choices: shuffle(['Dikdörtgen', 'Üçgen', 'Beşgen']),
      hint: 'Karşılıklı kenarlar eş ve paralel görünüyor.',
      successText: 'Sanal cetvelle dikdörtgeni kurdun.',
      atomIds: ['MAT.3.3.3.1'],
      color: COLORS[4],
      points: RECTANGLE_POINTS,
      segments: [
        { from: 'a', to: 'b', length: 4 },
        { from: 'b', to: 'c', length: 2 },
        { from: 'c', to: 'd', length: 4 },
        { from: 'd', to: 'a', length: 2 },
      ],
      badges: ['cetvel', 'A-B-C-D'],
      closeShape: true,
    },
    {
      id: 'perimeter-outside',
      kind: 'perimeter-trace',
      title: 'Çevre yolunu bul',
      prompt: 'Çevre, şeklin hangi kısmıdır?',
      boardTitle: 'Dış kenar yolu',
      boardHint: 'Işıklı lastik şeklin dışından dolanır.',
      answer: 'Dış kenarların toplamı',
      choices: shuffle(['Dış kenarların toplamı', 'İçindeki alan', 'Sadece bir köşe']),
      hint: 'Çevre, şeklin etrafındaki yoldur.',
      successText: 'Çevrenin dış kenar yolu olduğunu gördün.',
      atomIds: ['MAT.3.3.4.1'],
      color: COLORS[5],
      points: RECTANGLE_POINTS,
      segments: closedSegments(RECTANGLE_POINTS),
      badges: ['çevre', 'dış yol'],
      closeShape: true,
    },
    perimeter,
    {
      id: 'square-symmetry-lines',
      kind: 'symmetry-lines',
      title: 'Simetri çizgilerini say',
      prompt: 'Karede kaç simetri doğrusu çizilebilir?',
      boardTitle: 'Kare aynaları',
      boardHint: 'Dikey, yatay ve iki çapraz ayna çizilebilir.',
      answer: '4 simetri doğrusu',
      choices: shuffle(['4 simetri doğrusu', '2 simetri doğrusu', '1 simetri doğrusu']),
      hint: 'Kare iki orta çizgi ve iki çapraz çizgiyle simetriktir.',
      successText: 'Karenin 4 simetri doğrusunu saydın.',
      atomIds: ['MAT.3.3.6.1'],
      color: COLORS[1],
      points: SQUARE_SYMMETRY_POINTS,
      segments: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },
        { from: 'd', to: 'a' },
        { from: 'midTop', to: 'midBottom', dashed: true },
        { from: 'midLeft', to: 'midRight', dashed: true },
        { from: 'a', to: 'c', dashed: true },
        { from: 'b', to: 'd', dashed: true },
      ],
      badges: ['ayna', '4 çizgi'],
    },
    {
      id: 'mirror-complete',
      kind: 'mirror-complete',
      title: 'Aynayı tamamla',
      prompt: 'Sol parçanın aynadaki eksik noktası hangisi?',
      boardTitle: 'Simetri aynası',
      boardHint: 'Her nokta aynaya eşit uzaklıkta durmalı.',
      answer: 'C noktası',
      choices: shuffle(['C noktası', 'A noktası', 'B noktası']),
      hint: 'Eksik nokta aynanın sağında aynı yükseklikte olmalı.',
      successText: 'Aynanın diğer yarısını doğru tamamladın.',
      atomIds: ['MAT.3.3.7.1'],
      color: COLORS[3],
      points: [
        { id: 'a', x: 1.2, y: 1, label: 'A' },
        { id: 'b', x: 1.2, y: 3, label: 'B' },
        { id: 'c', x: 4.2, y: 3, label: 'C', ghost: true },
      ],
      segments: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c', dashed: true }],
      badges: ['ayna', 'eş uzaklık'],
      axisX: 2.7,
    },
    {
      id: 'code-symmetry',
      kind: 'code-symmetry',
      title: 'Kodla yansıt',
      prompt: 'Nokta aynadan 2 kare solda ve 1 kare aşağıda. Yansıması nerede olur?',
      boardTitle: 'Kodlu ayna',
      boardHint: 'Yansıma aynanın öbür tarafında aynı uzaklığı korur.',
      answer: '2 kare sağda, 1 kare aşağıda',
      choices: shuffle(['2 kare sağda, 1 kare aşağıda', '1 kare sağda, 2 kare yukarıda', '2 kare solda, 1 kare yukarıda']),
      hint: 'Sağ-sol değişir, aşağı-yukarı aynı kalır.',
      successText: 'Kodlu simetriyi doğru kurdun.',
      atomIds: ['MAT.3.3.8.1'],
      color: COLORS[0],
      points: [
        { id: 'a', x: 1, y: 3, label: 'Başla' },
        { id: 'b', x: 4, y: 3, label: 'Yansıma', ghost: true },
      ],
      segments: [{ from: 'a', to: 'b', dashed: true }],
      badges: ['2 kare', '1 aşağı'],
      axisX: 2.5,
    },
  ];
}

function polygonTask(id: string, title: string, prompt: string, points: BoardPoint[], answer: string, wrong: string[], badge: string): GeometryBoardTask {
  return {
    id,
    kind: 'polygon',
    title,
    prompt,
    boardTitle: 'Çokgen tarayıcı',
    boardHint: 'Kenar sayısını say, şeklin adını bul.',
    answer,
    choices: shuffle([answer, ...wrong]),
    hint: `${badge} gördüğünde şeklin adı ${answer.toLocaleLowerCase('tr-TR')} olur.`,
    successText: `${answer} adını doğru seçtin.`,
    atomIds: ['MAT.3.3.2.1'],
    color: COLORS[3],
    points,
    segments: closedSegments(points),
    badges: [badge, answer],
    closeShape: true,
  };
}

function perimeterTask(id: string, width: number, height: number, answer: string): GeometryBoardTask {
  return {
    id,
    kind: 'perimeter-sum',
    title: 'Çevreyi topla',
    prompt: `${width} + ${height} + ${width} + ${height} toplam çevre kaç birimdir?`,
    boardTitle: 'Kenar uzunlukları',
    boardHint: 'Bütün dış kenar uzunluklarını topla.',
    answer,
    choices: shuffle([answer, `${width + height} birim`, `${width * height} birim`]),
    hint: 'Çevre için dört dış kenarı da toplarız.',
    successText: 'Kenar uzunluklarını toplayarak çevreyi buldun.',
    atomIds: ['MAT.3.3.4.2'],
    color: COLORS[2],
    points: RECTANGLE_POINTS,
    segments: [
      { from: 'a', to: 'b', length: width },
      { from: 'b', to: 'c', length: height },
      { from: 'c', to: 'd', length: width },
      { from: 'd', to: 'a', length: height },
    ],
    badges: [`${width} birim`, `${height} birim`, answer],
    closeShape: true,
  };
}

function pickBySeed<T>(items: T[], seed: number): T {
  if (items.length === 0) throw new Error('Task pool is empty');
  return items[Math.abs(seed) % items.length] as T;
}

function shuffle<T>(items: T[]): T[] {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item);
}

function closedSegments(points: BoardPoint[]): BoardSegment[] {
  return points.map((point, index) => {
    const next = points[(index + 1) % points.length] ?? point;
    return { from: point.id, to: next.id };
  });
}
