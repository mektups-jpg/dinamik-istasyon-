import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { AreaRailControls } from './AreaRailControls';
import { AreaRailScene } from './AreaRailScene';
import { AreaDragTarget, AreaRailState } from './types';
import {
  areaTargets,
  clamp,
  initialAreaState,
  isAreaMissionMatched,
  measureArea,
  progressFromApexX,
  resetForAreaMission,
  roundProgress,
} from './areaRailModel';

const MODULE_ID = 'constant-area-triangle-rail';

const ATOM_IDS = ['MAT.10.4.3.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'left-slide',
    title: 'Sol Kaydırma',
    atomId: 'MAT.10.4.3.1',
    prompt: 'C tepesini sol hedefe kaydır. Taban AB ve yükseklik aynı kalınca alan değişmez.',
  },
  {
    id: 'right-slide',
    title: 'Sağ Kaydırma',
    atomId: 'MAT.10.4.3.1',
    prompt: 'C tepesini sağ hedefe kaydır. Üçgen eğilir ama alan gölgesi sabit kalır.',
  },
  {
    id: 'area-seal',
    title: 'Alan Mührü',
    atomId: 'MAT.10.4.3.1',
    prompt: 'C tepesini orta mühür halkasına getir ve sabit alan ilişkisini kilitle.',
  },
];

export default function ConstantAreaTriangleRailApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<AreaRailState>(initialAreaState);
  const [dragTarget, setDragTarget] = useState<AreaDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = areaTargets[activeIndex];
  const measure = measureArea(state, target);
  const missionOk = isAreaMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateFromProgress = (nextProgress: number) => {
    setState({ apexProgress: roundProgress(nextProgress) });
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: AreaDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateFromProgress(progressFromApexX(transformed.x));
  };

  const handlePointerDown = (nextTarget: AreaDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (_keyTarget: AreaDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      updateFromProgress(target.targetProgress);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.14 : 0.045;
    updateFromProgress(clamp(state.apexProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForAreaMission(activeIndex));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialAreaState);
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
      setState(resetForAreaMission(activeIndex + 1));
      setDragTarget(null);
    }
  };

  return (
    <HighSchoolLabShell
      title="Sabit Alan Üçgen Rayı"
      subtitle="MAT.10.4.3"
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
        { label: 'Alan', value: `${measure.area} br²`, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AreaRailScene
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
        <AreaRailControls
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
