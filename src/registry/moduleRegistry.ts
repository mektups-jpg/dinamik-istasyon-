import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type Category = 'Sayılar' | 'Geometri' | 'Fizik' | 'Olasılık' | 'Veri' | 'Cebir' | 'Trigonometri' | 'Geometrik Şekiller';
export type Difficulty = 'Kolay' | 'Orta' | 'Zor';
export type GradeRange = 'İlkokul' | 'Ortaokul' | 'Lise';
export type ModuleStatus = 'active' | 'archived' | 'draft' | 'review-needed' | 'showcase-ready';

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  grade: number;
  path: string;
  component: LazyExoticComponent<ComponentType<Record<string, never>>>;
  thumbnail?: string;
  atomId?: string;
  atomIds?: string[];
  icon?: ComponentType<{ className?: string }>;
  status?: ModuleStatus;
  archiveNote?: string;
}

export const modules: ModuleMeta[] = [
  {
    id: 'fraction-reactor-3',
    title: 'Kesri Şekille Göster',
    description: 'Bütün, yarım, çeyrek, pay ve paydayı şekil üzerinde göster.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/fraction-reactor-3',
    component: lazy(() => import('../modules/grade3/fraction-reactor-3/FractionReactor3App')),
    atomIds: ['MAT.3.1.9.1', 'MAT.3.1.9.2', 'MAT.3.1.9.3', 'MAT.3.1.10.1', 'MAT.3.1.11.1', 'MAT.3.1.11.2'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Kesri Şekille Göster Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'place-value-tower-3',
    title: 'Yüzlük-Onluk-Birlik Kulesi',
    description: "Yüzlük plakaları, onluk çubukları ve birlik küpleriyle 1000'e kadar sayıları kur.",
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/place-value-tower-3',
    component: lazy(() => import('../modules/grade3/place-value-tower-3/PlaceValueTower3App')),
    atomIds: ['MAT.3.1.1.1', 'MAT.3.1.1.2', 'MAT.3.1.2.1', 'MAT.3.1.2.2', 'MAT.3.1.2.3'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Yüzlük-Onluk-Birlik Kulesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'three-digit-order-train',
    title: 'Üç Basamaklı Sıralama Treni',
    description: 'Üç basamaklı sayı vagonlarını küçükten büyüğe ve büyükten küçüğe doğru raylara diz.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/three-digit-order-train',
    component: lazy(() => import('../modules/grade3/three-digit-order-train/ThreeDigitOrderTrainApp')),
    atomIds: ['MAT.3.1.3.1', 'MAT.3.1.3.2'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Üç Basamaklı Sıralama Treni Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'odd-even-pair-lab',
    title: 'Tek-Çift Eşleme',
    description: 'Birler basamağındaki küpleri ikişerli eşleştirerek sayının tek mi çift mi olduğunu bul.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/odd-even-pair-lab',
    component: lazy(() => import('../modules/grade3/odd-even-pair-lab/OddEvenPairLabApp')),
    atomIds: ['MAT.3.1.5.1', 'MAT.3.1.5.2', 'MAT.3.1.5.3'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Tek-Çift Eşleme Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'skip-count-rocket-6-9',
    title: 'Ritmik Sayma Roketi',
    description: 'Roketi altışar, yedişer, sekizer ve dokuzar ritimlerle ileri-geri doğru sayı durağına uçur.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/skip-count-rocket-6-9',
    component: lazy(() => import('../modules/grade3/skip-count-rocket-6-9/SkipCountRocket69App')),
    atomIds: ['MAT.3.1.4.1', 'MAT.3.1.4.2', 'MAT.3.1.4.3', 'MAT.3.1.4.4', 'MAT.3.1.4.5'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Ritmik Sayma Roketi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'operation-lab-3',
    title: 'Dört İşlem Makinesi',
    description: 'Tahmin et, zihinden işlem yap, onluk taşı/boz, kalan modelini ve işlem dengesini çöz.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/operation-lab-3',
    component: lazy(() => import('../modules/grade3/operation-lab-3/OperationLab3App')),
    atomIds: [
      'MAT.3.2.1.1',
      'MAT.3.2.1.2',
      'MAT.3.2.1.3',
      'MAT.3.2.2.1',
      'MAT.3.2.2.2',
      'MAT.3.2.3.1',
      'MAT.3.2.4.1',
      'MAT.3.2.4.2',
      'MAT.3.2.5.1',
      'MAT.3.2.6.1',
      'MAT.3.2.6.2',
      'MAT.3.2.7.1',
      'MAT.3.2.8.1',
    ],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Dört İşlem Makinesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'unit-converter-3',
    title: 'Birim Dönüşüm İstasyonu',
    description: 'Eski birleşik deney: saat, ölçü, para ve sıvı görevleri tek akıştaydı.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/unit-converter-3',
    component: lazy(() => import('../modules/grade3/unit-converter-3/UnitConverter3App')),
    atomIds: [
      'MAT.3.1.12.1',
      'MAT.3.1.12.2',
      'MAT.3.1.13.1',
      'MAT.3.1.13.2',
      'MAT.3.1.14.1',
      'MAT.3.1.15.1',
      'MAT.3.1.15.2',
      'MAT.3.1.16.1',
      'MAT.3.1.16.2',
      'MAT.3.3.5.1',
      'MAT.3.3.5.2',
      'MAT.3.3.5.3',
    ],
    status: 'archived',
    archiveNote: '3. sınıf ölçme ailesi çocuk odağı için küçük atomlara ayrıldı; eski birleşik deney arşivde tutuluyor.'
  },
  {
    id: 'clock-reader-3',
    title: 'Saati Okuyorum',
    description: 'Analog saatte akrep ve yelkovanı okuyup doğru dijital saati seç.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/clock-reader-3',
    component: lazy(() => import('../modules/grade3/clock-reader-3/ClockReader3App')),
    atomIds: ['MAT.3.1.12.1', 'MAT.3.1.12.2'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf saat okuma atomu; 2026-06-07 Kaptan canlı görsel onayıyla Vitrin Hazır.'
  },
  {
    id: 'time-conversion-3',
    title: 'Zaman Dönüşüm Makinesi',
    description: 'Saat-dakika ve dakika-saniye dönüşümlerini 60 kuralıyla kur.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/time-conversion-3',
    component: lazy(() => import('../modules/grade3/time-conversion-3/TimeConversion3App')),
    atomIds: ['MAT.3.1.13.1', 'MAT.3.1.13.2'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf zaman dönüşümü atomu; 2026-06-07 Kaptan canlı görsel onayıyla Vitrin Hazır.'
  },
  {
    id: 'duration-estimate-3',
    title: 'Süre Tahmin Dedektifi',
    description: 'Günlük olayların saniye, dakika ya da saat olarak makul süresini seç.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/duration-estimate-3',
    component: lazy(() => import('../modules/grade3/duration-estimate-3/DurationEstimate3App')),
    atomIds: ['MAT.3.1.14.1'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf süre tahmini atomu; 2026-06-07 Kaptan canlı görsel onayıyla Vitrin Hazır.'
  },
  {
    id: 'length-mass-converter-3',
    title: 'Ölçü Birimi Makinesi',
    description: 'Metre-santimetre ve kilogram-gram dönüşümlerini büyük ölçü kartlarıyla seç.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/length-mass-converter-3',
    component: lazy(() => import('../modules/grade3/length-mass-converter-3/LengthMassConverter3App')),
    atomIds: ['MAT.3.1.15.1', 'MAT.3.1.15.2'],
    status: 'review-needed',
    archiveNote: '3. sınıf uzunluk-kütle dönüşümü atomu; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'money-value-workshop-3',
    title: 'Para Değeri Atölyesi',
    description: 'Kuruşları 1 TL’ye tamamla ve farklı paraların toplam değerini bul.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/money-value-workshop-3',
    component: lazy(() => import('../modules/grade3/money-value-workshop-3/MoneyValueWorkshop3App')),
    atomIds: ['MAT.3.1.16.1', 'MAT.3.1.16.2'],
    status: 'review-needed',
    archiveNote: '3. sınıf para değeri atomu; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'liquid-measure-workshop-3',
    title: 'Litre Ölçme Atölyesi',
    description: 'Litre kaplarını say, mililitreleri birleştir ve 1 litreye tamamlama yap.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/measure/liquid-measure-workshop-3',
    component: lazy(() => import('../modules/grade3/liquid-measure-workshop-3/LiquidMeasureWorkshop3App')),
    atomIds: ['MAT.3.3.5.1', 'MAT.3.3.5.2', 'MAT.3.3.5.3'],
    status: 'review-needed',
    archiveNote: '3. sınıf sıvı ölçme atomu; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'geometry-board-3',
    title: 'Dijital Geometri Tahtası',
    description: 'Çivili tahtada cisim özelliklerini say, çokgeni tanı, çevreyi dolaş ve simetriyi tamamla.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/geometry/geometry-board-3',
    component: lazy(() => import('../modules/grade3/geometry-board-3/GeometryBoard3App')),
    atomIds: [
      'MAT.3.3.1.1',
      'MAT.3.3.1.2',
      'MAT.3.3.1.3',
      'MAT.3.3.2.1',
      'MAT.3.3.3.1',
      'MAT.3.3.4.1',
      'MAT.3.3.4.2',
      'MAT.3.3.6.1',
      'MAT.3.3.7.1',
      'MAT.3.3.8.1',
    ],
    status: 'review-needed',
    archiveNote: '3. sınıf Dijital Geometri Tahtası üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'bar-chart-terminal-3',
    title: 'Sütun Grafiği Terminali',
    description: 'Veri tablosunu oku, sütun grafiğini oluştur ve grafikten doğru kararı ver.',
    category: 'Olasılık',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/data/bar-chart-terminal-3',
    component: lazy(() => import('../modules/grade3/bar-chart-terminal-3/BarChartTerminal3App')),
    atomIds: ['MAT.3.4.1.1', 'MAT.3.4.1.2', 'MAT.3.4.1.3'],
    status: 'showcase-ready',
    archiveNote: '3. sınıf Sütun Grafiği Terminali, Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'data-capsule-4',
    title: 'Altı Basamaklı Sayı Dedektifi',
    description: 'Altı basamaklı sayıları oku, çözümle, sırala ve sayı örüntüsünü tamamla.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/numbers/data-capsule-4',
    component: lazy(() => import('../modules/grade4/data-capsule-4/DataCapsule4App')),
    atomIds: [
      'MAT.4.1.1.1',
      'MAT.4.1.1.2',
      'MAT.4.1.2.1',
      'MAT.4.1.2.2',
      'MAT.4.1.2.3',
      'MAT.4.1.2.4',
      'MAT.4.1.3.1',
      'MAT.4.1.3.2',
      'MAT.4.1.4.1',
      'MAT.4.1.4.2',
      'MAT.4.1.5.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Altı Basamaklı Sayı Dedektifi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'zero-engine-4',
    title: 'İşlem Kısayolları Atölyesi',
    description: 'Sıfır ekle-sil, tahmin et, elde/bozma adımlarını seç ve eşitlikte eksik sayıyı bul.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/algebra/zero-engine-4',
    component: lazy(() => import('../modules/grade4/zero-engine-4/ZeroEngine4App')),
    atomIds: [
      'MAT.4.2.1.1',
      'MAT.4.2.1.2',
      'MAT.4.2.2.1',
      'MAT.4.2.2.2',
      'MAT.4.2.3.1',
      'MAT.4.2.4.1',
      'MAT.4.2.4.2',
      'MAT.4.2.4.3',
      'MAT.4.2.4.4',
      'MAT.4.2.6.1',
      'MAT.4.2.9.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf İşlem Kısayolları Atölyesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'fraction-balance-4',
    title: 'Kesir Denge Terazisi',
    description: 'Kesir türlerini, denk kesirleri, karşılaştırmayı ve eş paydalı işlemleri görsel tanklarla kur.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/numbers/fraction-balance-4',
    component: lazy(() => import('../modules/grade4/fraction-balance-4/FractionBalance4App')),
    atomIds: [
      'MAT.4.1.6.1',
      'MAT.4.1.6.2',
      'MAT.4.1.6.3',
      'MAT.4.1.7.1',
      'MAT.4.1.7.2',
      'MAT.4.1.8.1',
      'MAT.4.1.9.1',
      'MAT.4.1.10.1',
      'MAT.4.1.10.2',
      'MAT.4.1.11.1',
      'MAT.4.1.11.2',
      'MAT.4.1.12.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Kesir Denge Terazisi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'net-perimeter-table-4',
    title: 'Açınım ve Çevre Keşfi',
    description: 'Açınımı tanı, eş kenarı bul, çevreyi dolaş, alanı tahmin et ve simetri-kodlama desenini tamamla.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/geometry/net-perimeter-table-4',
    component: lazy(() => import('../modules/grade4/net-perimeter-table-4/NetPerimeterTable4App')),
    atomIds: [
      'MAT.4.3.1.1',
      'MAT.4.3.2.1',
      'MAT.4.3.2.2',
      'MAT.4.3.3.1',
      'MAT.4.3.4.1',
      'MAT.4.3.8.1',
      'MAT.4.3.9.1',
      'MAT.4.3.10.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Açınım ve Çevre Keşfi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'angle-turn-wheel-4',
    title: 'Açı Ölçme Çarkı',
    description: 'Menteşeli kapı modelinde dönmeyi izle, iletkiyi yerleştir ve dik-dar-geniş açıları sınıflandır.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/geometry/angle-turn-wheel-4',
    component: lazy(() => import('../modules/grade4/angle-turn-wheel-4/AngleTurnWheel4App')),
    atomIds: [
      'MAT.4.3.5.1',
      'MAT.4.3.6.1',
      'MAT.4.3.7.1',
      'MAT.4.3.7.2',
      'MAT.4.3.7.3',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Açı Ölçme Çarkı Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'network-optimization-terminal-4',
    title: 'Ölçü, Olasılık ve Veri İstasyonu',
    description: 'Ölçü dönüşümlerini yap, olasılık etiketlerini seç ve iki veri grubunu grafikte karşılaştır.',
    category: 'Olasılık',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/data/network-optimization-terminal-4',
    component: lazy(() => import('../modules/grade4/network-optimization-terminal-4/NetworkOptimizationTerminal4App')),
    atomIds: [
      'MAT.4.1.13.1',
      'MAT.4.1.13.2',
      'MAT.4.1.13.3',
      'MAT.4.1.13.4',
      'MAT.4.4.1.1',
      'MAT.4.4.1.2',
      'MAT.4.4.1.3',
      'MAT.4.4.2.1',
    ],
    status: 'archived',
    archiveNote: 'Ölçü dönüşümü, olasılık ve veri grafiği üç ayrı ilkokul atomuna bölündüğü için arşivlendi.'
  },
  {
    id: 'unit-converter-4',
    title: 'Ölçü Dönüşüm Makinesi',
    description: 'Milimetre, santimetre, metre, ton, kilogram ve gram dönüşümlerini tek makinede kur.',
    category: 'Fizik',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/measure/unit-converter-4',
    component: lazy(() => import('../modules/grade4/unit-converter-4/UnitConverter4App')),
    atomIds: [
      'MAT.4.1.13.1',
      'MAT.4.1.13.2',
      'MAT.4.1.13.3',
      'MAT.4.1.13.4',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Ölçü Dönüşüm Makinesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'probability-label-lab-4',
    title: 'Olasılık Etiketleri',
    description: 'Günlük olayları imkânsız, kesin ve olabilir etiketleriyle ayır.',
    category: 'Olasılık',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/data/probability-label-lab-4',
    component: lazy(() => import('../modules/grade4/probability-label-lab-4/ProbabilityLabelLab4App')),
    atomIds: [
      'MAT.4.4.1.1',
      'MAT.4.4.1.2',
      'MAT.4.4.1.3',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Olasılık Etiketleri Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'two-group-bar-chart-4',
    title: 'İki Sınıf Grafiği',
    description: 'İki sınıfın sütunlarını karşılaştır, çok-az-fark kararlarını grafikten ver.',
    category: 'Veri',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/data/two-group-bar-chart-4',
    component: lazy(() => import('../modules/grade4/two-group-bar-chart-4/TwoGroupBarChart4App')),
    atomIds: [
      'MAT.4.4.2.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf İki Sınıf Grafiği Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'division-estimate-4',
    title: 'Bölme Tahmini',
    description: 'Bölme işlemini yapmadan önce sayıyı yuvarla ve yaklaşık sonucu seç.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 4,
    path: '/embed/numbers/division-estimate-4',
    component: lazy(() => import('../modules/grade4/division-estimate-4/DivisionEstimate4App')),
    atomIds: [
      'MAT.4.2.3.2',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Bölme Tahmini, Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'division-detective-4',
    title: 'Bölme Dedektifi',
    description: 'Kalansız bölmede kalan yok bilgisini, kalanlı bölmede bölüm ve kalanı doğru oku.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/numbers/division-detective-4',
    component: lazy(() => import('../modules/grade4/division-detective-4/DivisionDetective4App')),
    atomIds: [
      'MAT.4.2.5.2',
      'MAT.4.2.5.3',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Bölme Dedektifi, Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'long-multiplication-factory-4',
    title: 'Uzun Çarpma Fabrikası',
    description: 'Birler ve onlar sonuçlarını bul, uzun çarpma sonucunu tamamla.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/numbers/long-multiplication-factory-4',
    component: lazy(() => import('../modules/grade4/long-multiplication-factory-4/LongMultiplicationFactory4App')),
    atomIds: [
      'MAT.4.2.5.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Uzun Çarpma Fabrikası, Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'problem-studio-4',
    title: 'Problem Kur ve Çöz Atölyesi',
    description: 'İşlem sırasını seç, hikaye problemini çöz ve verilen işleme uygun problem kur.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/algebra/problem-studio-4',
    component: lazy(() => import('../modules/grade4/problem-studio-4/ProblemStudio4App')),
    atomIds: [
      'MAT.4.2.7.1',
      'MAT.4.2.8.1',
    ],
    status: 'showcase-ready',
    archiveNote: '4. sınıf Problem Kur ve Çöz Atölyesi, Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'neon-route',
    title: 'Neon Rota Terminali',
    description: 'Uzay ızgarasında doğru parçaları çizerek hedeflere lazer bağla ve konum tespit sistemini tamir et.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 5,
    path: '/embed/geometry/neon-route',
    component: lazy(() => import('../modules/geometry/neon-route/NeonRouteApp'))
  },
  {
    id: 'magnitude-core',
    title: 'Devasa Nicelik Çekirdeği',
    description: '9 haneli dev sayılar ve sadece 0-1 arasında var olabilen olasılık evreni vizyon simülatörü.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/numbers/magnitude-core',
    component: lazy(() => import('../modules/numbers/magnitude-core/MagnitudeCoreApp'))
  },
  {
    id: 'equation-lab',
    title: 'Algoritmik Denklem Laboratuvarı',
    description: 'Terazide eşitliği sağla ve işlem önceliği (parantez, çarpma, bölme) kalkanlarını kırarak hedefe ulaş.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/algebra/equation-lab',
    component: lazy(() => import('../modules/algebra/equation-lab/EquationLabApp'))
  },
  {
    id: 'fraction-synchronizer',
    title: 'İleri Kesir Senkronizatörü',
    description: 'Sıvı tanklarını kontrol ederek tam sayılı kesirleri bileşik kesirlere dönüştür, paydaları eşitleyerek büyüklük sıralamasını keşfet.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/numbers/fraction-synchronizer',
    component: lazy(() => import('../modules/numbers/fraction-synchronizer/FractionSynchronizerApp'))
  },
  {
    id: 'trig-pendulum',
    title: 'Trigonometrik Sarkaç',
    description: 'Birim çember üzerindeki hareketin nasıl sinüs ve kosinüs dalgalarına dönüştüğünü keşfet.',
    category: 'Trigonometri',
    difficulty: 'Zor',
    grade: 11,
    path: '/embed/trig/pendulum',
    component: lazy(() => import('../modules/trig/pendulum/TrigPendulumApp')),
    status: 'archived',
    archiveNote: 'Eski dalga deneyi. 11. sınıf aktif akışında yerini Trigonometrik Osiloskop aldı.'
  },
  {
    id: 'algebraic-dimensions',
    title: 'Cebirsel Boyut Odası',
    description: 'Bir değişkenin (x) nasıl 1D çizgi, 2D alan ve 3D hacim oluşturduğunu simüle et.',
    category: 'Cebir',
    difficulty: 'Zor',
    grade: 8,
    path: '/embed/algebra/dimensions',
    component: lazy(() => import('../modules/algebra/dimensions/AlgebraicDimensionsApp'))
  },
  {
    id: 'absolute-value',
    title: 'Sıfıra Uzaklık Aynası: Mutlak Değer',
    description: 'Sıfır noktasındaki aynaya lazerler göndererek negatif uzaklık efsanesini çürüt.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 6,
    path: '/embed/numbers/absolute-value',
    component: lazy(() => import('../modules/numbers/absolute-value/AbsoluteValueApp'))
  },
  {
    id: 'coord-terminal',
    title: 'Holografik Lazer Ağı: Analitik Geometri',
    description: 'X ve Y lazer sürgülerini kullanarak uzaydaki hedeflerin koordinatlarını tespit et.',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 8,
    path: '/embed/geometry/coordinate-terminal',
    component: lazy(() => import('../modules/geometry/coordinate-terminal/CoordinateTerminalApp'))
  },
  {
    id: 'gear-ratio',
    title: 'Kinetik Oran Laboratuvarı',
    description: 'Dişli çarkları kullanarak ters orantı matematiğini canlı simülasyon üzerinden test edin.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 7,
    path: '/embed/algebra/gear-ratio',
    component: lazy(() => import('../modules/algebra/gear-ratio/GearRatioApp'))
  },
  {
    id: 'digit-count-garden',
    title: 'Rakam Bahçesi',
    description: 'Parlayan tohumları say, doğru rakam kartına dokun ve sayı-çokluk bağını kur.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/digit-count-garden',
    component: lazy(() => import('../modules/grade1/digit-count-garden/DigitCountGardenApp')),
    atomIds: ['MAT.1.1.1.1', 'MAT.1.1.1.4', 'MAT.1.1.1.5'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Rakam Bahçesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'ordinal-rocket-line',
    title: 'Sıra Roketi',
    description: 'Soldan sağa say, istenen sıradaki roketi seç ve sıra sayılarını kilitle.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/ordinal-rocket-line',
    component: lazy(() => import('../modules/grade1/ordinal-rocket-line/OrdinalRocketLineApp')),
    atomIds: ['MAT.1.1.3.1', 'MAT.1.1.3.2'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Sıra Roketi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'equality-balance-lab',
    title: 'Denge Terazisi',
    description: 'Enerji küplerini dengele, eşittir işaretinin iki tarafı aynı tuttuğunu gör.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/equality-balance-lab',
    component: lazy(() => import('../modules/grade1/equality-balance-lab/EqualityBalanceLabApp')),
    atomIds: ['MAT.1.2.3.1', 'MAT.1.2.3.2'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Denge Terazisi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'number-line',
    title: 'Sayı Doğrusunda İlerleme',
    description: 'Robotu sayı doğrusunda ileri götürerek toplama ve artma mantığını keşfedin.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/number-line',
    component: lazy(() => import('../modules/numbers/number-line/NumberLineApp')),
    atomIds: ['MAT.1.1.5.1', 'MAT.1.2.1.1'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Sayı Doğrusunda İlerleme Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'number-line-sub',
    title: 'Sayı Doğrusunda Çıkarma',
    description: 'Enerjisi azalan robotu geriye doğru zıplatarak çıkarma işleminin mantığını kavrayın.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/number-line-sub',
    component: lazy(() => import('../modules/numbers/number-line-sub/NumberLineSubApp')),
    atomIds: ['MAT.1.1.5.2', 'MAT.1.2.1.2'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Sayı Doğrusunda Çıkarma Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'data-flow-screen',
    title: 'Renkli Paket Tablosu',
    description: 'Renkli paketleri doğru renk kutusuna koy, çizgileri say ve en çok-en az olanı bul.',
    category: 'Veri',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/data/data-flow-screen',
    component: lazy(() => import('../modules/grade1/data-flow-screen/DataFlowScreenApp')),
    atomIds: ['MAT.1.4.1.1', 'MAT.1.4.1.2', 'MAT.1.4.1.3'],
    status: 'showcase-ready',
    archiveNote: '1. sınıf Renkli Paket Tablosu 2026-06-10 Kaptan canlı görsel onayıyla Vitrin Hazır.'
  },
  {
    id: 'base-10-factory',
    title: 'Onluk-Birlik Çözümleme',
    description: 'Gelen ham sayı enerjilerini onluk çubuklara ve birlik küplere ayrıştırarak makineleri çalıştırın.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 2,
    path: '/embed/numbers/base-10-factory',
    component: lazy(() => import('../modules/numbers/base-10-factory/Base10FactoryApp')),
    atomIds: ['MAT.2.1.2.1', 'MAT.2.1.2.2', 'MAT.2.1.2.3'],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Onluk-Birlik Çözümleme Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'hundred-box-count',
    title: 'Sayı Oluşturma',
    description: "Onluk çubukları ve birlik küplerinden sayıyı oluştur, doğru sayı kartını seç.",
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/hundred-box-count',
    component: lazy(() => import('../modules/grade2/hundred-box-count/HundredBoxCountApp')),
    atomIds: ['MAT.2.1.1.1', 'MAT.2.1.1.2'],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Sayı Oluşturma Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'two-digit-order-train',
    title: 'Sayı Sıralama Treni',
    description: 'İki basamaklı sayı vagonlarını küçükten büyüğe ve büyükten küçüğe doğru raylara diz.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/two-digit-order-train',
    component: lazy(() => import('../modules/grade2/two-digit-order-train/TwoDigitOrderTrainApp')),
    atomIds: ['MAT.2.1.3.1', 'MAT.2.1.3.2'],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Sayı Sıralama Treni Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'skip-count-rocket',
    title: 'Ritim Roketi 2-5',
    description: 'Roketi ikişer, üçer, dörder ve beşer ritimlerle ileri-geri doğru sayı durağına uçur.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/skip-count-rocket',
    component: lazy(() => import('../modules/grade2/skip-count-rocket/SkipCountRocketApp')),
    atomIds: [
      'MAT.2.1.4.1',
      'MAT.2.1.4.2',
      'MAT.2.1.4.3',
      'MAT.2.1.4.4',
      'MAT.2.1.4.5',
      'MAT.2.1.4.6',
      'MAT.2.1.4.7',
      'MAT.2.1.4.8',
    ],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Ritim Roketi 2-5 Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'cargo-grouping-band-2',
    title: 'Eş Gruplar Kargo Bandı',
    description: 'Kargoları eş kutularla say, çarpma işlemini seç, eşit paylaştır ve tur sayısını bul.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/cargo-grouping-band-2',
    component: lazy(() => import('../modules/grade2/cargo-grouping-band-2/CargoGroupingBand2App')),
    atomIds: [
      'MAT.2.2.4.1',
      'MAT.2.2.4.2',
      'MAT.2.2.4.3',
      'MAT.2.2.4.4',
      'MAT.2.2.5.1',
    ],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Eş Gruplar Kargo Bandı 2026-06-10 Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'quantum-balance-2',
    title: 'Kuantum Denge Terazisi',
    description: 'Eksik sayıyı bul, toplama ve çıkarmayı aynı terazide dengede tut.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/quantum-balance-2',
    component: lazy(() => import('../modules/grade2/quantum-balance-2/QuantumBalance2App')),
    atomIds: [
      'MAT.2.2.3.1',
      'MAT.2.2.3.2',
      'MAT.2.2.3.3',
      'MAT.2.2.6.1',
    ],
    status: 'review-needed',
    archiveNote: '2. sınıf Kuantum Denge Terazisi üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'fraction-pizza-workshop',
    title: 'Yarım-Çeyrek Pizza Atölyesi',
    description: 'Pizza parçalarını kullanarak bütün, yarım ve çeyrek ilişkisini görsel olarak kur.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/fraction-pizza-workshop',
    component: lazy(() => import('../modules/grade2/fraction-pizza-workshop/FractionPizzaWorkshopApp')),
    atomIds: ['MAT.2.1.7.1', 'MAT.2.1.7.2', 'MAT.2.1.7.3', 'MAT.2.1.7.4'],
    status: 'showcase-ready',
    archiveNote: '2. sınıf Yarım-Çeyrek Pizza Atölyesi Kaptan canlı görsel onayıyla Showcase Ready.'
  },
  {
    id: 'hologram-design-base-2',
    title: 'Hologram Tasarım Üssü',
    description: 'Şekil ve cisimlerden model kur, aynayı bul, örüntüyü ve kroki yolunu tamamla.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/geometry/hologram-design-base-2',
    component: lazy(() => import('../modules/grade2/hologram-design-base-2/HologramDesignBase2App')),
    atomIds: [
      'MAT.2.3.2.1',
      'MAT.2.3.3.1',
      'MAT.2.3.7.1',
      'MAT.2.3.7.2',
      'MAT.2.1.5.1',
      'MAT.2.1.5.2',
      'MAT.2.3.6.1',
    ],
    status: 'review-needed',
    archiveNote: '2. sınıf Hologram Tasarım Üssü üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'calibration-tower',
    title: 'Kalibrasyon Kulesi',
    description: 'Analog saatleri oku, dijital saati kur, sıvı ve uzunluk ölçülerini doğru araçlarla tahmin et.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/measure/calibration-tower',
    component: lazy(() => import('../modules/grade2/calibration-tower/CalibrationTowerApp')),
    atomIds: [
      'MAT.2.1.9.1',
      'MAT.2.1.9.2',
      'MAT.2.1.9.3',
      'MAT.2.1.9.4',
      'MAT.2.1.10.1',
      'MAT.2.1.10.2',
      'MAT.2.1.11.1',
      'MAT.2.1.11.2',
      'MAT.2.3.5.1',
      'MAT.2.3.5.2',
    ],
    status: 'review-needed',
    archiveNote: '2. sınıf Kalibrasyon Kulesi üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'data-core-2',
    title: 'Veri Çekirdeği',
    description: 'Veri paketlerini tahmin et, iki gruplu çeteleyi oku, grafik farkını bul ve sayı kartlarını sırala.',
    category: 'Olasılık',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/data/data-core-2',
    component: lazy(() => import('../modules/grade2/data-core-2/DataCore2App')),
    atomIds: ['MAT.2.4.1.1', 'MAT.2.4.1.2', 'MAT.2.1.6.1', 'MAT.2.1.3.1', 'MAT.2.1.3.2'],
    status: 'review-needed',
    archiveNote: '2. sınıf Veri Çekirdeği üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'canteen-cash-terminal',
    title: 'Kasa Terminali',
    description: 'Fiyat etiketini oku, doğru para toplamını seç ve para üstünü bul.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 2,
    path: '/embed/numbers/canteen-cash-terminal',
    component: lazy(() => import('../modules/grade2/canteen-cash-terminal/CanteenCashTerminalApp')),
    atomIds: ['MAT.2.1.8.1', 'MAT.2.1.8.2'],
    status: 'review-needed',
    archiveNote: '2. sınıf Kasa Terminali üretildi; Kaptan canlı göz onayı bekliyor.'
  },
  {
    id: 'unit-circle',
    title: 'Trigonometrik Birim Çember',
    description: 'Sinüs, Kosinüs ve Tanjant değerlerini interaktif birim çember üzerinde keşfedin. Özel açıları bularak puan kazanın!',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 11,
    path: '/embed/geometry/unit-circle',
    component: lazy(() => import('../modules/geometry/unit-circle/UnitCircleApp')),
    status: 'archived',
    archiveNote: 'Eski keşif aracı. Sin/cos kısmı Trigonometrik Osiloskop ile, tan/cot kısmı Tanjant Asimptot Kapıları ile yenilenecek.'
  },
  {
    id: 'cylinder-3d',
    title: '3D Silindir Açılımı',
    description: 'Dikdörtgenin kıvrılarak silindire dönüşümünü 3D olarak inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    grade: 8,
    path: '/embed/geometry/cylinder-3d',
    component: lazy(() => import('../modules/geometry/cylinder-3d/CylinderApp'))
  },
  {
    id: 'prism-3d',
    title: '3D Prizma Açılımı',
    description: 'Bir dikdörtgenler prizmasının (kutunun) 6 yüzeyinin nasıl katlanıp açıldığını 3D olarak inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Kolay',
    grade: 8,
    path: '/embed/geometry/prism-3d',
    component: lazy(() => import('../modules/geometry/prism-3d/PrismApp'))
  },
  {
    id: 'cube-3d',
    title: '3D Küp Açılımı',
    description: 'Küpün 6 eş kareden oluşan açılımını (Kuantum Zarı) inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Kolay',
    grade: 8,
    path: '/embed/geometry/cube-3d',
    component: lazy(() => import('../modules/geometry/cube-3d/CubeApp'))
  },
  {
    id: 'pyramid-3d',
    title: 'Kare Dik Piramit',
    description: 'Kare taban ve 4 üçgenden oluşan piramidi 3D katlayın.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    grade: 8,
    path: '/embed/geometry/pyramid-3d',
    component: lazy(() => import('../modules/geometry/pyramid-3d/PyramidApp'))
  },
  {
    id: 'cone-3d',
    title: '3D Koni Açılımı',
    description: 'Daire taban ve sektörel yan yüzeyden oluşan koniyi uzayda canlandırın.',
    category: 'Geometrik Şekiller',
    difficulty: 'Zor',
    grade: 8,
    path: '/embed/geometry/cone-3d',
    component: lazy(() => import('../modules/geometry/cone-3d/ConeApp'))
  },
  {
    id: 'vector-design-panel',
    title: 'Vektörel Tasarım Paneli',
    description: 'Doğru, ışın ve parçalarıyla uzayı böl. Lazerlerin kesiştiği yerde sanal iletkiyle komşu ve ters açıları tespit et!',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/geometry/vector-design-panel',
    component: lazy(() => import('../modules/geometry/vector-design-panel/VectorDesignApp'))
  },
  {
    id: 'triangular-prism-3d',
    title: 'Üçgen Prizma Açılımı',
    description: 'Kamp çadırı formundaki üçgen prizmasını 3D parçalara ayırarak incele.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    grade: 8,
    path: '/embed/geometry/triangular-prism-3d',
    component: lazy(() => import('../modules/geometry/triangular-prism-3d/TriangularPrismApp'))
  },
  {
    id: 'galton-board',
    title: 'Galton Tahtası',
    description: 'Rastgeleliğin ve normal dağılımın (çan eğrisi) görselleştirilmiş hali.',
    category: 'Olasılık',
    difficulty: 'Zor',
    grade: 12,
    path: '/embed/probability/galton-board',
    component: lazy(() => import('../modules/probability/galton-board/GaltonApp')),
    status: 'archived',
    archiveNote: 'Eski olasılık deneyi. 12. sınıf yeni üretim paketi Review Needed modüllerden ilerleyecek.'
  },
  {
    id: 'identity-blocks',
    title: 'Özdeşlik Blokları',
    description: 'Cebirsel ifadeleri görsel bloklarla eşleştirerek öğrenin.',
    category: 'Cebir',
    difficulty: 'Kolay',
    grade: 7,
    path: '/embed/algebra/identity-blocks',
    component: lazy(() => import('../modules/algebra/identity-blocks/IdentityApp'))
  },
  {
    id: 'laser-defense',
    title: 'Lazer Savunma',
    description: 'Açıları ve yansıma kurallarını kullanarak hedefleri vurun.',
    category: 'Fizik',
    difficulty: 'Orta',
    grade: 11,
    path: '/embed/physics/laser-defense',
    component: lazy(() => import('../modules/physics/laser-defense/LaserApp')),
    status: 'archived',
    archiveNote: 'Fizik/yansıma prototipi. 11. sınıf matematik makro atom kuyruğundan ayrıldı.'
  },
  {
    id: 'pythagoras',
    title: 'Pisagor Su İspatı',
    description: 'Dik üçgenin kenarlarındaki karelerin alan ilişkisini su ile görselleştirin.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 8,
    path: '/embed/geometry/pythagoras',
    component: lazy(() => import('../modules/geometry/pythagoras/PythagorasApp'))
  },
  {
    id: 'slope-rollercoaster',
    title: 'Eğim Rollercoaster',
    description: 'Yerçekimi ve eğim ilişkisini interaktif bir rollercoaster ile keşfedin.',
    category: 'Fizik',
    difficulty: 'Orta',
    grade: 11,
    path: '/embed/physics/slope-rollercoaster',
    component: lazy(() => import('../modules/physics/slope-rollercoaster/RollercoasterApp')),
    status: 'archived',
    archiveNote: 'Eski eğim/fizik prototipi. 11. sınıf aktif matematik modüllerinden ayrıldı.'
  },
  {
    id: 'polygon-collision-test',
    title: 'Poligon Çatışma Testi',
    description: 'Üçgen oluşturmak için çubukların uzunluklarıyla oyna ve Üçgen Eşitsizliğini keşfet!',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/geometry/polygon-collision-test',
    component: lazy(() => import('../modules/geometry/polygon-collision-test/PolygonCollisionApp'))
  },
  {
    id: 'optic-laser-lab',
    title: 'Optik Lazer Labirenti',
    description: 'Paralel doğruları kesen bir lazer atarak Z, U, M kurallarını test et.',
    grade: 6,
    category: 'Geometri',
    difficulty: 'Orta',
    path: '/embed/geometry/optic-laser-lab',
    component: lazy(() => import('../modules/geometry/optic-laser-lab/OpticLaserApp'))
  },
  {
    id: 'area-pi-lab',
    title: 'Geometrik Alan ve Pi Laboratuvarı',
    description: 'Şekil alanlarının doğuşunu bükerek ispatla ve tekerleği döndürerek Pi sabitini keşfet!',
    grade: 6,
    category: 'Geometri',
    difficulty: 'Orta',
    path: '/embed/geometry/area-pi-lab',
    component: lazy(() => import('../modules/geometry/area-pi-lab/AreaPiApp'))
  },
  {
    id: 'radical-power-reactor',
    title: 'Kök ve Üs Reaktörü',
    description: 'Üslü ifadeleri reaktörde birleştir, köklü ifadelerde tam kare parçayı kökten ayır.',
    grade: 9,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: [
      'MAT.9.1.1.1',
      'MAT.9.1.1.2',
      'MAT.9.1.2.1',
      'MAT.9.1.2.2'
    ],
    path: '/embed/numbers/radical-power-reactor',
    component: lazy(() => import('../modules/grade9/radical-power-reactor/RadicalPowerReactorApp'))
  },
  {
    id: 'function-hologram-room',
    title: 'Fonksiyonel Hologram Odası',
    description: 'f(x)=x lazerini iki kontrol düğümüyle taşı ve eğ; a, r, k parametrelerinin grafiği nasıl değiştirdiğini canlı gör.',
    grade: 9,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.9.2.1.1',
      'MAT.9.2.1.2',
      'MAT.9.2.1.3',
      'MAT.9.2.1.4'
    ],
    path: '/embed/algebra/function-hologram-room',
    component: lazy(() => import('../modules/grade9/function-hologram-room/FunctionHologramRoomApp'))
  },
  {
    id: 'equation-submarine',
    title: 'Denklem Denizaltısı',
    description: 'İki bilinmeyenli doğrusal denklem sistemlerini taraf tarafa toplayarak ve yerine koyarak çözün. Denizaltının reaktörünü onarın!',
    grade: 9,
    category: 'Cebir',
    difficulty: 'Orta',
    atomId: 'MAT.9.2.3.1',
    path: '/embed/algebra/equation-submarine',
    component: lazy(() => import('../modules/algebra/equation-submarine/EquationSubmarineApp'))
  },
  {
    id: 'logic-circuit-lab',
    title: 'Akıllı Mantık Devreleri',
    description: 'A/B anahtarlarını açıp kapatarak VE, VEYA, İSE ve YA DA kapılarının çıkış sinyalini canlı devrede gör.',
    grade: 9,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.9.3.2.1',
      'MAT.9.3.2.2',
      'MAT.9.3.2.3',
      'MAT.9.3.2.4'
    ],
    path: '/embed/algebra/logic-circuit-lab',
    component: lazy(() => import('../modules/grade9/logic-circuit-lab/LogicCircuitLabApp'))
  },
  {
    id: 'triangle-tension-lab',
    title: 'Üçgen Gerilim Laboratuvarı',
    description: 'Köşeleri sürüklenebilen canlı üçgende açı-kenar ilişkisini ve iç açı toplamını keşfet.',
    grade: 9,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.9.4.1.1',
      'MAT.9.4.1.2'
    ],
    path: '/embed/geometry/triangle-tension-lab',
    component: lazy(() => import('../modules/grade9/triangle-tension-lab/TriangleTensionLabApp'))
  },
  {
    id: 'transformation-forensics',
    title: 'Dönüşüm Adli Bilişimi',
    description: 'Döndürülmüş ve yansıtılmış şekillerin merkez, açı ve ayna ekseni izlerini adli analiz ekranında yakala.',
    grade: 9,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: ['MAT.9.5.1.1', 'MAT.9.5.1.2'],
    path: '/embed/geometry/transformation-forensics',
    component: lazy(() => import('../modules/grade9/transformation-forensics/TransformationForensicsApp'))
  },
  {
    id: 'statistics-probability-radar',
    title: 'Veri Karar Radarı',
    description: 'Veri bulutunu tarayarak en istikrarlı grubu bul ve kutu-bıyık grafiğinde medyanı kilitle.',
    grade: 9,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.9.6.1.1',
      'MAT.9.6.1.2',
      'MAT.9.6.2.1'
    ],
    path: '/embed/probability/statistics-probability-radar',
    component: lazy(() => import('../modules/grade9/statistics-probability-radar/StatisticsProbabilityRadarApp'))
  },
  {
    id: 'parabola-shape-studio',
    title: 'Parabol Şekil Stüdyosu',
    description: 'Parabolün tepe noktasını ve genişlik kolunu sürükleyerek a, h ve k dönüşümlerini canlı hologramda keşfet.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.2.2.1',
      'MAT.10.2.2.2',
      'MAT.10.2.2.3',
      'MAT.10.2.2.4'
    ],
    path: '/embed/algebra/parabola-shape-studio',
    component: lazy(() => import('../modules/grade10/parabola-shape-studio/ParabolaShapeStudioApp'))
  },
  {
    id: 'domain-gates',
    title: 'Tanım Kümesi Kapıları',
    description: 'Karekök güvenli bölgesini ve rasyonel fonksiyon asimptot duvarını x=0 çizgisine kilitle.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.2.3.1',
      'MAT.10.2.3.2',
      'MAT.10.2.4.1',
      'MAT.10.2.4.2'
    ],
    path: '/embed/algebra/domain-gates',
    component: lazy(() => import('../modules/grade10/domain-gates/DomainGatesApp'))
  },
  {
    id: 'inverse-function-mirror',
    title: 'Ters Fonksiyon Aynası',
    description: 'y=x aynasında giriş ve çıkış kapsüllerini rol değişimine taşıyarak doğrusal, karesel/karekök ve rasyonel tersliği keşfet.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.2.5.1',
      'MAT.10.2.5.2',
      'MAT.10.2.5.3',
      'MAT.10.2.5.4'
    ],
    path: '/embed/algebra/inverse-function-mirror',
    component: lazy(() => import('../modules/grade10/inverse-function-mirror/InverseFunctionMirrorApp'))
  },
  {
    id: 'sign-table-scanner',
    title: 'İşaret Tablosu Tarayıcısı',
    description: 'Kök duraklarını sayı doğrusuna kilitle, pozitif ve negatif çözüm bölgelerini lazer bantlarıyla seç.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.2.6.1',
      'MAT.10.2.6.2'
    ],
    path: '/embed/algebra/sign-table-scanner',
    component: lazy(() => import('../modules/grade10/sign-table-scanner/SignTableScannerApp'))
  },
  {
    id: 'function-filter',
    title: 'Fonksiyon Mu Filtresi',
    description: 'Dikey doğru lazeriyle fonksiyon şartını test et ve tanım kümesi portlarını kurala bağla.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.2.1.1',
      'MAT.10.2.1.2'
    ],
    path: '/embed/algebra/function-filter',
    component: lazy(() => import('../modules/grade10/function-filter/FunctionFilterApp'))
  },
  {
    id: 'prime-lock-vault',
    title: 'Asal Kilit Kasası',
    description: '30 sayısını asal lazerlerle parçala ve tam bölen rafını eksiksiz kilitle.',
    grade: 10,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.1.1.1',
      'MAT.10.1.1.2'
    ],
    path: '/embed/numbers/prime-lock-vault',
    component: lazy(() => import('../modules/grade10/prime-lock-vault/PrimeLockVaultApp'))
  },
  {
    id: 'gcd-lcm-gearbox',
    title: 'EBOB/EKOK Dişli Kutusu',
    description: '12 ve 18 sayılarını aynı asal dişli kutusunda karşılaştırarak EBOB ve EKOK seçim kuralını kilitle.',
    grade: 10,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.1.2.1',
      'MAT.10.1.2.2'
    ],
    path: '/embed/numbers/gcd-lcm-gearbox',
    component: lazy(() => import('../modules/grade10/gcd-lcm-gearbox/GcdLcmGearboxApp'))
  },
  {
    id: 'remainder-gate',
    title: 'Kalan Kapısı',
    description: 'Bölme işlemi yapmadan rakam toplamı, son basamak ve son iki basamak izleriyle kalan tokenını kilitle.',
    grade: 10,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.1.3.1'
    ],
    path: '/embed/numbers/remainder-gate',
    component: lazy(() => import('../modules/grade10/remainder-gate/RemainderGateApp'))
  },
  {
    id: 'counting-assembly-line',
    title: 'Sayma Montaj Hattı',
    description: 'Çarpma ve toplama yoluyla saymayı aynı üretim hattında ayrıştır.',
    grade: 10,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.3.1.1',
      'MAT.10.3.1.2'
    ],
    path: '/embed/probability/counting-assembly-line',
    component: lazy(() => import('../modules/grade10/counting-assembly-line/CountingAssemblyLineApp'))
  },
  {
    id: 'algebra-algorithm-machine',
    title: 'Cebir Algoritma Makinesi',
    description: 'Girdi, işlem blokları ve çıktı portuyla cebirsel ifadeyi algoritmik akışa çevir.',
    grade: 10,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.3.2.1'
    ],
    path: '/embed/algebra/algebra-algorithm-machine',
    component: lazy(() => import('../modules/grade10/algebra-algorithm-machine/AlgebraAlgorithmMachineApp'))
  },
  {
    id: 'cross-table-detective',
    title: 'Çapraz Tablo Dedektifi',
    description: '2x2 çapraz tabloda kategori hücresini, sapma sinyalini ve medya yanlılığı bayrağını denetle.',
    grade: 10,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.6.1.1',
      'MAT.10.6.1.2',
      'MAT.10.6.2.1'
    ],
    path: '/embed/statistics/cross-table-detective',
    component: lazy(() => import('../modules/grade10/cross-table-detective/CrossTableDetectiveApp'))
  },
  {
    id: 'conditional-probability-filter',
    title: 'Koşullu Olasılık Filtresi',
    description: 'Zar evrenini koşulla daralt, hedef olayı yeni evrende say ve 1/3 sonucunu mühürle.',
    grade: 10,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.7.1.1'
    ],
    path: '/embed/probability/conditional-probability-filter',
    component: lazy(() => import('../modules/grade10/conditional-probability-filter/ConditionalProbabilityFilterApp'))
  },
  {
    id: 'dependent-draw-machine',
    title: 'Bağımlı Çekiliş Makinesi',
    description: 'Geri konmayan kırmızı top sonrası torba evrenini güncelle ve ikinci olasılığı yeni evrenden hesapla.',
    grade: 10,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.7.2.1'
    ],
    path: '/embed/probability/dependent-draw-machine',
    component: lazy(() => import('../modules/grade10/dependent-draw-machine/DependentDrawMachineApp'))
  },
  {
    id: 'trigonometric-theodolite',
    title: 'Trigonometrik Teodolit',
    description: 'Dik üçgende karşı, komşu ve hipotenüs ölçülerini seçerek sin, cos, tan ve cot oranlarını kur.',
    grade: 10,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.4.1.1',
      'MAT.10.4.1.2',
      'MAT.10.4.1.3',
      'MAT.10.4.1.4'
    ],
    path: '/embed/trigonometry/trigonometric-theodolite',
    component: lazy(() => import('../modules/grade10/trigonometric-theodolite/TrigonometricTheodoliteApp'))
  },
  {
    id: 'constant-area-triangle-rail',
    title: 'Sabit Alan Üçgen Rayı',
    description: 'Tepe noktasını tabana paralel rayda kaydırarak aynı taban ve yüksekliğin alanı sabit tuttuğunu keşfet.',
    grade: 10,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.4.3.1'
    ],
    path: '/embed/geometry/constant-area-triangle-rail',
    component: lazy(() => import('../modules/grade10/constant-area-triangle-rail/ConstantAreaTriangleRailApp'))
  },
  {
    id: 'sine-cosine-terrain-surveyor',
    title: 'Sinüs-Kosinüs Arazi Ölçeri',
    description: 'Dik olmayan arazi üçgeninde kosinüsle eksik kenarı, sinüsle bilinmeyen açıyı ölç.',
    grade: 10,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.4.4.1',
      'MAT.10.4.4.2'
    ],
    path: '/embed/geometry/sine-cosine-terrain-surveyor',
    component: lazy(() => import('../modules/grade10/sine-cosine-terrain-surveyor/SineCosineTerrainSurveyorApp'))
  },
  {
    id: 'unit-circle-identity-shield',
    title: 'Birim Çember Kalkanı',
    description: 'Birim çemberde sin² ve cos² enerji plakalarını birleştirerek toplamın 1 kaldığını keşfet.',
    grade: 10,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.4.2.1'
    ],
    path: '/embed/trigonometry/unit-circle-identity-shield',
    component: lazy(() => import('../modules/grade10/unit-circle-identity-shield/UnitCircleIdentityShieldApp'))
  },
  {
    id: 'analytic-route-map',
    title: 'Analitik Rota Haritası',
    description: 'İki istasyonu sürükleyerek mesafe, eğim, doğru denklemi ve içten bölme noktasını canlı rota üzerinde keşfet.',
    grade: 10,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.10.5.1.1',
      'MAT.10.5.1.2',
      'MAT.10.5.2.1',
      'MAT.10.5.2.2'
    ],
    path: '/embed/geometry/analytic-route-map',
    component: lazy(() => import('../modules/grade10/analytic-route-map/AnalyticRouteMapApp'))
  },
  {
    id: 'trigonometric-oscilloscope',
    title: 'Trigonometrik Osiloskop',
    description: 'Birim çember faz kolunu döndürerek sinüs ve kosinüs referans dalgalarını canlı çiz.',
    grade: 11,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.1.1',
      'MAT.11.1.1.2'
    ],
    path: '/embed/trigonometry/trigonometric-oscilloscope',
    component: lazy(() => import('../modules/grade11/trigonometric-oscilloscope/TrigonometricOscilloscopeApp'))
  },
  {
    id: 'tangent-asymptote-gates',
    title: 'Tanjant Asimptot Kapıları',
    description: 'Tanjant ve kotanjant grafiklerinin yasak duvarlarını sürükleyerek asimptot davranışını görünür hale getir.',
    grade: 11,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.1.3',
      'MAT.11.1.1.4'
    ],
    path: '/embed/trigonometry/tangent-asymptote-gates',
    component: lazy(() => import('../modules/grade11/tangent-asymptote-gates/TangentAsymptoteGatesApp'))
  },
  {
    id: 'trigonometric-root-hunter',
    title: 'Trigonometrik Kök Avcısı',
    description: 'Sin, cos, tan ve cot denklemlerinin köklerini dalga ile hedef ışının kesişimlerinde yakala.',
    grade: 11,
    category: 'Trigonometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.2.1',
      'MAT.11.1.2.2',
      'MAT.11.1.2.3',
      'MAT.11.1.2.4'
    ],
    path: '/embed/trigonometry/trigonometric-root-hunter',
    component: lazy(() => import('../modules/grade11/trigonometric-root-hunter/TrigonometricRootHunterApp'))
  },
  {
    id: 'exponential-growth-reactor',
    title: 'Üstel Büyüme Reaktörü',
    description: 'Taban çekirdeğini sürükleyerek a>1 artan ve 0<a<1 azalan üstel grafikleri canlı gör.',
    grade: 11,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.3.1',
      'MAT.11.1.3.2'
    ],
    path: '/embed/algebra/exponential-growth-reactor',
    component: lazy(() => import('../modules/grade11/exponential-growth-reactor/ExponentialGrowthReactorApp'))
  },
  {
    id: 'logarithm-inverse-mirror',
    title: 'Logaritma Ters Ayna Odası',
    description: 'Üstel eğriyi y=x aynasında ters çevirerek logaritma grafiğinin artan ve azalan hallerini keşfet.',
    grade: 11,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.11.1.4.1',
      'MAT.11.1.5.1',
      'MAT.11.1.5.2'
    ],
    path: '/embed/algebra/logarithm-inverse-mirror',
    component: lazy(() => import('../modules/grade11/logarithm-inverse-mirror/LogarithmInverseMirrorApp'))
  },
  {
    id: 'richter-desibel-scale-simulator',
    title: 'Richter-Desibel Ölçek Simülatörü',
    description: 'Üstel büyüme, desibel ve Richter oranlarını tek kadranda büyütüp log ölçeğinde sıkıştırarak oku.',
    grade: 11,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.6.1',
      'MAT.11.1.6.2',
      'MAT.11.1.6.3'
    ],
    path: '/embed/algebra/richter-desibel-scale-simulator',
    component: lazy(() => import('../modules/grade11/richter-desibel-scale-simulator/RichterDesibelScaleSimulatorApp'))
  },
  {
    id: 'function-composition-ports',
    title: 'Fonksiyon Bileşke Portları',
    description: 'x kapsülünü önce g makinesinden geçirip çıkan değeri f portuna bağlayarak f(g(x)) zincirini kur.',
    grade: 11,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.7.1'
    ],
    path: '/embed/algebra/function-composition-ports',
    component: lazy(() => import('../modules/grade11/function-composition-ports/FunctionCompositionPortsApp'))
  },
  {
    id: 'function-operation-mixer',
    title: 'Fonksiyon İşlem Mikseri',
    description: 'f ve g değer akışlarını +, -, çarpma ve bölme kapılarından geçirerek yeni fonksiyon çıktılarını üret.',
    grade: 11,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.1.8.1',
      'MAT.11.1.8.2',
      'MAT.11.1.8.3',
      'MAT.11.1.8.4'
    ],
    path: '/embed/algebra/function-operation-mixer',
    component: lazy(() => import('../modules/grade11/function-operation-mixer/FunctionOperationMixerApp'))
  },
  {
    id: 'quadrilateral-decomposition-table',
    title: 'Dörtgen Ayrıştırma Masası',
    description: 'Dörtgeni köşegen bıçağıyla iki üçgene ayırarak iç açı toplamı ve alan toplamını canlı gör.',
    grade: 11,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.2.1.1',
      'MAT.11.2.1.2'
    ],
    path: '/embed/geometry/quadrilateral-decomposition-table',
    component: lazy(() => import('../modules/grade11/quadrilateral-decomposition-table/QuadrilateralDecompositionTableApp'))
  },
  {
    id: 'special-quadrilateral-diagnostic-table',
    title: 'Özel Dörtgen Tanı Masası',
    description: 'Kenar ve köşegen tarayıcılarıyla özel dörtgenlerin kimliğini ezber yerine özellik iziyle teşhis et.',
    grade: 11,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.2.2.1',
      'MAT.11.2.2.2'
    ],
    path: '/embed/geometry/special-quadrilateral-diagnostic-table',
    component: lazy(() => import('../modules/grade11/special-quadrilateral-diagnostic-table/SpecialQuadrilateralDiagnosticTableApp'))
  },
  {
    id: 'concave-convex-laser-detector',
    title: 'Konkav-Konveks Lazer Dedektörü',
    description: 'Açı probunu çokgen köşelerinde gezdirerek 180° altı ve >180° işaretlerinden konveks/konkav tanısını koy.',
    grade: 11,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.2.3.1',
      'MAT.11.2.3.2'
    ],
    path: '/embed/geometry/concave-convex-laser-detector',
    component: lazy(() => import('../modules/grade11/concave-convex-laser-detector/ConcaveConvexLaserDetectorApp'))
  },
  {
    id: 'polygon-diagonal-symmetry-workshop',
    title: 'Çokgen Köşegen ve Simetri Atölyesi',
    description: 'Düzgün çokgen masasında köşegen lazerleri, 360° dış açı yürüyüşü ve simetri aynasını tek oyuncakta kalibre et.',
    grade: 11,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.2.4.1',
      'MAT.11.2.4.2',
      'MAT.11.2.4.3'
    ],
    path: '/embed/geometry/polygon-diagonal-symmetry-workshop',
    component: lazy(() => import('../modules/grade11/polygon-diagonal-symmetry-workshop/PolygonDiagonalSymmetryWorkshopApp'))
  },
  {
    id: 'mosaic-tiling-workshop',
    title: 'Mozaik Kaplama Atölyesi',
    description: 'Çokgen fayansları sürükleyip döndürerek boşluksuz mozaik, 360° açı halkası ve hizalı desen kilidini kur.',
    grade: 11,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.2.5.1',
      'MAT.11.2.5.2'
    ],
    path: '/embed/geometry/mosaic-tiling-workshop',
    component: lazy(() => import('../modules/grade11/mosaic-tiling-workshop/MosaicTilingWorkshopApp'))
  },
  {
    id: 'correlation-scatter-radar',
    title: 'Korelasyon Serpilme Radarı',
    description: 'Veri noktalarını serpilme radarında taşıyarak pozitif ve negatif doğrusal ilişkiyi canlı oku.',
    grade: 11,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.3.1.1',
      'MAT.11.3.1.2',
      'MAT.11.3.1.3'
    ],
    path: '/embed/statistics/correlation-scatter-radar',
    component: lazy(() => import('../modules/grade11/correlation-scatter-radar/CorrelationScatterRadarApp'))
  },
  {
    id: 'media-correlation-auditor',
    title: 'Medya Korelasyon Denetçisi',
    description: 'Hazır medya iddiasını veri izi, nedensellik alarmı ve güvenli sonuç mührüyle denetle.',
    grade: 11,
    category: 'Olasılık',
    difficulty: 'Orta',
    atomIds: [
      'MAT.11.3.2.1'
    ],
    path: '/embed/statistics/media-correlation-auditor',
    component: lazy(() => import('../modules/grade11/media-correlation-auditor/MediaCorrelationAuditorApp'))
  },
  {
    id: 'sequence-wheel',
    title: 'Dizi Çarkı',
    description: 'Aritmetik fark, geometrik oran ve dizi-fonksiyon ayrımını tek tam sahne çarkında dene.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.12.1.1.1',
      'MAT.12.1.1.2',
      'MAT.12.1.1.3'
    ],
    path: '/embed/algebra/sequence-wheel',
    component: lazy(() => import('../modules/grade12/sequence-wheel/SequenceWheelApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf altın şablon Kaptan görsel onayıyla Showcase Ready.'
  },
  {
    id: 'polynomial-vault',
    title: 'Polinom Kasası',
    description: 'Polinom terimlerini büyük derece raflarında tara; derece, başkatsayı ve sabit terimi kasadan çıkar.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Orta',
    atomIds: [
      'MAT.12.1.2.1',
      'MAT.12.1.2.2',
      'MAT.12.1.2.3',
      'MAT.12.1.2.4',
      'MAT.12.1.2.5'
    ],
    path: '/embed/algebra/polynomial-vault',
    component: lazy(() => import('../modules/grade12/polynomial-vault/PolynomialVaultApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf Polinom Kasası Kaptan görsel onayıyla Showcase Ready.'
  },
  {
    id: 'inequality-orbit',
    title: 'İşaret Yörünge Radarı',
    description: 'Kök, yasak nokta ve çözüm aralıklarını tek yörünge radarında tara.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.1.3.1',
      'MAT.12.1.3.2',
      'MAT.12.1.3.3',
      'MAT.12.1.3.4'
    ],
    path: '/embed/algebra/inequality-orbit',
    component: lazy(() => import('../modules/grade12/inequality-orbit/InequalityOrbitApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf İşaret Yörünge Radarı Kaptan görsel onayıyla Showcase Ready.'
  },
  {
    id: 'limit-asymptote-sensor',
    title: 'Limit Asimptot Sensörü',
    description: 'Sol-sağ yaklaşımı, sonsuz asimptot tünelini ve 0/0 çarpan vincini tek pistte kilitle.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.1.1',
      'MAT.12.2.1.2',
      'MAT.12.2.2.1',
      'MAT.12.2.2.2',
      'MAT.12.2.2.3'
    ],
    path: '/embed/calculus/limit-asymptote-sensor',
    component: lazy(() => import('../modules/grade12/limit-asymptote-sensor/LimitAsymptoteApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf Limit Asimptot Sensörü Kaptan görsel onayıyla Showcase Ready.'
  },
  {
    id: 'continuity-bridge',
    title: 'Süreklilik Köprüsü',
    description: 'Limit raylarını ve f(a) nokta pimini aynı köprü kilidinde birleştir.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.3.1'
    ],
    path: '/embed/calculus/continuity-bridge',
    component: lazy(() => import('../modules/grade12/continuity-bridge/ContinuityBridgeApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf Süreklilik Köprüsü Kaptan görsel onayıyla Showcase Ready.'
  },
  {
    id: 'derivative-slope-driver',
    title: 'Türev Eğim Sürücüsü',
    description: 'Kesen doğrunun teğet kızağına yaklaşmasını ve anlık eğim fikrini sürüş pistinde kilitle.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.4.1',
      'MAT.12.2.4.2'
    ],
    path: '/embed/calculus/derivative-slope-driver',
    component: lazy(() => import('../modules/grade12/derivative-slope-driver/DerivativeSlopeDriverApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf Türev Eğim Sürücüsü Kaptan canlı görsel onayıyla Showcase Ready. Kesen-teğet omurgası kilitlendi; türev yok alarmları ayrı modülde tutulacak.'
  },
  {
    id: 'derivative-nonexistent-alarm',
    title: 'Türev Yok Alarm İstasyonu',
    description: 'Sivri uç ve kopuk grafikte türevin neden kurulamadığını ayrı alarm sahnelerinde yakala.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.4.3',
      'MAT.12.2.4.4'
    ],
    path: '/embed/calculus/derivative-nonexistent-alarm',
    component: lazy(() => import('../modules/grade12/derivative-nonexistent-alarm/DerivativeNonexistentAlarmApp')),
    status: 'showcase-ready',
    archiveNote: '12. sınıf Türev Yok Alarm İstasyonu Kaptan canlı görsel onayıyla Showcase Ready. Sahne probu doğrudan sürüklenebilir; sivri uç ve kopuk grafik alarm nedenleri ayrı kilitlendi.'
  },
  {
    id: 'derivative-rule-forge',
    title: 'Türev Kural Dökümhanesi',
    description: 'Toplam, fark, çarpım, bölüm ve zincir kurallarını kural kartuşlu üretim bandında kilitle.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.5.1',
      'MAT.12.2.5.2',
      'MAT.12.2.5.3',
      'MAT.12.2.5.4',
      'MAT.12.2.5.5'
    ],
    path: '/embed/calculus/derivative-rule-forge',
    component: lazy(() => import('../modules/grade12/derivative-rule-forge/DerivativeRuleForgeApp')),
    status: 'review-needed',
    archiveNote: '12. sınıf Review Needed üretim modülü. Kaptan göz kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'optimization-terrain',
    title: 'Optimizasyon Arazisi',
    description: 'Türev işaretini, ekstremum kapısını, maksimum hacim ve minimum maliyet kararlarını arazi pistinde kilitle.',
    grade: 12,
    category: 'Cebir',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.2.6.1',
      'MAT.12.2.6.2',
      'MAT.12.2.6.3',
      'MAT.12.2.6.4',
      'MAT.12.2.6.5'
    ],
    path: '/embed/calculus/optimization-terrain',
    component: lazy(() => import('../modules/grade12/optimization-terrain/OptimizationTerrainApp')),
    status: 'review-needed',
    archiveNote: '12. sınıf Review Needed üretim modülü. Kaptan göz kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'circle-radar-station',
    title: 'Çember Radar İstasyonu',
    description: 'Kesen, kiriş, teğet, yay, çevre açı, merkez açı ve alanı tek çember radarında tarat.',
    grade: 12,
    category: 'Geometri',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.3.1.1',
      'MAT.12.3.1.2',
      'MAT.12.3.1.3',
      'MAT.12.3.1.4',
      'MAT.12.3.2.1',
      'MAT.12.3.2.2',
      'MAT.12.3.2.3'
    ],
    path: '/embed/geometry/circle-radar-station',
    component: lazy(() => import('../modules/grade12/circle-radar-station/CircleRadarStationApp')),
    status: 'review-needed',
    archiveNote: '12. sınıf Review Needed üretim modülü. Kaptan göz kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'solid-measurement-foundry',
    title: 'Katı Cisim Ölçüm Dökümhanesi',
    description: 'Prizma, silindir, piramit, koni ve kürede hacmi iç dolum; yüzey alanını dış zırh olarak test et.',
    grade: 12,
    category: 'Geometri',
    difficulty: 'Zor',
    atomIds: [
      'MAT.12.4.1.1',
      'MAT.12.4.1.2',
      'MAT.12.4.1.3',
      'MAT.12.4.1.4',
      'MAT.12.4.1.5',
      'MAT.12.4.2.1',
      'MAT.12.4.2.2',
      'MAT.12.4.2.3',
      'MAT.12.4.2.4',
      'MAT.12.4.2.5'
    ],
    path: '/embed/geometry/solid-measurement-foundry',
    component: lazy(() => import('../modules/grade12/solid-measurement-foundry/SolidMeasurementFoundryApp')),
    status: 'review-needed',
    archiveNote: '12. sınıf Review Needed üretim modülü. Kaptan göz kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'data-verdict-lab',
    title: 'Büyük Veri Yargı Laboratuvarı',
    description: 'Hazır kurumsal veri setini kaynak, filtre, grafik ve güvenli sonuç cümlesiyle mühürle.',
    grade: 12,
    category: 'Olasılık',
    difficulty: 'Zor',
    atomIds: ['MAT.12.5.1.1'],
    path: '/embed/statistics/data-verdict-lab',
    component: lazy(() => import('../modules/grade12/data-verdict-lab/DataVerdictLabApp')),
    status: 'review-needed',
    archiveNote: '12. sınıf Review Needed üretim modülü. Kaptan göz kontrolünden sonra Showcase Ready değerlendirilecek.'
  }
];

export const activeModules = modules.filter((module) => module.status === undefined || module.status === 'active' || module.status === 'review-needed' || module.status === 'showcase-ready');
export const archivedModules = modules.filter((module) => module.status === 'archived');
