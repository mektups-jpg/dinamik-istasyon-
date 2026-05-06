import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { InverseMirrorControls } from './InverseMirrorControls';
import { InverseMirrorScene } from './InverseMirrorScene';
import { InverseDragTarget, InverseMirrorState, InverseSeal } from './types';
import {
  clamp,
  initialInverseState,
  inverseTargets,
  isInverseMissionMatched,
  measureInverse,
  railXToProgress,
  resetForMission,
  roundProgress,
} from './inverseModel';

const MODULE_ID = 'inverse-function-mirror';

const ATOM_IDS = ['MAT.10.2.5.1', 'MAT.10.2.5.2', 'MAT.10.2.5.3', 'MAT.10.2.5.4'];

const MISSIONS: MissionStep[] = [
  {
    id: 'linear-inverse',
    title: 'Doğrusal Ayna',
    atomId: 'MAT.10.2.5.1',
    prompt: 'Aynayı aç, x ve f(x) kapsüllerini ters portlara taşı. Sonra Doğrusal mührünü seç.',
  },
  {
    id: 'branch-gate',
    title: 'Dal Kapısı',
    atomId: 'MAT.10.2.5.2',
    prompt: 'Karesel grafikte tek dalı seç. Ayna açıkken Dal mührünü kilitle.',
  },
  {
    id: 'rational-inverse',
    title: 'Rasyonel Tersleme',
    atomId: 'MAT.10.2.5.4',
    prompt: 'Rasyonel kapsülleri ters portlara taşı. Yasak duvar korununca Rasyonel mührünü seç.',
  },
];

export default function InverseFunctionMirrorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<InverseMirrorState>(initialInverseState);
  const [dragTarget, setDragTarget] = useState<InverseDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = inverseTargets[activeIndex];
  const measure = measureInverse(state, activeIndex);
  const missionOk = isInverseMissionMatched(state, activeIndex);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateFromProgress = (nextTarget: InverseDragTarget, nextProgress: number) => {
    const value = roundProgress(nextProgress);
    setState((current) => {
      if (nextTarget === 'mirror-arm') return { ...current, mirrorArm: value, selectedSeal: null };
      if (nextTarget === 'input-capsule') return { ...current, inputCapsule: value, selectedSeal: null };
      if (nextTarget === 'output-capsule') return { ...current, outputCapsule: value, selectedSeal: null };
      return { ...current, branchGate: value, selectedSeal: null };
    });
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: InverseDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateFromProgress(nextTarget, railXToProgress(transformed.x));
  };

  const handlePointerDown = (nextTarget: InverseDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const getProgressForTarget = (keyTarget: InverseDragTarget) => {
    if (keyTarget === 'mirror-arm') return state.mirrorArm;
    if (keyTarget === 'input-capsule') return state.inputCapsule;
    if (keyTarget === 'output-capsule') return state.outputCapsule;
    return state.branchGate;
  };

  const handleKeyDown = (keyTarget: InverseDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      updateFromProgress(keyTarget, 1);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.16 : 0.05;
    updateFromProgress(keyTarget, clamp(getProgressForTarget(keyTarget) + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForMission(activeIndex));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialInverseState);
    setDragTarget(null);
    progress.restart();
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: state.selectedSeal !== target.correctSeal ? `Yanlış mühür seçildi. ${target.hint}` : target.hint,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForMission(activeIndex + 1));
      setDragTarget(null);
    }
  };

  const handleSelectSeal = (seal: InverseSeal) => {
    setState((current) => ({ ...current, selectedSeal: seal }));
  };

  return (
    <HighSchoolLabShell
      title="Ters Fonksiyon Aynası"
      subtitle="MAT.10.2.5"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(167,139,250,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Ayna', value: measure.mirrorLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Mühür', value: measure.selectedLabel, tone: missionOk ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <InverseMirrorScene
          state={state}
          activeIndex={activeIndex}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          onSelectSeal={handleSelectSeal}
        />
        <InverseMirrorControls
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
