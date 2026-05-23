export const MODULE_ID = 'circle-radar-station';

export const ATOM_IDS = [
  'MAT.12.3.1.1',
  'MAT.12.3.1.2',
  'MAT.12.3.1.3',
  'MAT.12.3.1.4',
  'MAT.12.3.2.1',
  'MAT.12.3.2.2',
  'MAT.12.3.2.3',
] as const;

export const TEST_ID_CONTRACT = [
  'circle-radar-station-scene',
  'circle-radar-station-manipulator',
  'circle-radar-station-secant',
  'circle-radar-station-chord',
  'circle-radar-station-tangent',
  'circle-radar-station-arc',
  'circle-radar-station-inscribed-angle',
  'circle-radar-station-central-angle',
  'circle-radar-station-area',
  'circle-radar-station-check',
  'circle-radar-station-feedback',
  'circle-radar-station-reset',
] as const;

export type RadarTool =
  | 'secant'
  | 'chord'
  | 'tangent'
  | 'arc'
  | 'inscribed-angle'
  | 'central-angle'
  | 'area';

export interface CircleRadarMission {
  id: string;
  title: string;
  prompt: string;
  atomId: (typeof ATOM_IDS)[number];
  expectedTool: RadarTool;
  sensor: string;
  formula: string;
  output: string;
  badge: string;
  mechanism: string;
  success: string;
  proof: string;
  failure: Record<RadarTool, string>;
}

export const toolCopy: Record<RadarTool, { label: string; short: string; hint: string; accent: string }> = {
  secant: {
    label: 'Kesen Işını',
    short: 'iki iz',
    hint: 'Mavi ışın çemberin içinden geçip temas noktalarını tarıyor; karar testte kilitlenir.',
    accent: '#00E5FF',
  },
  chord: {
    label: 'Kiriş Gergisi',
    short: 'iç bağ',
    hint: 'İç gergi iki çember noktasını bağlıyor; parça türü testte kilitlenir.',
    accent: '#00FF88',
  },
  tangent: {
    label: 'Teğet Kilidi',
    short: 'tek temas',
    hint: 'Sarı lazer tek dokunuş hattını tarıyor; diklik kanıtı testten sonra açılır.',
    accent: '#FBBF24',
  },
  arc: {
    label: 'Yay Taraması',
    short: 'eğri iz',
    hint: 'Mor tarama çember üstündeki eğri parçayı izliyor; ölçü testte kilitlenir.',
    accent: '#B388FF',
  },
  'inscribed-angle': {
    label: 'Çevre Açı',
    short: 'çevre göz',
    hint: 'Pembe göz noktası çember üstünden aynı yayı görüyor; oran testte açılır.',
    accent: '#FF4FA3',
  },
  'central-angle': {
    label: 'Merkez Açı',
    short: 'merkez göz',
    hint: 'Merkez kulesi iki yarıçapla yay bölgesini tarıyor; eşleşme testte açılır.',
    accent: '#7DD3FC',
  },
  area: {
    label: 'Alan Taraması',
    short: 'disk',
    hint: 'Yeşil tarama çizgi yerine tüm diski dolduruyor; alan formülü testten sonra açılır.',
    accent: '#A3E635',
  },
};

const wrongBecause = {
  secant: 'İki kesişim bekleyen görevlerde tek dokunuş veya iç ip yeterli olmaz.',
  chord: 'Kiriş görevinde çizgi çemberin dışına taşmaz; yalnız iki çember noktasını içeriden bağlar.',
  tangent: 'Teğet görevinde iki kesişim yoktur; tek temas ve merkezden gelen 90° kanıtı gerekir.',
  arc: 'Yay görevinde doğru parçası değil çember üzerindeki eğrisel parça ölçülür.',
  'inscribed-angle': 'Çevre açı çember üzerindeki bir noktadan bakar ve gördüğü yayı ikiye böler.',
  'central-angle': 'Merkez açı kararında göz noktası çemberin merkezindedir; yay ölçüsünü bire bir verir.',
  area: 'Alan görevi çizgi veya açı değil, tüm daire yüzeyinin πr² taramasıdır.',
} satisfies Record<RadarTool, string>;

