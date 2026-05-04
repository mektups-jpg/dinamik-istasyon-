import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type Category = 'Sayılar' | 'Geometri' | 'Fizik' | 'Olasılık' | 'Cebir' | 'Trigonometri' | 'Geometrik Şekiller';
export type Difficulty = 'Kolay' | 'Orta' | 'Zor';
export type GradeRange = 'İlkokul' | 'Ortaokul' | 'Lise';
export type ModuleStatus = 'active' | 'archived';

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
    title: 'Kesir Senkronizasyon Tezgahı',
    description: 'Enerji çekirdeğini eş parçalara böl ve gerekli payı bularak istasyonu aktifleştir.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 3,
    path: '/embed/numbers/fraction-reactor-3',
    component: lazy(() => import('../modules/numbers/fraction-reactor/FractionReactorApp'))
  },
  {
    id: 'data-capsule-4',
    title: 'Veri Kapsülü & Örüntü Motoru',
    description: '6 haneli şifreleri çöz, veri bloklarını sırala ve ritmik motor arızasını onar.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 4,
    path: '/embed/numbers/data-capsule-4',
    component: lazy(() => import('../modules/numbers/data-capsule/DataCapsuleApp'))
  },
  {
    id: 'zero-engine-4',
    title: 'Sıfır Motoru ve Basamak İticisi',
    description: '10, 100, 1000 ile zihinden işlem yap, çarpma algoritmasındaki sola kaydırma olayının ardındaki gerçek SIFIR takozunu keşfet!',
    category: 'Cebir',
    difficulty: 'Zor',
    grade: 4,
    path: '/embed/algebra/zero-engine-4',
    component: lazy(() => import('../modules/algebra/zero-engine/ZeroEngineApp'))
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
    id: 'number-line',
    title: 'Sayı Doğrusu Zıplaması',
    description: 'Robotu sayı doğrusunda ileri zıplatarak toplama işleminin sırlarını keşfedin.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/number-line',
    component: lazy(() => import('../modules/numbers/number-line/NumberLineApp'))
  },
  {
    id: 'number-line-sub',
    title: 'Sayı Doğrusunda Çıkarma',
    description: 'Enerjisi azalan robotu geriye doğru zıplatarak çıkarma işleminin mantığını kavrayın.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    grade: 1,
    path: '/embed/numbers/number-line-sub',
    component: lazy(() => import('../modules/numbers/number-line-sub/NumberLineSubApp'))
  },
  {
    id: 'base-10-factory',
    title: 'Onluk Bozma Fabrikası',
    description: 'Gelen ham sayı enerjilerini onluk çubuklara ve birlik küplere ayrıştırarak makineleri çalıştırın.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 2,
    path: '/embed/numbers/base-10-factory',
    component: lazy(() => import('../modules/numbers/base-10-factory/Base10FactoryApp'))
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
    component: lazy(() => import('../modules/probability/galton-board/GaltonApp'))
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
  }
];

export const activeModules = modules.filter((module) => module.status !== 'archived');
export const archivedModules = modules.filter((module) => module.status === 'archived');
