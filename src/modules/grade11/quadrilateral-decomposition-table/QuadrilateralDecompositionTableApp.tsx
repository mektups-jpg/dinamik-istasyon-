import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { QuadrilateralControls } from './QuadrilateralControls';
import { QuadrilateralScene } from './QuadrilateralScene';
import { QuadDragTarget, QuadrilateralState } from './types';
import {
  clamp,
  formatAreaSumWithUnit,
  initialQuadrilateralState,
  isTargetMatched,
  measureQuadrilateral,
  quadFrame,
  quadTargets,
  railXToProgress,
  roundProgress,
} from './quadrilateralModel';

const MODULE_ID = 'quadrilateral-decomposition-table';

const ATOM_IDS = ['MAT.11.2.1.1', 'MAT.11.2.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'angle-split',
    title: '360° Kesimi',
    atomId: 'MAT.11.2.1.1',
    prompt: 'Köşegen bıçağını sonuna kadar çek. Dörtgen iki üçgene ayrılıp 180° + 180° düzenini göstersin.',
  },
  {
    id: 'area-merge',
    title: 'Alan Birleştirme',
    atomId: 'MAT.11.2.1.2',
    prompt: 'Kesim açıkken alan birleştiriciyi toplam haznesine taşı. İki üçgen alanı dörtgen alanına kilitlensin.',
  },
];

export default function QuadrilateralDecompositionTableApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<QuadrilateralState>(initialQuadrilateralState);
  const [dragTarget, setDragTarget] = useState<QuadDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = quadTargets[activeIndex];
  const measure = measureQuadrilateral(state);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(activeIndex === 0 ? initialQuadrilateralState : { cutProgress: 1, mergeProgress: 0 });
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialQuadrilateralState);
    setDragTarget(null);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: QuadDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());

    if (nextTarget === 'blade') {
      setState((current) => ({
        ...current,
        cutProgress: railXToProgress(transformed.x, quadFrame.bladeRailX, quadFrame.bladeRailWidth),
      }));
      return;
    }

    setState((current) => ({
      ...current,
      mergeProgress: railXToProgress(transformed.x, quadFrame.areaRailX, quadFrame.areaRailWidth),
    }));
  };

  const handlePointerDown = (nextTarget: QuadDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (keyTarget: QuadDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({
        ...current,
        [keyTarget === 'blade' ? 'cutProgress' : 'mergeProgress']: 1,
      }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.12 : 0.04;
    const signedDelta = event.key === 'ArrowRight' ? delta : -delta;
    setState((current) => ({
      ...current,
      [keyTarget === 'blade' ? 'cutProgress' : 'mergeProgress']: roundProgress(clamp((keyTarget === 'blade' ? current.cutProgress : current.mergeProgress) + signedDelta)),
    }));
  };

  const prepareNextMission = () => {
    setState({ cutProgress: 1, mergeProgress: 0.08 });
    setDragTarget(null);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Dörtgen iki üçgen parçasına ayrıldı. Şimdi alan birleşimini kilitle.',
      error: `Ayrıştırma masası hedefte değil. ${target.hint}`,
    });

    if (accepted && activeIndex === 0) {
      prepareNextMission();
    }
  };

  return (
    <HighSchoolLabShell
      title="Dörtgen Ayrıştırma Masası"
      subtitle="MAT.11.2.1"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#071118] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.14),transparent_32%),linear-gradient(180deg,#071118_0%,#0d1b2a_56%,#03070d_100%)]"
      badges={[
        { label: 'Kesim', value: `%${Math.round(measure.cutProgress * 100)}`, tone: missionOk ? 'green' : 'amber' },
        { label: 'Alan', value: formatAreaSumWithUnit(measure.triangleOneArea, measure.triangleTwoArea), tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <QuadrilateralScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <QuadrilateralControls
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
