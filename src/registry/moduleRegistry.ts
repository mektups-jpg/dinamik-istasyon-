import { lazy } from 'react';

export type Category = 'Sayılar' | 'Geometri' | 'Fizik' | 'Olasılık' | 'Cebir' | 'Trigonometri' | 'Geometrik Şekiller';
export type Difficulty = 'Kolay' | 'Orta' | 'Zor';
export type GradeRange = 'İlkokul' | 'Ortaokul' | 'Lise';

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  gradeRange: GradeRange;
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  thumbnail?: string;
}

export const modules: ModuleMeta[] = [
  {
    id: 'magnitude-core',
    title: 'Devasa Nicelik Çekirdeği',
    description: '9 haneli dev sayılar ve sadece 0-1 arasında var olabilen olasılık evreni vizyon simülatörü.',
    category: 'Sayılar',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/numbers/magnitude-core',
    component: lazy(() => import('../modules/numbers/magnitude-core/MagnitudeCoreApp'))
  },
  {
    id: 'equation-lab',
    title: 'Algoritmik Denklem Laboratuvarı',
    description: 'Terazide eşitliği sağla ve işlem önceliği (parantez, çarpma, bölme) kalkanlarını kırarak hedefe ulaş.',
    category: 'Cebir',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/algebra/equation-lab',
    component: lazy(() => import('../modules/algebra/equation-lab/EquationLabApp'))
  },
  {
    id: 'trig-pendulum',
    title: 'Trigonometrik Sarkaç',
    description: 'Birim çember üzerindeki hareketin nasıl sinüs ve kosinüs dalgalarına dönüştüğünü keşfet.',
    category: 'Trigonometri',
    difficulty: 'Zor',
    gradeRange: 'Lise',
    path: '/embed/trig/pendulum',
    component: lazy(() => import('../modules/trig/pendulum/TrigPendulumApp'))
  },
  {
    id: 'algebraic-dimensions',
    title: 'Cebirsel Boyut Odası',
    description: 'Bir değişkenin (x) nasıl 1D çizgi, 2D alan ve 3D hacim oluşturduğunu simüle et.',
    category: 'Cebir',
    difficulty: 'Zor',
    gradeRange: 'Ortaokul',
    path: '/embed/algebra/dimensions',
    component: lazy(() => import('../modules/algebra/dimensions/AlgebraicDimensionsApp'))
  },
  {
    id: 'absolute-value',
    title: 'Sıfıra Uzaklık Aynası: Mutlak Değer',
    description: 'Sıfır noktasındaki aynaya lazerler göndererek negatif uzaklık efsanesini çürüt.',
    category: 'Sayılar',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/numbers/absolute-value',
    component: lazy(() => import('../modules/numbers/absolute-value/AbsoluteValueApp'))
  },
  {
    id: 'coord-terminal',
    title: 'Holografik Lazer Ağı: Analitik Geometri',
    description: 'X ve Y lazer sürgülerini kullanarak uzaydaki hedeflerin koordinatlarını tespit et.',
    category: 'Geometri',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/coordinate-terminal',
    component: lazy(() => import('../modules/geometry/coordinate-terminal/CoordinateTerminalApp'))
  },
  {
    id: 'gear-ratio',
    title: 'Kinetik Oran Laboratuvarı',
    description: 'Dişli çarkları kullanarak ters orantı matematiğini canlı simülasyon üzerinden test edin.',
    category: 'Cebir',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/algebra/gear-ratio',
    component: lazy(() => import('../modules/algebra/gear-ratio/GearRatioApp'))
  },
  {
    id: 'number-line',
    title: 'Sayı Doğrusu Zıplaması',
    description: 'Robotu sayı doğrusunda ileri zıplatarak toplama işleminin sırlarını keşfedin.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    gradeRange: 'İlkokul',
    path: '/embed/numbers/number-line',
    component: lazy(() => import('../modules/numbers/number-line/NumberLineApp'))
  },
  {
    id: 'number-line-sub',
    title: 'Sayı Doğrusunda Çıkarma',
    description: 'Enerjisi azalan robotu geriye doğru zıplatarak çıkarma işleminin mantığını kavrayın.',
    category: 'Sayılar',
    difficulty: 'Kolay',
    gradeRange: 'İlkokul',
    path: '/embed/numbers/number-line-sub',
    component: lazy(() => import('../modules/numbers/number-line-sub/NumberLineSubApp'))
  },
  {
    id: 'base-10-factory',
    title: 'Onluk Bozma Fabrikası',
    description: 'Gelen ham sayı enerjilerini onluk çubuklara ve birlik küplere ayrıştırarak makineleri çalıştırın.',
    category: 'Sayılar',
    difficulty: 'Orta',
    gradeRange: 'İlkokul',
    path: '/embed/numbers/base-10-factory',
    component: lazy(() => import('../modules/numbers/base-10-factory/Base10FactoryApp'))
  },
  {
    id: 'unit-circle',
    title: 'Trigonometrik Birim Çember',
    description: 'Sinüs, Kosinüs ve Tanjant değerlerini interaktif birim çember üzerinde keşfedin. Özel açıları bularak puan kazanın!',
    category: 'Geometri',
    difficulty: 'Orta',
    gradeRange: 'Lise',
    path: '/embed/geometry/unit-circle',
    component: lazy(() => import('../modules/geometry/unit-circle/UnitCircleApp'))
  },
  {
    id: 'cylinder-3d',
    title: '3D Silindir Açılımı',
    description: 'Dikdörtgenin kıvrılarak silindire dönüşümünü 3D olarak inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/cylinder-3d',
    component: lazy(() => import('../modules/geometry/cylinder-3d/CylinderApp'))
  },
  {
    id: 'prism-3d',
    title: '3D Prizma Açılımı',
    description: 'Bir dikdörtgenler prizmasının (kutunun) 6 yüzeyinin nasıl katlanıp açıldığını 3D olarak inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Kolay',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/prism-3d',
    component: lazy(() => import('../modules/geometry/prism-3d/PrismApp'))
  },
  {
    id: 'cube-3d',
    title: '3D Küp Açılımı',
    description: 'Küpün 6 eş kareden oluşan açılımını (Kuantum Zarı) inceleyin.',
    category: 'Geometrik Şekiller',
    difficulty: 'Kolay',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/cube-3d',
    component: lazy(() => import('../modules/geometry/cube-3d/CubeApp'))
  },
  {
    id: 'pyramid-3d',
    title: 'Kare Dik Piramit',
    description: 'Kare taban ve 4 üçgenden oluşan piramidi 3D katlayın.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/pyramid-3d',
    component: lazy(() => import('../modules/geometry/pyramid-3d/PyramidApp'))
  },
  {
    id: 'cone-3d',
    title: '3D Koni Açılımı',
    description: 'Daire taban ve sektörel yan yüzeyden oluşan koniyi uzayda canlandırın.',
    category: 'Geometrik Şekiller',
    difficulty: 'Zor',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/cone-3d',
    component: lazy(() => import('../modules/geometry/cone-3d/ConeApp'))
  },
  {
    id: 'triangular-prism-3d',
    title: 'Üçgen Prizma Açılımı',
    description: 'Kamp çadırı formundaki üçgen prizmasını 3D parçalara ayırarak incele.',
    category: 'Geometrik Şekiller',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/triangular-prism-3d',
    component: lazy(() => import('../modules/geometry/triangular-prism-3d/TriangularPrismApp'))
  },
  {
    id: 'galton-board',
    title: 'Galton Tahtası',
    description: 'Rastgeleliğin ve normal dağılımın (çan eğrisi) görselleştirilmiş hali.',
    category: 'Olasılık',
    difficulty: 'Zor',
    gradeRange: 'Lise',
    path: '/embed/probability/galton-board',
    component: lazy(() => import('../modules/probability/galton-board/GaltonApp'))
  },
  {
    id: 'identity-blocks',
    title: 'Özdeşlik Blokları',
    description: 'Cebirsel ifadeleri görsel bloklarla eşleştirerek öğrenin.',
    category: 'Cebir',
    difficulty: 'Kolay',
    gradeRange: 'Ortaokul',
    path: '/embed/algebra/identity-blocks',
    component: lazy(() => import('../modules/algebra/identity-blocks/IdentityApp'))
  },
  {
    id: 'laser-defense',
    title: 'Lazer Savunma',
    description: 'Açıları ve yansıma kurallarını kullanarak hedefleri vurun.',
    category: 'Fizik',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/physics/laser-defense',
    component: lazy(() => import('../modules/physics/laser-defense/LaserApp'))
  },
  {
    id: 'pythagoras',
    title: 'Pisagor Su İspatı',
    description: 'Dik üçgenin kenarlarındaki karelerin alan ilişkisini su ile görselleştirin.',
    category: 'Geometri',
    difficulty: 'Kolay',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/pythagoras',
    component: lazy(() => import('../modules/geometry/pythagoras/PythagorasApp'))
  },
  {
    id: 'slope-rollercoaster',
    title: 'Eğim Rollercoaster',
    description: 'Yerçekimi ve eğim ilişkisini interaktif bir rollercoaster ile keşfedin.',
    category: 'Fizik',
    difficulty: 'Orta',
    gradeRange: 'Lise',
    path: '/embed/physics/slope-rollercoaster',
    component: lazy(() => import('../modules/physics/slope-rollercoaster/RollercoasterApp'))
  }
];
