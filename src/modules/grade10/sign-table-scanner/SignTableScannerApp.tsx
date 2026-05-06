import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { SignTableControls } from './SignTableControls';
import { SignTableScene } from './SignTableScene';
import { SignDragTarget, SignScannerState } from './types';
import {
  clamp,
  initialSignState,
  isSignMissionMatched,
  measureSign,
  railXToProgress,
  resetForMission,
  rootLeftProgressFromX,
  rootRightProgressFromX,
  roundProgress,
  signTargets,
} from './signTableModel';

const MODULE_ID = 'sign-table-scanner';

const ATOM_IDS = ['MAT.10.2.6.1', 'MAT.10.2.6.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'root-stops',
    title: 'Kök Durakları',
    atomId: 'MAT.10.2.6.1',
    prompt: 'Sol ve sağ kök duraklarını 2 ve 3 lazerlerine taşı; sonra >0 ve <0 bantları bu duraklardan okunacak.',
  },
  {
    id: 'positive-band',
    title: 'Büyüklük Bandı',
    atomId: 'MAT.10.2.6.1',
    prompt: 'Pozitif dış bölgeleri yak. x²-5x+6 > 0 için çözüm dış aralıklardır.',
  },
  {
    id: 'negative-band',
    title: 'Küçüklük Bandı',
    atomId: 'MAT.10.2.6.2',
    prompt: 'Negatif iç bölgeyi yak. x²-5x+6 < 0 için çözüm köklerin arasıdır.',
  },
];

export default function SignTableScannerApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<SignScannerState>(initialSignState);
  const [dragTarget, setDragTarget] = useState<SignDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = signTargets[activeIndex];
  const measure = measureSign(state, activeIndex);
  const missionOk = isSignMissionMatched(state, activeIndex);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateFromProgress = (nextTarget: SignDragTarget, nextProgress: number) => {
    const value = roundProgress(nextProgress);
    setState((current) => {
      if (nextTarget === 'root-left') return { ...current, rootLeft: value };
      if (nextTarget === 'root-right') return { ...current, rootRight: value };
      if (nextTarget === 'positive-band') return { ...current, positiveBand: value };
      return { ...current, negativeBand: value };
    });
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: SignDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    const nextProgress =
      nextTarget === 'root-left'
        ? rootLeftProgressFromX(transformed.x)
        : nextTarget === 'root-right'
          ? rootRightProgressFromX(transformed.x)
          : railXToProgress(transformed.x);
    updateFromProgress(nextTarget, nextProgress);
  };

  const handlePointerDown = (nextTarget: SignDragTarget, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
    updateFromPointer(event, nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    updateFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const getProgressForTarget = (keyTarget: SignDragTarget) => {
    if (keyTarget === 'root-left') return state.rootLeft;
    if (keyTarget === 'root-right') return state.rootRight;
    if (keyTarget === 'positive-band') return state.positiveBand;
    return state.negativeBand;
  };

  const handleKeyDown = (keyTarget: SignDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      updateFromProgress(keyTarget, 1);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.16 : 0.05;
    updateFromProgress(keyTarget, clamp(getProgressForTarget(keyTarget) + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForMission(activeIndex));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialSignState);
    setDragTarget(null);
    progress.restart();
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: target.hint,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForMission(activeIndex + 1));
      setDragTarget(null);
    }
  };

  return (
    <HighSchoolLabShell
      title="İşaret Tablosu Tarayıcısı"
      subtitle="MAT.10.2.6"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(110,231,183,0.12),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Hedef', value: target.shortLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'İfade', value: measure.expression, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <SignTableScene
          state={state}
          activeIndex={activeIndex}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <SignTableControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
