import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { ConditionalFilterControls } from './ConditionalFilterControls';
import { ConditionalFilterScene } from './ConditionalFilterScene';
import { ConditionalState } from './types';
import {
  clamp,
  conditionalTargets,
  initialConditionalState,
  isConditionalMissionMatched,
  measureConditional,
  progressFromX,
  resetForConditionalMission,
  roundProgress,
} from './conditionalModel';

const MODULE_ID = 'conditional-probability-filter';

const ATOM_IDS = ['MAT.10.7.1.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'condition',
    title: 'Koşul Kapısı',
    atomId: 'MAT.10.7.1.1',
    prompt: 'Zarın çift geldiği bilindiğinde evreni yalnız çift yüzlere daralt.',
  },
  {
    id: 'target',
    title: 'Hedef Olay',
    atomId: 'MAT.10.7.1.1',
    prompt: "Daralan evrende 4'ten büyük olan yüzü hedef filtresiyle yakala.",
  },
  {
    id: 'fraction',
    title: 'Kesir Mührü',
    atomId: 'MAT.10.7.1.1',
    prompt: 'Uygun yüz ve daralan evren sayısıyla 1/3 sonucunu mühürle.',
  },
];

export default function ConditionalProbabilityFilterApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<ConditionalState>(initialConditionalState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = conditionalTargets[activeIndex];
  const measure = measureConditional(state, target);
  const missionOk = isConditionalMissionMatched(state, target);

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
    setState(resetForConditionalMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialConditionalState);
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
      setState(resetForConditionalMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Koşullu Olasılık Filtresi"
      subtitle="MAT.10.7.1"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Evren', value: measure.universe, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Sonuç', value: state.selectedFraction ?? target.shortLabel, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ConditionalFilterScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onToggleCondition={() => setState((current) => ({ ...current, railProgress: conditionalTargets[0].targetProgress, conditionOn: !current.conditionOn }))}
          onToggleTarget={() => setState((current) => ({ ...current, railProgress: conditionalTargets[1].targetProgress, targetOn: !current.targetOn }))}
          onSelectFraction={() => setState((current) => ({ ...current, railProgress: conditionalTargets[2].targetProgress, selectedFraction: '1/3' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: conditionalTargets[2].targetProgress, reportSealed: !current.reportSealed }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <ConditionalFilterControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onToggleCondition={() => setState((current) => ({ ...current, railProgress: conditionalTargets[0].targetProgress, conditionOn: !current.conditionOn }))}
          onToggleTarget={() => setState((current) => ({ ...current, railProgress: conditionalTargets[1].targetProgress, targetOn: !current.targetOn }))}
          onSelectFraction={() => setState((current) => ({ ...current, railProgress: conditionalTargets[2].targetProgress, selectedFraction: '1/3' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: conditionalTargets[2].targetProgress, reportSealed: !current.reportSealed }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
