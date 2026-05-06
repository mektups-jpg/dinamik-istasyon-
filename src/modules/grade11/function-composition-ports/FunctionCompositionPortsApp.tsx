import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { CompositionPortControls } from './CompositionPortControls';
import { CompositionPortScene } from './CompositionPortScene';
import { CapsuleKind, CompositionState, Point } from './types';
import {
  clampPoint,
  compositionFrame,
  compositionTargets,
  initialCompositionState,
  isTargetMatched,
  measureComposition,
  snapInputToG,
  snapOutputToF,
} from './compositionModel';

const MODULE_ID = 'function-composition-ports';

const ATOM_IDS = ['MAT.11.1.7.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'run-g-machine',
    title: 'g Makinesini Çalıştır',
    atomId: 'MAT.11.1.7.1',
    prompt: 'x=3 kapsülünü g(x)=2x+1 makinesinin sol portuna tak. Ara çıktı 7 olarak doğacak.',
  },
  {
    id: 'link-f-port',
    title: 'f Portuna Bağla',
    atomId: 'MAT.11.1.7.1',
    prompt: 'Yeni doğan g(x)=7 kapsülünü f(u)=u²-4 makinesinin giriş portuna bağla.',
  },
  {
    id: 'stamp-chain',
    title: 'Bileşke Zinciri Mührü',
    atomId: 'MAT.11.1.7.1',
    prompt: 'Zinciri soldan sağa oku: x önce g makinesine, çıkan değer sonra f makinesine girer.',
  },
];

export default function FunctionCompositionPortsApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<CompositionState>(initialCompositionState);
  const [dragging, setDragging] = useState<CapsuleKind | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = compositionTargets[activeIndex];
  const measure = measureComposition(state);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(initialCompositionState);
    setDragging(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const eventToSvgPoint = (event: ReactPointerEvent<SVGElement>): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return null;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    return clampPoint({ x: transformed.x, y: transformed.y });
  };

  const handlePointerDown = (kind: CapsuleKind, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(kind);
    const point = eventToSvgPoint(event);
    if (!point) return;
    setState((current) => updateDraggedPoint(current, kind, point));
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragging) return;
    const point = eventToSvgPoint(event);
    if (!point) return;
    setState((current) => updateDraggedPoint(current, dragging, point));
  };

  const handlePointerUp = () => {
    setState((current) => snapIfReady(current, dragging));
    setDragging(null);
  };

  const handleKeyDown = (kind: CapsuleKind, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Home') return;
    event.preventDefault();

    setState((current) => {
      if (kind === 'input' && current.phase === 'input-ready') {
        return { ...current, phase: 'g-output-ready', input: compositionFrame.gInput, output: compositionFrame.gOutput };
      }
      if (kind === 'output' && current.phase === 'g-output-ready') {
        return { ...current, phase: 'linked-to-f', output: compositionFrame.fInput };
      }
      return current;
    });
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: target.hint,
    });
  };

  return (
    <HighSchoolLabShell
      title="Fonksiyon Bileşke Portları"
      subtitle="MAT.11.1.7.1"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06111f] [background-image:radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.20),transparent_31%),radial-gradient(circle_at_78%_18%,rgba(167,139,250,0.18),transparent_34%),radial-gradient(circle_at_72%_84%,rgba(52,211,153,0.13),transparent_32%),linear-gradient(180deg,#06111f_0%,#081426_58%,#03070e_100%)]"
      badges={[
        { label: 'Aşama', value: measure.phaseLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Zincir', value: measure.chainLabel, tone: state.phase === 'linked-to-f' ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <CompositionPortScene
          state={state}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <CompositionPortControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          measure={measure}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}

function updateDraggedPoint(state: CompositionState, kind: CapsuleKind, point: Point): CompositionState {
  if (kind === 'input' && state.phase === 'input-ready') return { ...state, input: point };
  if (kind === 'output' && state.phase === 'g-output-ready') return { ...state, output: point };
  return state;
}

function snapIfReady(state: CompositionState, kind: CapsuleKind | null): CompositionState {
  if (kind === 'input' && state.phase === 'input-ready' && snapInputToG(state.input)) {
    return { ...state, phase: 'g-output-ready', input: compositionFrame.gInput, output: compositionFrame.gOutput };
  }

  if (kind === 'output' && state.phase === 'g-output-ready' && snapOutputToF(state.output)) {
    return { ...state, phase: 'linked-to-f', output: compositionFrame.fInput };
  }

  return state;
}
