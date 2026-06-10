import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, type MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { ProbabilityExperimentControls } from './ProbabilityExperimentControls';
import { ProbabilityExperimentScene } from './ProbabilityExperimentScene';
import type { DragTarget, Point } from './types';
import {
  ATOM_IDS,
  MISSIONS,
  MODULE_ID,
  OBSERVED_SUCCESS,
  PROJECTION_SUCCESS,
  clamp,
  isObservedCorrect,
  isProjectionCorrect,
  observedToX,
  projectionToX,
  xToObserved,
  xToProjection,
} from './probabilityExperimentModel';

const missionSteps: MissionStep[] = MISSIONS;

export default function ProbabilityExperimentMachineApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: missionSteps, completionAtomIds: ATOM_IDS });
  const { showMessage } = useAstroBotStore();
  const [observedCount, setObservedCount] = useState(24);
  const [projectionCount, setProjectionCount] = useState(45);
  const [observedLocked, setObservedLocked] = useState(false);
  const [projectionLocked, setProjectionLocked] = useState(false);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'idle' | 'error' | 'success'>('idle');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeMission = MISSIONS[progress.activeIndex];

  useEffect(() => {
    showMessage(activeMission.prompt, 'info');
    setFeedbackTone('idle');
  }, [activeMission.prompt, showMessage]);

  const resetPanel = () => {
    setObservedCount(24);
    setProjectionCount(45);
    setObservedLocked(false);
    setProjectionLocked(false);
    setDragTarget(null);
    setFeedbackTone('idle');
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(target);
    setFeedbackTone('idle');
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getSvgPoint(event, svgRef.current);
    if (!point) return;

    if (dragTarget === 'observed' && !observedLocked) {
      setObservedCount(xToObserved(point.x));
    }

    if (dragTarget === 'projection' && !projectionLocked) {
      setProjectionCount(xToProjection(point.x));
    }
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleHandleKeyDown = (event: React.KeyboardEvent<SVGGElement>, target: DragTarget) => {
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0;

    if (event.key === 'Home') {
      event.preventDefault();
      if (target === 'observed' && !observedLocked) setObservedCount(OBSERVED_SUCCESS);
      if (target === 'projection' && !projectionLocked) setProjectionCount(PROJECTION_SUCCESS);
      setFeedbackTone('idle');
      return;
    }

    if (direction !== 0) {
      event.preventDefault();
      if (target === 'observed' && !observedLocked) setObservedCount((value) => clamp(value + direction, 0, 100));
      if (target === 'projection' && !projectionLocked) setProjectionCount((value) => clamp(value + direction * 5, 0, 200));
      setFeedbackTone('idle');
    }
  };

  const handleCheck = () => {
    const observedOk = activeMission.id === 'observed-ratio' && isObservedCorrect(observedCount);
    const projectionOk = activeMission.id === 'inductive-projection' && isProjectionCorrect(projectionCount);
    const ok = observedOk || projectionOk;

    if (!ok) {
      setFeedbackTone('error');
      progress.submitMission({
        ok: false,
        success: '',
        error: activeMission.id === 'observed-ratio'
          ? 'Sayaç kapağı mavi deney kayıtlarıyla aynı noktaya gelmedi.'
          : 'Projeksiyon kapağı küçük örneklem oranını korumuyor.',
      });
      return;
    }

    if (observedOk) setObservedLocked(true);
    if (projectionOk) setProjectionLocked(true);
    setFeedbackTone('success');

    progress.submitMission({
      ok: true,
      success: activeMission.id === 'observed-ratio'
        ? 'Gözlemsel oran kilitlendi; şimdi aynı oranı daha büyük deneme sayısına taşı.'
        : 'Tümevarımsal tahmin doğru kuruldu.',
      error: '',
    });
  };

  return (
    <Grade9LabShell
      title="Olasılık Deney Makinesi"
      subtitle="MAT.9.7.1.1 / MAT.9.7.2.1"
      moduleId={MODULE_ID}
      missions={missionSteps}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#041018] [background-image:radial-gradient(circle_at_18%_18%,rgba(0,229,255,0.15),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(0,255,136,0.10),transparent_26%),linear-gradient(180deg,#041018_0%,#06111d_55%,#02070d_100%)]"
      badges={[
        { label: 'Sayaç', value: activeMission.id === 'observed-ratio' ? `${observedCount}/100` : `${projectionCount}/200`, tone: 'cyan' },
        { label: 'Katman', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_270px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ProbabilityExperimentScene
          missionId={activeMission.id}
          observedCount={observedCount}
          projectionCount={projectionCount}
          observedLocked={observedLocked}
          projectionLocked={projectionLocked}
          feedbackTone={feedbackTone}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onHandleKeyDown={handleHandleKeyDown}
        />
        <ProbabilityExperimentControls
          mission={activeMission}
          activeIndex={progress.activeIndex}
          observedCount={observedCount}
          projectionCount={projectionCount}
          observedLocked={observedLocked}
          projectionLocked={projectionLocked}
          onObservedChange={setObservedCount}
          onProjectionChange={setProjectionCount}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

function getSvgPoint(event: ReactPointerEvent<SVGElement>, svg: SVGSVGElement | null): Point | null {
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(matrix.inverse());
}
