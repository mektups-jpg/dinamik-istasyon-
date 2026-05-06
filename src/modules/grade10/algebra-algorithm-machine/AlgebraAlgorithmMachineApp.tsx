import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { AlgorithmMachineControls } from './AlgorithmMachineControls';
import { AlgorithmMachineScene } from './AlgorithmMachineScene';
import { AlgorithmState } from './types';
import {
  algorithmTargets,
  clamp,
  initialAlgorithmState,
  isAlgorithmMissionMatched,
  measureAlgorithm,
  progressFromX,
  resetForAlgorithmMission,
  roundProgress,
} from './algorithmModel';

const MODULE_ID = 'algebra-algorithm-machine';

const ATOM_IDS = ['MAT.10.3.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'input',
    title: 'Girdi Portu',
    atomId: 'MAT.10.3.2.1',
    prompt: 'Makineye önce x=3 kapsülünün girdiğini göster.',
  },
  {
    id: 'pipeline',
    title: 'İşlem Boru Hattı',
    atomId: 'MAT.10.3.2.1',
    prompt: 'İşlem zincirini sırayla oku ve çıktı tokenını 7 olarak kilitle.',
  },
  {
    id: 'seal',
    title: 'Kod Mührü',
    atomId: 'MAT.10.3.2.1',
    prompt: 'Cebirsel işlemi sözde kod mührüne dönüştür.',
  },
];

export default function AlgebraAlgorithmMachineApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<AlgorithmState>(initialAlgorithmState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = algorithmTargets[activeIndex];
  const measure = measureAlgorithm(state, target);
  const missionOk = isAlgorithmMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateRail = (nextProgress: number) => {
    setState((current) => ({ ...current, railProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateRail(progressFromX(transformed.x));
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
      updateRail(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateRail(clamp(state.railProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForAlgorithmMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialAlgorithmState);
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
      setState(resetForAlgorithmMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Cebir Algoritma Makinesi"
      subtitle="MAT.10.3.2"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(167,139,250,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Akış', value: target.shortLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Çıktı', value: activeIndex > 0 ? '7' : 'hazır', tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AlgorithmMachineScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectChoice={(choice) => setState((current) => ({ ...current, selectedChoice: choice }))}
          onSelectOutput={(value) => setState((current) => ({ ...current, selectedOutput: value }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: algorithmTargets[2].targetProgress, codeSealed: !current.codeSealed, selectedChoice: 'seal' }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <AlgorithmMachineControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onSelectChoice={(choice) => setState((current) => ({ ...current, selectedChoice: choice }))}
          onSelectOutput={(value) => setState((current) => ({ ...current, selectedOutput: value }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: algorithmTargets[2].targetProgress, codeSealed: !current.codeSealed, selectedChoice: 'seal' }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
