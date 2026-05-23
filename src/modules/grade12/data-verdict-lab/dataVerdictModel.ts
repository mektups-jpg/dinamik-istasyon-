export const MODULE_ID = 'data-verdict-lab';

export const ATOM_IDS = ['MAT.12.5.1.1'] as const;

export const TEST_ID_CONTRACT = [
  'data-verdict-lab-scene',
  'data-verdict-lab-manipulator',
  'data-verdict-lab-source',
  'data-verdict-lab-filter',
  'data-verdict-lab-chart',
  'data-verdict-lab-verdict',
  'data-verdict-lab-check',
  'data-verdict-lab-feedback',
  'data-verdict-lab-reset',
] as const;

export type SourceTool = 'official' | 'social' | 'classroom';
export type FilterTool = 'sameUnit' | 'median' | 'iqr' | 'trend';
export type VerdictTool = 'evidence' | 'causal' | 'rawHeadline' | 'uncertain';

export interface VerdictRow {
  label: string;
  value: number;
  note: string;
}

export interface DataVerdictMission {
  id: string;
  title: string;
  prompt: string;
  dataset: string;
  metric: string;
  sourceStamp: string;
  expectedSource: SourceTool;
  expectedFilter: FilterTool;
  expectedVerdict: VerdictTool;
  rows: VerdictRow[];
  claim: string;
  conclusion: string;
  proof: string;
  badge: string;
  accent: string;
  failure: Record<SourceTool | FilterTool | VerdictTool, string>;
}

export const sourceCopy: Record<SourceTool, { label: string; short: string; hint: string; accent: string }> = {
  official: {
    label: 'Kurum Verisi',
    short: 'TUIK / WHO / OECD',
    hint: 'Kurum veri portu açıldı; kaynak güveni testte filtre ve yargıyla birlikte sınanacak.',
    accent: '#00E5FF',
  },
  social: {
    label: 'Sosyal Akış',
    short: 'yorum akışı',
    hint: 'Sosyal akış portu açıldı; temsil ve kaynak güveni testte kontrol edilecek.',
    accent: '#FF4FA3',
  },
  classroom: {
    label: 'Sınıf Anketi',
    short: 'yerel örneklem',
    hint: 'Yerel örneklem portu açıldı; 3. parti veri şartı testte kontrol edilecek.',
    accent: '#FBBF24',
  },
};

export const filterCopy: Record<FilterTool, { label: string; short: string; hint: string; accent: string }> = {
  sameUnit: {
    label: 'Aynı Birim',
    short: 'oran / yıl',
    hint: 'Farklı nüfusları ham sayıyla değil, aynı birim ve oranla karşılaştır.',
    accent: '#00E5FF',
  },
  median: {
    label: 'Medyan Işını',
    short: 'orta değer',
    hint: 'Uç değerler tabloyu çekiştiriyorsa orta değeri medyan ışınıyla oku.',
    accent: '#B388FF',
  },
  iqr: {
    label: 'Çeyrek Bant',
    short: 'yayılım',
    hint: 'Verinin istikrarını orta yüzde 50 bandının genişliğiyle tart.',
    accent: '#00FF88',
  },
  trend: {
    label: 'Zaman Tarayıcı',
    short: 'yön',
    hint: 'Yıllara yayılmış hazır veride tek yıl değil, yön değişimini oku.',
    accent: '#FBBF24',
  },
};

export const verdictCopy: Record<VerdictTool, { label: string; short: string; hint: string; accent: string }> = {
  evidence: {
    label: 'Kanıtlı Sonuç',
    short: 'güvenli yargı',
    hint: 'Kanıtlı sonuç taslağı hazır; kaynak, filtre ve grafik testte birlikte sınanacak.',
    accent: '#00FF88',
  },
  causal: {
    label: 'Sebep-Sonuç',
    short: 'neden iddiası',
    hint: 'Sebep-sonuç mührü hazırlandı; veri sınırı testte kontrol edilecek.',
    accent: '#FF4FA3',
  },
  rawHeadline: {
    label: 'Ham Manşet',
    short: 'ham başlık',
    hint: 'Ham manşet kapsülü hazırlandı; birim ve bağlam testte kontrol edilecek.',
    accent: '#FBBF24',
  },
  uncertain: {
    label: 'Belirsiz Bırak',
    short: 'kararsız yargı',
    hint: 'Belirsiz yargı taslağı hazır; veri yeterli mi testte görülecek.',
    accent: '#94A3B8',
  },
};

