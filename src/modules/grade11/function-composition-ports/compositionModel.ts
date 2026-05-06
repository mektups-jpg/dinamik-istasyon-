import { CompositionMeasure, CompositionPhase, CompositionState, CompositionTarget, Point } from './types';

export const compositionFrame = {
  width: 900,
  height: 520,
  inputHome: { x: 108, y: 260 },
  gInput: { x: 252, y: 260 },
  gOutput: { x: 472, y: 260 },
  fInput: { x: 628, y: 260 },
  finalOutput: { x: 798, y: 260 },
};

export const compositionTargets: CompositionTarget[] = [
  {
    id: 'run-g-machine',
    atomId: 'MAT.11.1.7.1',
    title: 'g Makinesini Çalıştır',
    hint: 'Ham x kapsülünü önce g makinesinin sol portuna takmalısın.',
    success: 'g makinesi x=3 girdisini 7 ara çıktısına çevirdi.',
    requiredPhase: 'g-output-ready',
  },
  {
    id: 'link-f-port',
    atomId: 'MAT.11.1.7.1',
    title: 'f Portuna Bağla',
    hint: 'f portuna ham x değil, önce g(x) çıktısı girmeli.',
    success: 'Ara çıktı f portuna bağlandı. Zincir artık f(g(x)) olarak okunuyor.',
    requiredPhase: 'linked-to-f',
  },
  {
    id: 'stamp-chain',
    atomId: 'MAT.11.1.7.1',
    title: 'Bileşke Zinciri Mührü',
    hint: 'Önce x -> g -> f zincirini tamamla; sonra sonucu mühürle.',
    success: 'Bileşke sırası doğru: önce g, sonra f.',
    requiredPhase: 'linked-to-f',
  },
];

export const initialCompositionState: CompositionState = {
  phase: 'input-ready',
  input: compositionFrame.inputHome,
  output: compositionFrame.gOutput,
};

export const measureComposition = (state: CompositionState): CompositionMeasure => {
  const x = 3;
  const gx = 2 * x + 1;
  const final = gx * gx - 4;

  const phaseLabel: Record<CompositionPhase, string> = {
    'input-ready': 'x hazır',
    'g-output-ready': 'g(x) doğdu',
    'linked-to-f': 'f(g(x)) bağlı',
  };

  const nextAction: Record<CompositionPhase, string> = {
    'input-ready': 'x kapsülünü g portuna taşı',
    'g-output-ready': 'g(x)=7 kapsülünü f portuna bağla',
    'linked-to-f': 'zinciri oku ve mühürle',
  };

  return {
    x,
    gx,
    final,
    phaseLabel: phaseLabel[state.phase],
    chainLabel: state.phase === 'linked-to-f' ? `f(g(${x})) = ${final}` : state.phase === 'g-output-ready' ? `g(${x}) = ${gx}` : `x = ${x}`,
    nextAction: nextAction[state.phase],
  };
};

export const isTargetMatched = (state: CompositionState, target: CompositionTarget) => {
  if (target.id === 'run-g-machine') return state.phase === 'g-output-ready' || state.phase === 'linked-to-f';
  return state.phase === target.requiredPhase;
};

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const snapInputToG = (point: Point) => distance(point, compositionFrame.gInput) <= 82;

export const snapOutputToF = (point: Point) => distance(point, compositionFrame.fInput) <= 90;

export const clampPoint = (point: Point): Point => ({
  x: Math.min(compositionFrame.width - 62, Math.max(62, point.x)),
  y: Math.min(compositionFrame.height - 72, Math.max(80, point.y)),
});

export const targetPointForPhase = (phase: CompositionPhase, kind: 'input' | 'output'): Point => {
  if (kind === 'input') return phase === 'input-ready' ? compositionFrame.gInput : compositionFrame.gInput;
  return compositionFrame.fInput;
};
