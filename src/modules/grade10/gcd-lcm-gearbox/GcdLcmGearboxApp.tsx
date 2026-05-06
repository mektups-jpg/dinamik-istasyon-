import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { GearboxControls } from './GearboxControls';
import { GearboxScene } from './GearboxScene';
import { GearState } from './types';
import {
  clamp,
  gearTargets,
  initialGearState,
  isGearMissionMatched,
  measureGearbox,
  progressFromX,
  resetForGearMission,
  roundProgress,
  toggleGcdGear,
  toggleLcmGear,
} from './gearboxModel';

const MODULE_ID = 'gcd-lcm-gearbox';

const ATOM_IDS = ['MAT.10.1.2.1', 'MAT.10.1.2.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'gcd-axle',
    title: 'EBOB Ortak Aksı',
    atomId: 'MAT.10.1.2.1',
    prompt: '12 ve 18 için ortak küçük asal kuvvetleri seç ve aksı EBOB çizgisine getir.',
  },
  {
    id: 'lcm-axle',
    title: 'EKOK Birleşik Aksı',
    atomId: 'MAT.10.1.2.2',
    prompt: '12 ve 18 için görünen büyük asal kuvvetleri seç ve aksı EKOK çizgisine getir.',
  },
  {
    id: 'gear-seal',
    title: 'Karar Mührü',
    atomId: 'MAT.10.1.2.2',
    prompt: 'Aynı iki sayı için EBOB ve EKOK sonuçlarını rapor mührüne kilitle.',
  },
];

export default function GcdLcmGearboxApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<GearState>(initialGearState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = gearTargets[activeIndex];
  const measure = measureGearbox(state, target);
  const missionOk = isGearMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateAxle = (nextProgress: number) => {
    setState((current) => ({ ...current, axleProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateAxle(progressFromX(transformed.x));
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
      updateAxle(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateAxle(clamp(state.axleProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForGearMission(activeIndex));
    setDragging(false);
  };

  const toggleSeal = () => {
    setState((current): GearState => ({
      ...current,
      axleProgress: gearTargets[2].targetProgress,
      selectedGcdGears: ['2', '3'],
      selectedLcmGears: ['4', '9'],
      sealArmed: !current.sealArmed,
    }));
  };

  const restart = () => {
    setState(initialGearState);
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
      setState(resetForGearMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="EBOB/EKOK Dişli Kutusu"
      subtitle="MAT.10.1.2"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Sayılar', value: '12 & 18', tone: 'cyan' },
        { label: 'Hedef', value: target.shortLabel, tone: missionOk ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <GearboxScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onToggleGcdGear={(gear) => setState((current) => ({ ...current, selectedGcdGears: toggleGcdGear(current.selectedGcdGears, gear) }))}
          onToggleLcmGear={(gear) => setState((current) => ({ ...current, selectedLcmGears: toggleLcmGear(current.selectedLcmGears, gear) }))}
          onToggleSeal={toggleSeal}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <GearboxControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onToggleGcdGear={(gear) => setState((current) => ({ ...current, selectedGcdGears: toggleGcdGear(current.selectedGcdGears, gear) }))}
          onToggleLcmGear={(gear) => setState((current) => ({ ...current, selectedLcmGears: toggleLcmGear(current.selectedLcmGears, gear) }))}
          onToggleSeal={toggleSeal}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
