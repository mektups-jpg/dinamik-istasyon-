import { lazy } from 'react';

export type Category = 'Sayılar' | 'Geometri' | 'Fizik' | 'Olasılık' | 'Cebir';
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
    category: 'Geometri',
    difficulty: 'Orta',
    gradeRange: 'Ortaokul',
    path: '/embed/geometry/cylinder-3d',
    component: lazy(() => import('../modules/geometry/cylinder-3d/CylinderApp'))
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
