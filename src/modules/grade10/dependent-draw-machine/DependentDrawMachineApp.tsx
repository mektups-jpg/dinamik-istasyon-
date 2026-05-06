import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { DependentDrawControls } from './DependentDrawControls';
import { DependentDrawScene } from './DependentDrawScene';
import { DependentDrawState } from './types';
import {
  clamp,
  dependentDrawTargets,
  initialDependentDrawState,
  isDependentDrawMissionMatched,
  measureDependentDraw,
  progressFromX,
  resetForDependentDrawMission,
  roundProgress,
} from './dependentDrawModel';

const MODULE_ID = 'dependent-draw-machine';

const ATOM_IDS = ['MAT.10.7.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'first',
    title: 'İlk Çekiliş',
    atomId: 'MAT.10.7.2.1',
    prompt: 'İlk kırmızı topu çıkar ve torbaya geri koymadan dış kanala al.',
  },
  {
    id: 'space',
    title: 'Evren Güncelle',
    atomId: 'MAT.10.7.2.1',
    prompt: 'Kalan torbayı 2 kırmızı ve 4 toplam top olarak güncelle.',
  },
  {
    id: 'probability',
    title: 'Olasılık Mührü',
    atomId: 'MAT.10.7.2.1',
    prompt: 'İkinci kırmızı olasılığını yeni örnek uzaydan 1/2 olarak mühürle.',
  },
];

export default function DependentDrawMachineApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<DependentDrawState>(initialDependentDrawState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = dependentDrawTargets[activeIndex];
  const measure = measureDependentDraw(state, target);
  const missionOk = isDependentDrawMissionMatched(state, target);

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
    setState(resetForDependentDrawMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialDependentDrawState);
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
      setState(resetForDependentDrawMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Bağımlı Çekiliş Makinesi"
      subtitle="MAT.10.7.2"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(248,113,113,0.15),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(34,211,238,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Torba', value: measure.bagState, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Sonuç', value: state.selectedProbability ?? target.shortLabel, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <DependentDrawScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onToggleFirstRed={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[0].targetProgress, firstRedRemoved: !current.firstRedRemoved }))}
          onToggleSpaceUpdate={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[1].targetProgress, spaceUpdated: !current.spaceUpdated }))}
          onSelectProbability={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[2].targetProgress, selectedProbability: '1/2' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[2].targetProgress, reportSealed: !current.reportSealed }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <DependentDrawControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onToggleFirstRed={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[0].targetProgress, firstRedRemoved: !current.firstRedRemoved }))}
          onToggleSpaceUpdate={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[1].targetProgress, spaceUpdated: !current.spaceUpdated }))}
          onSelectProbability={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[2].targetProgress, selectedProbability: '1/2' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: dependentDrawTargets[2].targetProgress, reportSealed: !current.reportSealed }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
