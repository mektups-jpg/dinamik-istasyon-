import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type Category = 'Sayılar' | 'Geometri' | 'Fizik' | 'Olasılık' | 'Cebir' | 'Trigonometri' | 'Geometrik Şekiller';
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
    title: 'Konum Belirleme Terminali',
    description: 'Uzay ızgarasında doğru parçaları çizerek hedeflere lazer bağla ve konum tespit sistemini tamir et.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 5,
    path: '/embed/geometry/neon-route',
    atomIds: ['MAT.5.3.1.2', 'MAT.5.3.2.1'],
    component: lazy(() => import('../modules/geometry/neon-route/NeonRouteApp')),
    status: 'showcase-ready'
  },
  {
    id: 'magnitude-core',
    title: 'Sayıları Bölüklere Ayırma',
    description: '9 haneli dev sayılar ve sadece 0-1 arasında var olabilen olasılık evreni vizyon simülatörü.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/numbers/magnitude-core',
    atomIds: ['MAT.5.1.1.1', 'MAT.5.1.1.2', 'MAT.5.1.1.3', 'MAT.5.6.1.1'],
    component: lazy(() => import('../modules/numbers/magnitude-core/MagnitudeCoreApp')),
    status: 'showcase-ready'
  },
  {
    id: 'equation-lab',
    title: 'Denklem Terazisi',
    description: 'Terazide eşitliği sağla ve işlem önceliği (parantez, çarpma, bölme) kalkanlarını kırarak hedefe ulaş.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/algebra/equation-lab',
    atomIds: ['MAT.5.2.1.1', 'MAT.5.2.1.2', 'MAT.5.2.2.1', 'MAT.5.2.2.2'],
    component: lazy(() => import('../modules/algebra/equation-lab/EquationLabApp')),
    status: 'showcase-ready'
  },
  {
    id: 'fraction-synchronizer',
    title: 'İleri Kesir Senkronizatörü',
    description: 'Sıvı tanklarını kontrol ederek tam sayılı kesirleri bileşik kesirlere dönüştür, paydaları eşitleyerek büyüklük sıralamasını keşfet.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/numbers/fraction-synchronizer',
    atomIds: ['MAT.5.1.3.2', 'MAT.5.1.4.1'],
    component: lazy(() => import('../modules/numbers/fraction-synchronizer/FractionSynchronizerApp')),
    status: 'showcase-ready',
    archiveNote: '5. sınıf Kesir Tankları modülü Kaptan canlı onayıyla Showcase Ready.'
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
    description: 'Aynı tabanlı üslü ifadeleri boyut makinesinde çarpıp bölerek üslerin nasıl toplandığını ve çıkarıldığını keşfet.',
    category: 'Cebir',
    difficulty: 'Zor',
    grade: 8,
    path: '/embed/algebra/algebraic-dimensions',
    atomIds: ['MAT.8.1.1.2', 'MAT.8.1.1.3'],
    component: lazy(() => import('../modules/algebra/algebraic-dimensions/AlgebraicDimensionsApp')),
    status: 'review-needed',
    archiveNote: '8. sınıf ortaokul üretim modülü. Kaptan canlı kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'absolute-value',
    title: 'Sıfır Aynası',
    description: 'Negatif ve pozitif yönlü sayıları sayı doğrusunda eş uzaklık aynasıyla yorumla.',
    category: 'Sayılar',
    difficulty: 'Orta',
    grade: 7,
    path: '/embed/numbers/absolute-value',
    atomIds: ['MAT.7.1.1.1', 'MAT.7.1.3.1'],
    component: lazy(() => import('../modules/numbers/absolute-value/AbsoluteValueApp')),
    status: 'review-needed',
    archiveNote: '7. sınıf ortaokul üretim modülü. Kaptan canlı kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'coordinate-terminal',
    title: 'Koordinat Radar Ağı',
    description: 'X ve Y eksenlerinde hedef noktaları okuyup koordinat düzlemine yerleştir.',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 8,
    path: '/embed/geometry/coordinate-terminal',
    atomIds: ['MAT.8.2.1.1'],
    component: lazy(() => import('../modules/geometry/coordinate-terminal/CoordinateTerminalApp')),
    status: 'review-needed',
    archiveNote: '8. sınıf ortaokul üretim modülü. Kaptan canlı kontrolünden sonra Showcase Ready değerlendirilecek.'
  },
  {
    id: 'gear-ratio',
    title: 'Oran Dişli Atölyesi',
    description: 'Dişli oranlarını büyütüp küçülterek oran, orantı ve doğru orantıyı çapraz çarpım kanıtıyla kur.',
    category: 'Cebir',
    difficulty: 'Orta',
    grade: 7,
    path: '/embed/algebra/gear-ratio',
    atomIds: ['MAT.7.1.5.1', 'MAT.7.1.5.2', 'MAT.7.1.5.3', 'MAT.7.1.6.1', 'MAT.7.1.7.1'],
    component: lazy(() => import('../modules/algebra/gear-ratio/GearRatioApp')),
    status: 'review-needed',
    archiveNote: '7. sınıf ortaokul üretim modülü. Kaptan canlı kontrolünden sonra Showcase Ready değerlendirilecek.'
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
    title: 'Doğru-Işın Çizim Paneli',
    description: 'Doğru, ışın ve doğru parçası çiz; kesişen doğrularda ters açıları seçip sanal iletkiyle ölç.',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/geometry/vector-design-panel',
    atomIds: ['MAT.5.3.1.1', 'MAT.5.3.1.2', 'MAT.5.3.1.3', 'MAT.5.3.3.1', 'MAT.5.3.4.1'],
    component: lazy(() => import('../modules/geometry/vector-design-panel/VectorDesignApp')),
    status: 'showcase-ready',
    archiveNote: '5. sınıf Doğru-Işın Çizim Paneli Kaptan canlı onayıyla Showcase Ready.'
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
    atomId: 'MAT.7.2.1.1',
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
    title: 'Üçgen Çubuk Atölyesi',
    description: 'Üç çubuğun uzunluğunu değiştirerek hangi durumlarda üçgen kurulabildiğini keşfet.',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/geometry/polygon-collision-test',
    atomId: 'MAT.5.3.7.1',
    status: 'showcase-ready',
    archiveNote: '5. sınıf Üçgen Çubuk Atölyesi Kaptan canlı onayıyla Showcase Ready.',
    component: lazy(() => import('../modules/geometry/polygon-collision-test/PolygonCollisionApp'))
  },
  {
    id: 'unit-square-area-factory',
    title: 'Birim Kare Alan Fabrikası',
    description: 'Dikdörtgen zemini 1x1 birim karelerle kaplayarak alanın uzun x kısa olduğunu keşfet.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 5,
    path: '/embed/geometry/unit-square-area-factory',
    atomId: 'MAT.5.4.2.1',
    status: 'showcase-ready',
    archiveNote: '5. sınıf Birim Kare Alan Fabrikası Kaptan canlı onayıyla Showcase Ready.',
    component: lazy(() => import('../modules/geometry/unit-square-area-factory/UnitSquareAreaFactoryApp'))
  },
  {
    id: 'fence-field',
    title: 'Çevre-Alan Bahçesi',
    description: 'Dikdörtgen bahçe planlarında aynı çevreyle alanın, aynı alanla çevrenin nasıl değiştiğini keşfet.',
    category: 'Geometri',
    difficulty: 'Orta',
    grade: 5,
    path: '/embed/geometry/fence-field',
    atomIds: ['MAT.5.4.3.1', 'MAT.5.4.3.2'],
    status: 'showcase-ready',
    archiveNote: '5. sınıf Çevre-Alan Bahçesi Kaptan canlı onayıyla Showcase Ready.',
    component: lazy(() => import('../modules/geometry/fence-field/PerimeterAreaGardenApp'))
  },
  {
    id: 'garden-carpet-planner',
    title: 'Bahçe ve Halı Atölyesi',
    description: 'Günlük çit, halı ve toprak problemlerinde çevre ile alanı ayırarak doğru sonucu seç.',
    category: 'Geometri',
    difficulty: 'Kolay',
    grade: 5,
    path: '/embed/geometry/garden-carpet-planner',
    atomIds: ['MAT.5.4.4.1', 'MAT.5.4.4.2'],
    status: 'showcase-ready',
    archiveNote: '5. sınıf Bahçe ve Halı Atölyesi Kaptan canlı onayıyla Showcase Ready.',
    component: lazy(() => import('../modules/geometry/garden-carpet-planner/GardenCarpetPlannerApp'))
  },
  {
    id: 'divisibility-workshop',
    title: 'Bölünebilme Atölyesi',
    description: 'Hedef sayılarda çarpanları ve 2, 3, 5, 6, 9, 10 bölünebilme kurallarını tek odaklı seçim panosunda ayır.',
    grade: 6,
    category: 'Sayılar',
    difficulty: 'Kolay',
    atomIds: [
      'MAT.6.1.1.1',
      'MAT.6.1.2.1',
      'MAT.6.1.2.2',
      'MAT.6.1.2.3',
      'MAT.6.1.2.4',
      'MAT.6.1.2.5',
      'MAT.6.1.2.6',
      'MAT.6.1.2.7'
    ],
    path: '/embed/numbers/divisibility-workshop',
    component: lazy(() => import('../modules/numbers/divisibility-workshop/DivisibilityWorkshopApp')),
    status: 'showcase-ready',
    archiveNote: '6. sınıf Bölünebilme Atölyesi Kaptan canlı onayıyla Showcase Ready.'
  },
  {
    id: 'prime-numbers-workshop',
    title: 'Asal Sayılar Atölyesi',
    description: 'Asal sayıları ayır ve asal olmayan sayıları en küçük asal çarpanlarına kadar parçala.',
    grade: 6,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: ['MAT.6.1.3.1', 'MAT.6.1.3.2'],
    path: '/embed/numbers/prime-numbers-workshop',
    component: lazy(() => import('../modules/numbers/prime-numbers-workshop/PrimeNumbersWorkshopApp')),
    status: 'showcase-ready',
    archiveNote: '6. sınıf Asal Sayılar Atölyesi Kaptan canlı onayıyla Showcase Ready.'
  },
  {
    id: 'lcm-workshop',
    title: 'EKOK Ritim Atölyesi',
    description: 'Tekrarlayan zil, ışık ve nöbet ritimlerinde ilk ortak zamanı EKOK ile bul.',
    grade: 6,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: ['MAT.6.1.1.2', 'MAT.6.1.4.1'],
    path: '/embed/numbers/lcm-workshop',
    component: lazy(() => import('../modules/numbers/lcm-workshop/LcmWorkshopApp')),
    status: 'showcase-ready',
    archiveNote: '6. sınıf EKOK odaklı ortaokul üretim modülü Kaptan canlı onayıyla Showcase Ready.'
  },
  {
    id: 'gcd-workshop',
    title: 'EBOB Parça Atölyesi',
    description: 'Çubuk, raf ve paketleri artmadan en büyük eş parçalara EBOB ile ayır.',
    grade: 6,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: ['MAT.6.1.4.2'],
    path: '/embed/numbers/gcd-workshop',
    component: lazy(() => import('../modules/numbers/gcd-workshop/GcdWorkshopApp')),
    status: 'showcase-ready',
    archiveNote: '6. sınıf EBOB odaklı ortaokul üretim modülü Kaptan canlı onayıyla Showcase Ready.'
  },
  {
    id: 'gcd-lcm-workshop',
    title: 'EBOB-EKOK Atölyesi',
    description: 'Eski birleşik EBOB/EKOK akışı. Yeni üretim hattında EKOK Ritim ve EBOB Parça atomlarına ayrıldı.',
    grade: 6,
    category: 'Sayılar',
    difficulty: 'Orta',
    atomIds: ['MAT.6.1.1.2', 'MAT.6.1.4.1', 'MAT.6.1.4.2'],
    path: '/embed/numbers/gcd-lcm-workshop',
    component: lazy(() => import('../modules/numbers/gcd-lcm-workshop/GcdLcmWorkshopApp')),
    status: 'archived',
    archiveNote: '6. sınıf birleşik EBOB/EKOK atomu ayrıldı; eski route EKOK Ritim Atölyesi yönlendirmesiyle korunur.'
  },
  {
    id: 'optic-laser-lab',
    title: 'Paralel Doğrularda Açılar',
    description: 'Paralel iki doğruyu kesen bir doğruyla oluşan açı çiftlerini Z, U, yöndeş ve ters açı kurallarıyla eşleştir.',
    grade: 6,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: ['MAT.6.3.1.1', 'MAT.6.3.1.2', 'MAT.6.3.1.3', 'MAT.6.3.2.1'],
    path: '/embed/geometry/optic-laser-lab',
    component: lazy(() => import('../modules/geometry/optic-laser-lab/OpticLaserApp')),
    status: 'showcase-ready',
    archiveNote: '6. sınıf Paralel Doğrularda Açılar atomu Kaptan canlı onayıyla Showcase Ready.'
  },
  {
    id: 'area-pi-lab',
    title: 'Geometrik Alan ve Pi Laboratuvarı',
    description: 'Şekil alanlarının doğuşunu bükerek ispatla ve tekerleği döndürerek Pi sabitini keşfet!',
    grade: 6,
    category: 'Geometri',
    difficulty: 'Orta',
    atomIds: [
      'MAT.6.4.1.1',
      'MAT.6.4.2.1',
      'MAT.6.4.2.2',
      'MAT.6.4.3.1',
      'MAT.6.4.4.1',
      'MAT.6.4.5.1',
      'MAT.6.4.6.1'
    ],
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
