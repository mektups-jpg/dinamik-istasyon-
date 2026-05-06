import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { IdentityShieldControls } from './IdentityShieldControls';
import { IdentityShieldScene } from './IdentityShieldScene';
import { ShieldState } from './types';
import {
  clamp,
  initialShieldState,
  isShieldMissionMatched,
  measureShield,
  progressFromPoint,
  resetForShieldMission,
  roundProgress,
  shieldTargets,
} from './identityShieldModel';

const MODULE_ID = 'unit-circle-identity-shield';

const ATOM_IDS = ['MAT.10.4.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'cos-square',
    title: 'Kosinüs Kare Plakası',
    atomId: 'MAT.10.4.2.1',
    prompt: 'Açı düğümünü hedef ışına getir ve cos² plakasını seç.',
  },
  {
    id: 'sin-square',
    title: 'Sinüs Kare Plakası',
    atomId: 'MAT.10.4.2.1',
    prompt: 'Açı düğümünü ikinci hedefe getir ve sin² plakasını seç.',
  },
  {
    id: 'identity-core',
    title: 'Kalkan Mührü',
    atomId: 'MAT.10.4.2.1',
    prompt: 'Açı düğümünü mühür çizgisine getir ve toplam 1 çekirdeğini kilitle.',
  },
];

export default function UnitCircleIdentityShieldApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<ShieldState>(initialShieldState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = shieldTargets[activeIndex];
  const measure = measureShield(state, target);
  const missionOk = isShieldMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateProgress = (nextProgress: number) => {
    setState((current) => ({ ...current, angleProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateProgress(progressFromPoint({ x: transformed.x, y: transformed.y }));
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
      updateProgress(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateProgress(clamp(state.angleProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForShieldMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialShieldState);
    setDragging(false);
    progress.restart();
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: state.selectedLock === target.lock ? target.hint : `Bu görevde ${target.shortLabel} için doğru kalkan plakasını seçmelisin.`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForShieldMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Birim Çember Kalkanı"
      subtitle="MAT.10.4.2"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Hedef', value: target.shortLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Toplam', value: measure.sum.toFixed(2), tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <IdentityShieldScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectLock={(lock) => setState((current) => ({ ...current, selectedLock: lock }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <IdentityShieldControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          selectedLock={state.selectedLock}
          missionOk={missionOk}
          onSelectLock={(lock) => setState((current) => ({ ...current, selectedLock: lock }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
