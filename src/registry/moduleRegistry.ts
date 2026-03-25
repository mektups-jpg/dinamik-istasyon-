import { lazy } from 'react';

export type Category = 'Geometri' | 'Fizik' | 'Olasılık' | 'Cebir';
export type Difficulty = 'Kolay' | 'Orta' | 'Zor';

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  thumbnail?: string;
}

export const modules: ModuleMeta[] = [
  {
    id: 'unit-circle',
    title: 'Trigonometrik Birim Çember',
    description: 'Sinüs, Kosinüs ve Tanjant değerlerini interaktif birim çember üzerinde keşfedin. Özel açıları bularak puan kazanın!',
    category: 'Geometri',
    difficulty: 'Orta',
    path: '/embed/geometry/unit-circle',
    component: lazy(() => import('../modules/geometry/unit-circle/UnitCircleApp'))
  },
  {
    id: 'cylinder-3d',
    title: '3D Silindir Açılımı',
    description: 'Dikdörtgenin kıvrılarak silindire dönüşümünü 3D olarak inceleyin.',
    category: 'Geometri',
    difficulty: 'Orta',
    path: '/embed/geometry/cylinder-3d',
    component: lazy(() => import('../modules/geometry/cylinder-3d/CylinderApp'))
  },
  {
    id: 'galton-board',
    title: 'Galton Tahtası',
    description: 'Rastgeleliğin ve normal dağılımın (çan eğrisi) görselleştirilmiş hali.',
    category: 'Olasılık',
    difficulty: 'Zor',
    path: '/embed/probability/galton-board',
    component: lazy(() => import('../modules/probability/galton-board/GaltonApp'))
  },
  {
    id: 'identity-blocks',
    title: 'Özdeşlik Blokları',
    description: 'Cebirsel ifadeleri görsel bloklarla eşleştirerek öğrenin.',
    category: 'Cebir',
    difficulty: 'Kolay',
    path: '/embed/algebra/identity-blocks',
    component: lazy(() => import('../modules/algebra/identity-blocks/IdentityApp'))
  },
  {
    id: 'laser-defense',
    title: 'Lazer Savunma',
    description: 'Açıları ve yansıma kurallarını kullanarak hedefleri vurun.',
    category: 'Fizik',
    difficulty: 'Orta',
    path: '/embed/physics/laser-defense',
    component: lazy(() => import('../modules/physics/laser-defense/LaserApp'))
  },
  {
    id: 'pythagoras',
    title: 'Pisagor Su İspatı',
    description: 'Dik üçgenin kenarlarındaki karelerin alan ilişkisini su ile görselleştirin.',
    category: 'Geometri',
    difficulty: 'Kolay',
    path: '/embed/geometry/pythagoras',
    component: lazy(() => import('../modules/geometry/pythagoras/PythagorasApp'))
  },
  {
    id: 'slope-rollercoaster',
    title: 'Eğim Rollercoaster',
    description: 'Yerçekimi ve eğim ilişkisini interaktif bir rollercoaster ile keşfedin.',
    category: 'Fizik',
    difficulty: 'Orta',
    path: '/embed/physics/slope-rollercoaster',
    component: lazy(() => import('../modules/physics/slope-rollercoaster/RollercoasterApp'))
  }
];
