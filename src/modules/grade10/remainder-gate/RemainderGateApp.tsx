import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { RemainderGateControls } from './RemainderGateControls';
import { RemainderGateScene } from './RemainderGateScene';
import { RemainderState } from './types';
import {
  clamp,
  initialRemainderState,
  isRemainderMissionMatched,
  measureRemainder,
  progressFromX,
  remainderTargets,
  resetForRemainderMission,
  roundProgress,
} from './remainderModel';

const MODULE_ID = 'remainder-gate';

const ATOM_IDS = ['MAT.10.1.3.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'digit-sum',
    title: 'Rakam Toplamı Kapısı',
    atomId: 'MAT.10.1.3.1',
    prompt: '758 için rakam toplamı lensini aç, kapsülü mod 9 kapısına getir ve kalan tokenını seç.',
  },
  {
    id: 'last-digit',
    title: 'Son Basamak Kapısı',
    atomId: 'MAT.10.1.3.1',
    prompt: '748 için son basamak lensini aç, kapsülü mod 5 kapısına getir ve kalan tokenını seç.',
  },
  {
    id: 'last-two',
    title: 'Son İki Basamak Kapısı',
    atomId: 'MAT.10.1.3.1',
    prompt: '3714 için son iki basamak lensini aç, kapsülü mod 4 kapısına getir ve kalan tokenını seç.',
  },
];

export default function RemainderGateApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<RemainderState>(initialRemainderState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = remainderTargets[activeIndex];
  const measure = measureRemainder(state, target);
  const missionOk = isRemainderMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateGate = (nextProgress: number) => {
    setState((current) => ({ ...current, gateProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateGate(progressFromX(transformed.x));
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
      updateGate(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateGate(clamp(state.gateProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForRemainderMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialRemainderState);
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
      setState(resetForRemainderMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Kalan Kapısı"
      subtitle="MAT.10.1.3"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Sayı', value: String(target.number), tone: 'cyan' },
        { label: 'Hedef', value: target.shortLabel, tone: missionOk ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RemainderGateScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectLens={(lens) => setState((current) => ({ ...current, selectedLens: lens }))}
          onSelectRemainder={(value) => setState((current) => ({ ...current, selectedRemainder: value }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <RemainderGateControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onSelectLens={(lens) => setState((current) => ({ ...current, selectedLens: lens }))}
          onSelectRemainder={(value) => setState((current) => ({ ...current, selectedRemainder: value }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
