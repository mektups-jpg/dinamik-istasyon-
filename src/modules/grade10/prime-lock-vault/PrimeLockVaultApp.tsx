import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { PrimeVaultControls } from './PrimeVaultControls';
import { PrimeVaultScene } from './PrimeVaultScene';
import { PrimeVaultState } from './types';
import {
  clamp,
  initialPrimeVaultState,
  isPrimeVaultMissionMatched,
  measureVault,
  resetForPrimeVaultMission,
  scannerProgressFromX,
  toggleValue,
  vaultTargets,
} from './primeVaultModel';

const MODULE_ID = 'prime-lock-vault';

const ATOM_IDS = ['MAT.10.1.1.1', 'MAT.10.1.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'prime',
    title: 'Asal Lazerler',
    atomId: 'MAT.10.1.1.1',
    prompt: '30 sayısını kıran asal lazerleri seç ve tarayıcıyı asal çekirdeğe getir.',
  },
  {
    id: 'divisor',
    title: 'Tam Bölen Rafı',
    atomId: 'MAT.10.1.1.2',
    prompt: '30 sayısının bütün pozitif tam bölen taşlarını seç ve rafı kilitle.',
  },
];

export default function PrimeLockVaultApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<PrimeVaultState>(initialPrimeVaultState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = vaultTargets[activeIndex];
  const measure = measureVault(state, target);
  const missionOk = isPrimeVaultMissionMatched(state, target);
  const targetBadge = missionOk ? target.shortLabel : activeIndex === 0 ? 'Asal kilit' : 'Bölen kilidi';

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateScanner = (nextProgress: number) => {
    setState((current) => ({ ...current, scannerProgress: clamp(Math.round(nextProgress * 100) / 100) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateScanner(scannerProgressFromX(transformed.x));
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
      updateScanner(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateScanner(clamp(state.scannerProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForPrimeVaultMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialPrimeVaultState);
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
      setState(resetForPrimeVaultMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Asal Kilit Kasası"
      subtitle="MAT.10.1.1"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Hedef', value: targetBadge, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Sayı', value: `${measure.number}`, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <PrimeVaultScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onTogglePrime={(value) => setState((current) => ({ ...current, selectedPrimes: toggleValue(current.selectedPrimes, value) }))}
          onToggleDivisor={(value) => setState((current) => ({ ...current, selectedDivisors: toggleValue(current.selectedDivisors, value) }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <PrimeVaultControls
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
