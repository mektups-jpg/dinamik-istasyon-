import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { ConcaveConvexControls } from './ConcaveConvexControls';
import { ConcaveConvexScene } from './ConcaveConvexScene';
import { DetectorDragTarget, DetectorState, PolygonKind } from './types';
import {
  clamp,
  detectorTargets,
  initialDetectorState,
  isTargetMatched,
  measureDetector,
  railXToProgress,
  roundProgress,
} from './detectorModel';

const MODULE_ID = 'concave-convex-laser-detector';

const ATOM_IDS = ['MAT.11.2.3.1', 'MAT.11.2.3.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'convex-scan',
    title: 'Konveks Tarama',
    atomId: 'MAT.11.2.3.1',
    prompt: 'Açı probunu sona taşı. Hiçbir köşe 180° alarmı vermiyorsa Konveks kilidini seç.',
  },
  {
    id: 'concave-alarm',
    title: 'Konkav Alarm',
    atomId: 'MAT.11.2.3.2',
    prompt: 'İçeri göçen köşeyi tarayıp >180° alarmını yakala. Sonra Konkav kilidini seç.',
  },
];

export default function ConcaveConvexLaserDetectorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<DetectorState>(initialDetectorState);
  const [dragTarget, setDragTarget] = useState<DetectorDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = detectorTargets[activeIndex];
  const measure = measureDetector(state, target);
  const missionOk = isTargetMatched(state, target);

  const activeScanKey = target.profile === 'convex' ? 'convexScan' : 'concaveScan';

  const resetPanel = () => {
    setState(activeIndex === 0 ? initialDetectorState : { convexScan: 1, concaveScan: 0.1, selectedKind: null });
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialDetectorState);
    setDragTarget(null);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: DetectorDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    const nextProgress = railXToProgress(transformed.x);

    setState((current) => ({ ...current, [activeScanKey]: nextProgress }));
  };

  const handlePointerDown = (nextTarget: DetectorDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (_keyTarget: DetectorDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({ ...current, [activeScanKey]: 1 }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.12 : 0.04;
    const signedDelta = event.key === 'ArrowRight' ? delta : -delta;
    setState((current) => ({ ...current, [activeScanKey]: roundProgress(clamp(current[activeScanKey] + signedDelta)) }));
  };

  const prepareNextMission = () => {
    setState({ convexScan: 1, concaveScan: 0.1, selectedKind: null });
    setDragTarget(null);
  };

  const handleSelectKind = (kind: PolygonKind) => {
    setState((current) => ({ ...current, selectedKind: kind }));
  };

  const getErrorMessage = () => {
    if (target.profile === 'convex' && state.selectedKind === 'concave') {
      return 'Bu numunede >180° alarmı yok; bütün köşeler 180° altında kaldığı için Konveks kilidi gerekir.';
    }
    if (target.profile === 'concave' && state.selectedKind === 'convex') {
      return 'İçeri göçen köşede >180° alarmı var; bu işaret Konkav kilidini gerektirir.';
    }
    return `Dedektör hedefte değil. ${target.hint}`;
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Konveks numune doğru okundu. Şimdi içeri göçen köşenin alarmını yakala.',
      error: getErrorMessage(),
    });

    if (accepted && activeIndex === 0) {
      prepareNextMission();
    }
  };

  return (
    <HighSchoolLabShell
      title="Konkav-Konveks Lazer Dedektörü"
      subtitle="MAT.11.2.3"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,113,133,0.12),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Tarama', value: `%${Math.round(measure.scanProgress * 100)}`, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Kilit', value: measure.selectedLabel, tone: missionOk ? 'green' : 'pink' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ConcaveConvexScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          onSelectKind={handleSelectKind}
        />
        <ConcaveConvexControls
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
