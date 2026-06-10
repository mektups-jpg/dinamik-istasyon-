import { AbsoluteBuild, AbsoluteMission, GraphPoint, MirrorSlope } from './types';

export const MODULE_ID = 'absolute-value-mirror-room';
export const atomIds = ['MAT.9.2.2.1', 'MAT.9.2.2.2'];

export const graphConfig = {
  originX: 360,
  originY: 330,
  scale: 46,
  minX: -6,
  maxX: 6,
};

export const initialBuild: AbsoluteBuild = {
  vertexX: 1,
  folded: false,
  slope: 1,
};

export const mirrorMissions: AbsoluteMission[] = [
  {
    id: 'fold-base-absolute',
    title: 'Negatif Kolu Katla',
    atomId: 'MAT.9.2.2.1',
    expression: 'f(x)=|x|',
    prompt: 'Sol altta kalan negatif kolu x eksenindeki aynadan yukarı katla.',
    target: { vertexX: 0, folded: true, slope: 1 },
    mechanic: 'Katlama kapısını aç; tepe noktası orijinde kalsın.',
    success: 'Negatif kol yukarı katlandı; |x| grafiği V şeklinde kuruldu.',
    error: 'Mutlak değer için negatif çıktı altta kalmaz; kol yukarı katlanmalı ve tepe orijinde olmalı.',
    resultLabel: 'Tepe (0, 0), iki kol yukarı açık.',
  },
  {
    id: 'shifted-vertex',
    title: 'Tepeyi Taşı',
    atomId: 'MAT.9.2.2.2',
    expression: 'f(x)=|x - 2|',
    prompt: 'İç ifade sıfır olduğunda V grafiği zemine değer. Tepe noktasını o noktaya sürükle.',
    target: { vertexX: 2, folded: true, slope: 1 },
    mechanic: 'Ayna açık kalsın; yalnız tepe noktasını x ekseninde gezdir.',
    success: 'Tepe noktası iç ifadenin sıfırlandığı yere taşındı.',
    error: 'Tepe, mutlak değerin içindeki ifadenin sıfır olduğu x noktasında olmalı.',
    resultLabel: 'Tepe x=2 üzerinde; grafik sağa kaydı.',
  },
  {
    id: 'steep-vertex',
    title: 'Dik Ayna Kolları',
    atomId: 'MAT.9.2.2.2',
    expression: 'f(x)=|2x + 4|',
    prompt: 'Kollar iki kat dik. İç ifade sıfırlandığı noktayı bul, tepeyi hedefe taşı ve negatif kolu katla.',
    target: { vertexX: -2, folded: true, slope: 2 },
    mechanic: 'Eğim 2 hazır; tepe noktası hedefe gelince mavi sağ kol kesikli hedefle çakışır.',
    success: 'Tepe ve diklik birlikte kuruldu; |2x+4| grafiği hazır.',
    error: 'Bu grafikte hem tepe yeri hem de kolların dikliği aynı anda doğru olmalı.',
    resultLabel: 'Tepe x=−2 üzerinde; kollar iki kat dik.',
  },
];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatSigned(value: number): string {
  if (value === 0) return '0';
  return value < 0 ? `−${Math.abs(value)}` : String(value);
}

export function graphToSvg(point: GraphPoint): GraphPoint {
  return {
    x: graphConfig.originX + point.x * graphConfig.scale,
    y: graphConfig.originY - point.y * graphConfig.scale,
  };
}

export function svgToGraphX(svgX: number): number {
  const raw = (svgX - graphConfig.originX) / graphConfig.scale;
  return Math.round(clamp(raw, graphConfig.minX, graphConfig.maxX));
}

export function absoluteY(x: number, build: AbsoluteBuild): number {
  const raw = build.slope * (x - build.vertexX);
  return build.folded ? Math.abs(raw) : raw;
}

export function buildMatches(build: AbsoluteBuild, target: AbsoluteBuild): boolean {
  return build.vertexX === target.vertexX && build.folded === target.folded && build.slope === target.slope;
}

export function nudgeVertex(build: AbsoluteBuild, delta: number): AbsoluteBuild {
  return {
    ...build,
    vertexX: clamp(build.vertexX + delta, graphConfig.minX + 1, graphConfig.maxX - 1),
  };
}

export function toggleSlope(build: AbsoluteBuild): AbsoluteBuild {
  return {
    ...build,
    slope: build.slope === 1 ? 2 : 1,
  };
}

export function getMissionStartBuild(mission: AbsoluteMission): AbsoluteBuild {
  if (mission.id === 'steep-vertex') {
    return {
      ...initialBuild,
      slope: mission.target.slope,
    };
  }

  return initialBuild;
}

export function createFunctionPath(build: AbsoluteBuild, foldedOverride?: boolean): string {
  const pathBuild = typeof foldedOverride === 'boolean' ? { ...build, folded: foldedOverride } : build;
  const points: string[] = [];

  for (let x = graphConfig.minX; x <= graphConfig.maxX + 0.001; x += 0.2) {
    const point = graphToSvg({ x, y: absoluteY(x, pathBuild) });
    points.push(`${point.x.toFixed(1)},${point.y.toFixed(1)}`);
  }

  return points.join(' ');
}

export function createRayPath(build: AbsoluteBuild, side: 'left' | 'right', folded: boolean): string {
  const points: string[] = [];
  const start = side === 'left' ? graphConfig.minX : build.vertexX;
  const end = side === 'left' ? build.vertexX : graphConfig.maxX;

  for (let x = start; x <= end + 0.001; x += 0.16) {
    const point = graphToSvg({ x, y: absoluteY(x, { ...build, folded }) });
    points.push(`${point.x.toFixed(1)},${point.y.toFixed(1)}`);
  }

  return points.join(' ');
}

export function getVertexPoint(build: AbsoluteBuild): GraphPoint {
  return graphToSvg({ x: build.vertexX, y: 0 });
}

export function slopeLabel(slope: MirrorSlope): string {
  return slope === 1 ? 'eğim 1' : 'eğim 2';
}
