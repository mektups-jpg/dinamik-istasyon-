import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { CountingLineControls } from './CountingLineControls';
import { CountingLineScene } from './CountingLineScene';
import { CountingState } from './types';
import {
  clamp,
  countingTargets,
  initialCountingState,
  isCountingMissionMatched,
  measureCounting,
  progressFromX,
  resetForCountingMission,
  roundProgress,
} from './countingModel';

const MODULE_ID = 'counting-assembly-line';

const ATOM_IDS = ['MAT.10.3.1.1', 'MAT.10.3.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'product',
    title: 'Çarpma Bandı',
    atomId: 'MAT.10.3.1.1',
    prompt: '3 renk ve 2 rozet aynı üründe birleşiyor; çarpma bandını ve 6 tokenını kilitle.',
  },
  {
    id: 'sum',
    title: 'Toplama Bandı',
    atomId: 'MAT.10.3.1.2',
    prompt: '4 drone veya 3 rover ayrık hatlarda duruyor; toplama bandını ve 7 tokenını kilitle.',
  },
  {
    id: 'seal',
    title: 'Sayma Mührü',
    atomId: 'MAT.10.3.1.2',
    prompt: 'Beraber kurulan seçim ile ayrık seçenek ayrımını rapor mührüne kilitle.',
  },
];

export default function CountingAssemblyLineApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<CountingState>(initialCountingState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = countingTargets[activeIndex];
  const measure = measureCounting(state, target);
  const missionOk = isCountingMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateBelt = (nextProgress: number) => {
    setState((current) => ({ ...current, beltProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateBelt(progressFromX(transformed.x));
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragging) return;
    updateFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      updateBelt(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateBelt(clamp(state.beltProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForCountingMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialCountingState);
    setDragging(false);
    progress.restart();
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: target.hint,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForCountingMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Sayma Montaj Hattı"
      subtitle="MAT.10.3.1"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'İfade', value: target.shortLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Kural', value: target.id === 'sum' ? 'Toplama' : target.id === 'product' ? 'Çarpma' : 'Ayrım', tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <CountingLineScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectMode={(mode) => setState((current) => ({ ...current, selectedMode: mode }))}
          onSelectToken={(value) => setState((current) => ({ ...current, selectedToken: value }))}
          onToggleSeal={() => setState((current) => ({ ...current, sealArmed: !current.sealArmed, selectedMode: 'seal' }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <CountingLineControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onSelectMode={(mode) => setState((current) => ({ ...current, selectedMode: mode }))}
          onSelectToken={(value) => setState((current) => ({ ...current, selectedToken: value }))}
          onToggleSeal={() => setState((current) => ({ ...current, sealArmed: !current.sealArmed, selectedMode: 'seal' }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