function failureFor(expected: RadarTool): Record<RadarTool, string> {
  return {
    secant: expected === 'secant' ? 'Kesen ışını doğru hedef: radar iki kesişim noktasını yakalar.' : wrongBecause.secant,
    chord: expected === 'chord' ? 'Kiriş gergisi doğru hedef: iki çember noktasını içeriden bağlar.' : wrongBecause.chord,
    tangent: expected === 'tangent' ? 'Teğet kilidi doğru hedef: tek temas noktasında 90° yarıçap kanıtı oluşur.' : wrongBecause.tangent,
    arc: expected === 'arc' ? 'Yay taraması doğru hedef: eğrisel çember parçası dereceyle okunur.' : wrongBecause.arc,
    'inscribed-angle': expected === 'inscribed-angle' ? 'Çevre açı doğru hedef: çember üstünden bakıp yayı yarıya indirir.' : wrongBecause['inscribed-angle'],
    'central-angle': expected === 'central-angle' ? 'Merkez açı doğru hedef: merkezden görülen açı yay ölçüsüne eşittir.' : wrongBecause['central-angle'],
    area: expected === 'area' ? 'Alan taraması doğru hedef: tüm disk πr² enerji alanı olarak dolar.' : wrongBecause.area,
  };
}

export const circleRadarMissions: CircleRadarMission[] = [
  {
    id: 'secant-scan',
    title: 'İki kesişim taraması',
    prompt: 'Radar çizgisi çemberin içinden geçip iki ayrı noktada sinyal veriyor. Bu hangi eleman?',
    atomId: 'MAT.12.3.1.1',
    expectedTool: 'secant',
    sensor: 'beklenen iz: iki kesişim',
    formula: 'Kesen: çemberi iki noktada kesen doğru',
    output: 'Kesen',
    badge: '2 Nokta',
    mechanism: 'Mavi ışın çemberin içinden geçer; iki temas noktası aynı anda yanar.',
    success: 'Doğru: kesen doğrusu çemberi iki noktada keser ve radar iki temas işareti üretir.',
    proof: 'İki kesişim noktası varsa çizgi teğet değil kesendir.',
    failure: failureFor('secant'),
  },
  {
    id: 'chord-tension',
    title: 'İç ipi ger',
    prompt: 'İki çember noktası içeriden bağlanıyor; çizgi dışarı taşmıyor. Radar hangi parçayı okur?',
    atomId: 'MAT.12.3.1.2',
    expectedTool: 'chord',
    sensor: 'beklenen iz: iç bağlantı',
    formula: 'Kiriş: çember üstündeki iki noktayı bağlayan parça',
    output: 'Kiriş',
    badge: 'İç İp',
    mechanism: 'Yeşil gergi ipi iki çember noktasını içeriden bağlar, merkezden uzaklık oku belirir.',
    success: 'Doğru: kiriş çember üstündeki iki noktayı içeriden bağlayan doğru parçasıdır.',
    proof: 'Kiriş, doğrunun tamamı değil çember içindeki uçlu parçadır.',
    failure: failureFor('chord'),
  },
  {
    id: 'tangent-lock',
    title: 'Tek temas kilidi',
    prompt: 'Sarı lazer çembere dışarıdan tek noktada değiyor; merkezden gelen yarıçap dik duruyor.',
    atomId: 'MAT.12.3.1.3',
    expectedTool: 'tangent',
    sensor: 'beklenen iz: tek temas + 90°',
    formula: 'Teğet ⟂ yarıçap',
    output: 'Teğet',
    badge: '90°',
    mechanism: 'Teğet lazeri tek dokunuşta kilitlenir; merkezden gelen ışın dik açı mührünü yakar.',
    success: 'Doğru: teğet çembere tek noktada dokunur ve o noktaya çizilen yarıçap teğete diktir.',
    proof: 'Teğet ile temas noktasına giden yarıçap arasında 90° oluşur.',
    failure: failureFor('tangent'),
  },
  {
    id: 'arc-sweep',
    title: 'Yay parçasını boya',
    prompt: 'Radar çember üzerinde eğri bir sinyal parçasını dereceyle tarıyor. Hangi mod açılmalı?',
    atomId: 'MAT.12.3.1.4',
    expectedTool: 'arc',
    sensor: 'beklenen iz: eğrisel yay',
    formula: 'Yay ölçüsü: çember üzerindeki derece izi',
    output: 'Yay 100°',
    badge: 'Yay',
    mechanism: 'Mor tarama halkası iki uç arasında yalnız çember üzerindeki eğrisel parçayı aydınlatır.',
    success: 'Doğru: yay, çemberin iki nokta arasında kalan eğrisel parçasıdır ve dereceyle okunur.',
    proof: 'Yay ölçüsü doğru parçası uzunluğu değil açısal çember izidir.',
    failure: failureFor('arc'),
  },
  {
    id: 'inscribed-angle',
    title: 'Çevre istasyonundan bak',
    prompt: 'Göz noktası çemberin üzerinde; iki ışın aynı yayı görüyor. Açı yayın hangi oranını verir?',
    atomId: 'MAT.12.3.2.1',
    expectedTool: 'inscribed-angle',
    sensor: 'beklenen iz: yay / 2',
    formula: 'Çevre açı = gördüğü yay / 2',
    output: '50°',
    badge: 'Yarım',
    mechanism: 'Pembe çevre istasyonu 100° yayı görür ve açı okuyucu 50° olarak yarıya iner.',
    success: 'Doğru: çevre açı, gördüğü yayın ölçüsünün yarısına eşittir.',
    proof: 'Aynı yayı gören çevre açı merkez açının yarısıdır.',
    failure: failureFor('inscribed-angle'),
  },
  {
    id: 'central-angle',
    title: 'Merkez kulesini aç',
    prompt: 'Göz noktası tam merkezde; iki yarıçap aynı yayı sınırlıyor. Açı ölçüsü neyle eşleşir?',
    atomId: 'MAT.12.3.2.2',
    expectedTool: 'central-angle',
    sensor: 'beklenen iz: merkez = yay',
    formula: 'Merkez açı = gördüğü yay',
    output: '100°',
    badge: 'Eş Ölçü',
    mechanism: 'Mavi merkez kulesinden çıkan iki yarıçap, gördüğü yayla aynı dereceyi gösterir.',
    success: 'Doğru: merkez açı gördüğü yayın ölçüsüne eşittir.',
    proof: 'Açı köşesi merkezdeyse yayın açısal ölçüsü doğrudan merkez açıdır.',
    failure: failureFor('central-angle'),
  },
  {
    id: 'area-field',
    title: 'Tüm diski doldur',
    prompt: 'Radar artık çizgi veya açı değil, çemberin içindeki tüm sinyal alanını hesaplıyor.',
    atomId: 'MAT.12.3.2.3',
    expectedTool: 'area',
    sensor: 'beklenen iz: tüm disk',
    formula: 'A = πr²',
    output: 'πr²',
    badge: 'Alan',
    mechanism: 'Yeşil disk taraması yarıçap karesini yüzeye yayar ve tüm daireyi doldurur.',
    success: 'Doğru: daire alanı, yarıçapın karesi ile π çarpılarak formülize edilir.',
    proof: 'Yarıçap büyüdükçe alan doğrusal değil karesel büyür: A = πr².',
    failure: failureFor('area'),
  },
];

export function isCircleRadarCorrect(mission: CircleRadarMission, tool: RadarTool | null) {
  return tool !== null && tool === mission.expectedTool;
}

export function previewOutput(tool: RadarTool) {
  const outputs: Record<RadarTool, string> = {
    secant: 'ışın izi',
    chord: 'gergi izi',
    tangent: 'temas izi',
    arc: 'eğri iz',
    'inscribed-angle': 'çevre bakışı',
    'central-angle': 'merkez bakışı',
    area: 'disk taraması',
  };

  return outputs[tool];
}
