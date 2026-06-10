import type { TheoremBuild, TheoremMission, TheoremTool, TheoremToolId } from './types';

export const MODULE_ID = 'right-triangle-theorem-lab';

export const atomIds = ['MAT.9.5.3.1', 'MAT.9.5.3.2', 'MAT.9.5.3.3'];

export const theoremMissions: TheoremMission[] = [
  {
    id: 'tales-parallel-slice',
    title: 'Tales Kesit Rayı',
    atomId: 'MAT.9.5.3.1',
    mode: 'tales',
    prompt: 'Paralel kesit iki kenarı aynı oranda böler. Kesiti doğru orana getir ve parça-bütün bağı kur.',
    targetTools: ['tales-slice-3-5', 'tales-part-whole'],
    tools: [
      tool('tales-slice-2-5', 'Kesit 2/5', 'Parçalar küçük kalır'),
      tool('tales-slice-3-5', 'Kesit 3/5', 'AD/AC ve AE/AB aynı'),
      tool('tales-slice-4-5', 'Kesit 4/5', 'Kesit hedefi aşar'),
      tool('tales-part-whole', 'Parça / bütün', 'AD/AC = AE/AB'),
      tool('tales-cross-product', 'Çapraz çarp', 'Tales için önce oran gerekir'),
    ],
    resultLabel: 'AD/AC = AE/AB = 3/5',
    success: 'Paralel kesit iki kenarda aynı parça-bütün oranını verdi.',
    error: 'Kesit oranı veya parça-bütün bağı eksik. Paralel çizgi iki kenarı aynı oranda bölmeli.',
    hint: 'Tales teoreminde paralel kesitler aynı oranda ilerler.',
  },
  {
    id: 'euclid-height-lock',
    title: 'Öklid Yükseklik Kilidi',
    atomId: 'MAT.9.5.3.2',
    mode: 'euclid',
    prompt: 'Dik açıdan hipotenüse inen yükseklik, hipotenüsü p ve k parçalarına ayırır.',
    targetTools: ['euclid-height-square', 'euclid-segment-product'],
    tools: [
      tool('euclid-height-square', 'Yüksekliğin karesi', 'h² alan karesi'),
      tool('euclid-segment-product', 'p · k çarpımı', 'Hipotenüs parçaları'),
      tool('euclid-leg-square', 'Bir kenarın karesi', 'Bu görevde yükseklik izlenir'),
      tool('euclid-sum-segments', 'p + k toplamı', 'Bu yalnız hipotenüs uzunluğu'),
    ],
    resultLabel: 'h² = p · k',
    success: 'Yükseklik karesi, hipotenüs parçalarının çarpımına bağlandı.',
    error: 'Öklid yüksekliğinde yükseklik karesi ve p · k çarpımı birlikte kurulmalı.',
    hint: 'Dik üçgende yükseklik hipotenüsü iki parçaya böler: h² = p · k.',
  },
  {
    id: 'pythagoras-equation-bridge',
    title: 'Pisagor Denklem Köprüsü',
    atomId: 'MAT.9.5.3.3',
    mode: 'pythagoras',
    prompt: 'Harfli dik üçgende iki dik kenarın kareleri, hipotenüs karesini kurar.',
    targetTools: ['pythagoras-leg-a', 'pythagoras-leg-b', 'pythagoras-hypotenuse', 'pythagoras-sum-equation'],
    tools: [
      tool('pythagoras-leg-a', 'x karesi', 'Birinci dik kenar'),
      tool('pythagoras-leg-b', '(x + 2) karesi', 'İkinci dik kenar'),
      tool('pythagoras-hypotenuse', '10 karesi', 'Hipotenüs tarafı'),
      tool('pythagoras-sum-equation', 'Kareleri topla', 'Dik kenar kareleri birleşir'),
      tool('pythagoras-product-equation', 'Kenarları çarp', 'Pisagor çarpım istemez'),
    ],
    resultLabel: 'x² + (x + 2)² = 10²',
    success: 'Dik kenar kareleri hipotenüs karesine denklem oldu.',
    error: 'Pisagor denkleminde iki dik kenarın karesi toplanır ve hipotenüs karesine eşitlenir.',
    hint: 'Hipotenüs en uzun kenardır; denklemde tek başına sağ tarafa geçer.',
  },
];

export function initialBuild(): TheoremBuild {
  return {
    selectedTools: [],
  };
}

export function toggleTool(build: TheoremBuild, toolId: TheoremToolId): TheoremBuild {
  const selected = build.selectedTools.includes(toolId);
  return {
    selectedTools: selected
      ? build.selectedTools.filter((id) => id !== toolId)
      : [...build.selectedTools, toolId],
  };
}

export function autoBuildFor(mission: TheoremMission): TheoremBuild {
  return {
    selectedTools: [...mission.targetTools],
  };
}

export function buildMatches(build: TheoremBuild, mission: TheoremMission): boolean {
  return (
    build.selectedTools.length === mission.targetTools.length &&
    mission.targetTools.every((toolId) => build.selectedTools.includes(toolId))
  );
}

export function evidenceLabel(build: TheoremBuild, mission: TheoremMission): string {
  return `${build.selectedTools.length}/${mission.targetTools.length} kilit`;
}

export function isTargetTool(mission: TheoremMission, toolId: TheoremToolId): boolean {
  return mission.targetTools.includes(toolId);
}

function tool(id: TheoremToolId, label: string, detail: string): TheoremTool {
  return { id, label, detail };
}