export const dataVerdictMissions: DataVerdictMission[] = [
  {
    id: 'same-unit-public-rate',
    title: 'Kurum oranını temizle',
    prompt: 'Farklı büyüklükteki bölgeleri ham sayı yerine aynı birimde karşılaştır ve güvenli sonucu mühürle.',
    dataset: 'TUIK 2023 Bölgesel İstihdam Oranı',
    metric: '15+ yaş istihdam oranı (%)',
    sourceStamp: 'TUIK / 2023 / oran',
    expectedSource: 'official',
    expectedFilter: 'sameUnit',
    expectedVerdict: 'evidence',
    rows: [
      { label: 'Bölge A', value: 58, note: 'oran' },
      { label: 'Bölge B', value: 64, note: 'oran' },
      { label: 'Bölge C', value: 49, note: 'oran' },
      { label: 'Bölge D', value: 61, note: 'oran' },
    ],
    claim: 'Bölge B en yüksek orana sahip olabilir.',
    conclusion: '2023 verisinde en yüksek istihdam oranı Bölge B: %64.',
    proof: 'Kurum kaynağı ve aynı yüzde birimi seçildiği için bölgeler adil karşılaştırılır.',
    badge: '%64',
    accent: '#00E5FF',
    failure: {
      official: '',
      social: 'Sosyal akış bu görevde hazır kurumsal veri değil; kaynak mührü güven vermiyor.',
      classroom: 'Yerel sınıf anketi bu atomdaki üçüncü parti hazır veri şartını karşılamıyor.',
      sameUnit: '',
      median: 'Bu tabloda önce aynı birimle bölge oranlarını kıyaslamalısın; medyan ana karar değil.',
      iqr: 'Çeyrek bant yayılımı anlatır; görev en yüksek aynı-birim oranını istiyor.',
      trend: 'Tek yıl bölge kıyasındasın; zaman tarayıcı bu görevde fazla geniş kalır.',
      evidence: '',
      causal: 'Bu veri yalnız oran farkını gösterir; sebep-sonuç iddiası fazla güçlü.',
      rawHeadline: 'Ham manşet birim kanıtını saklar; güvenli sonuç cümlesi gerekir.',
      uncertain: 'Filtre temizken belirsiz bırakma; sonuç cümlesini kanıtla kur.',
    },
  },
  {
    id: 'median-outlier-sensor',
    title: 'Uç değeri sakinleştir',
    prompt: 'Hazır gelir serisinde uç değer ortalamayı çekiyor; merkez kararı için doğru filtreyi seç.',
    dataset: 'OECD 2022 Hane Geliri Örnek Seti',
    metric: 'bin dolar / yıl',
    sourceStamp: 'OECD / 2022 / gelir',
    expectedSource: 'official',
    expectedFilter: 'median',
    expectedVerdict: 'evidence',
    rows: [
      { label: 'P20', value: 32, note: 'alt grup' },
      { label: 'P40', value: 38, note: 'orta alt' },
      { label: 'P60', value: 41, note: 'orta üst' },
      { label: 'P95', value: 88, note: 'uç değer' },
    ],
    claim: 'Tek uç değer merkezi olduğundan yüksek gösterebilir.',
    conclusion: 'Merkez kararında medyan 40 bin dolar bandını gösterir; uç değer ana yargıyı bozmaz.',
    proof: 'Medyan ışını sıralı verinin ortasını okur ve uç değerin etkisini azaltır.',
    badge: 'MEDYAN',
    accent: '#B388FF',
    failure: {
      official: '',
      social: 'Sosyal akış gelir dağılımı için hazır ve denetlenmiş veri seti değildir.',
      classroom: 'Küçük sınıf anketi bu gelir setinin kurum kaynağı yerine geçmez.',
      sameUnit: 'Birimler zaten aynı; sorun uç değerin merkezi bozması.',
      median: '',
      iqr: 'Yayılımı okuyabilirsin ama bu görev merkez kararını güvenli kurduruyor.',
      trend: 'Yıl serisi yok; zaman tarayıcı yerine sıralı merkez filtresi gerekir.',
      evidence: '',
      causal: 'Gelir farkının nedenini bu veri tek başına kanıtlamaz.',
      rawHeadline: 'En yüksek değeri manşet yapmak veri merkezini çarpıtır.',
      uncertain: 'Uç değer kontrol edildiğinde medyanla güvenli sonuç kurulabilir.',
    },
  },
  {
    id: 'iqr-stability-band',
    title: 'İstikrar bandını ölç',
    prompt: 'İki hizmet alanı benzer ortalamaya sahip; hangisinin daha istikrarlı olduğunu orta bantla tart.',
    dataset: 'WHO 2021 Aylık Hizmet Süresi',
    metric: 'bekleme süresi (dk)',
    sourceStamp: 'WHO / 2021 / dakika',
    expectedSource: 'official',
    expectedFilter: 'iqr',
    expectedVerdict: 'evidence',
    rows: [
      { label: 'A Q1', value: 18, note: 'alt çeyrek' },
      { label: 'A Q3', value: 30, note: 'üst çeyrek' },
      { label: 'B Q1', value: 20, note: 'alt çeyrek' },
      { label: 'B Q3', value: 42, note: 'üst çeyrek' },
    ],
    claim: 'Ortalama benzerse yayılım karar verir.',
    conclusion: 'A alanı daha istikrarlı: orta yüzde 50 bandı 12 dk, B alanında 22 dk.',
    proof: 'Çeyrek bant daraldıkça tipik bekleme süreleri birbirine daha yakın kalır.',
    badge: 'IQR 12',
    accent: '#00FF88',
    failure: {
      official: '',
      social: 'Yorum akışı hizmet süresi yargısı için hazır istatistik kaynağı değildir.',
      classroom: 'Yerel anket kurumsal hizmet verisi kapsamını karşılamaz.',
      sameUnit: 'Birimler aynı ama istikrar için yalnız birim yetmez; yayılım bandı gerekir.',
      median: 'Medyan merkezi verir; görev istikrar farkını soruyor.',
      iqr: '',
      trend: 'Bu görev yıl yönü değil, aynı dönemde yayılım kıyaslamasıdır.',
      evidence: '',
      causal: 'Daha istikrarlı görünmesi nedeni kanıtlanmış demek değildir.',
      rawHeadline: 'Tek bir bekleme süresi manşeti orta bandı gizler.',
      uncertain: 'Çeyrek bant netken sonucu belirsiz bırakma.',
    },
  },
  {
    id: 'trend-public-series',
    title: 'Yıl serisini oku',
    prompt: 'Kurumun yayımladığı yıllık oranlarda tek yıl sesi değil, veri yönünü güvenli sonuç cümlesine çevir.',
    dataset: 'Eurostat 2020-2023 Dijital Erişim Oranı',
    metric: 'hane erişimi (%)',
    sourceStamp: 'Eurostat / 4 yıl / oran',
    expectedSource: 'official',
    expectedFilter: 'trend',
    expectedVerdict: 'evidence',
    rows: [
      { label: '2020', value: 66, note: 'başlangıç' },
      { label: '2021', value: 70, note: 'artış' },
      { label: '2022', value: 73, note: 'artış' },
      { label: '2023', value: 78, note: 'son yıl' },
    ],
    claim: 'Dört yıllık veri yönü artışı gösteriyor.',
    conclusion: '2020-2023 arasında dijital erişim %66dan %78e yükselmiş; yön artış.',
    proof: 'Zaman tarayıcı tek noktayı değil ardışık yılların yönünü kilitler.',
    badge: '+12',
    accent: '#FBBF24',
    failure: {
      official: '',
      social: 'Sosyal gönderi dört yıllık kurumsal seri yerine geçmez.',
      classroom: 'Sınıf anketi yıllık kurum serisi değildir.',
      sameUnit: 'Birim aynı ama görev yön okumayı istiyor; yıllar arası tarama seçilmeli.',
      median: 'Medyan tek merkez verir; yıllar arasındaki artış yönünü saklar.',
      iqr: 'Çeyrek bant yayılım içindir; burada zaman akışı okunuyor.',
      trend: '',
      evidence: '',
      causal: 'Artış görülür ama bu artışın tek nedenini veri tek başına kanıtlamaz.',
      rawHeadline: 'Son yıl manşeti dört yıllık yön kanıtını eksik bırakır.',
      uncertain: 'Seri açıkça artarken güvenli sonuç cümlesi kurulabilir.',
    },
  },
];

export function isDataVerdictCorrect(
  mission: DataVerdictMission,
  source: SourceTool | null,
  filter: FilterTool | null,
  verdict: VerdictTool | null,
) {
  return source === mission.expectedSource && filter === mission.expectedFilter && verdict === mission.expectedVerdict;
}

export function explainDataVerdictMismatch(
  mission: DataVerdictMission,
  source: SourceTool | null,
  filter: FilterTool | null,
  verdict: VerdictTool | null,
) {
  if (source === null || filter === null || verdict === null) {
    return 'Yargı sistemi üç kilit ister: kurum kaynağı, doğru filtre ve güvenli sonuç cümlesi.';
  }

  if (source !== mission.expectedSource) return mission.failure[source];
  if (filter !== mission.expectedFilter) return mission.failure[filter];
  return mission.failure[verdict];
}
