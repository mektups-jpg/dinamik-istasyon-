import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { MosaicControls } from './MosaicControls';
import { MosaicScene } from './MosaicScene';
import { MosaicDragTarget, MosaicSeal, MosaicWorkshopState } from './types';
import {
  clamp,
  initialMosaicState,
  isMosaicMissionMatched,
  measureMosaic,
  mosaicTargets,
  railXToProgress,
  resetForMission,
  roundProgress,
} from './mosaicModel';

const MODULE_ID = 'mosaic-tiling-workshop';

const ATOM_IDS = ['MAT.11.2.5.1', 'MAT.11.2.5.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'gapless-mosaic',
    title: 'Mozaik Kilidi',
    atomId: 'MAT.11.2.5.1',
    prompt: 'Altıgen fayansı yuvaya taşı. Boşluk alarmı sönünce Boşluksuz mührünü seç.',
  },
  {
    id: 'angle-ring',
    title: 'Açı Halkası',
    atomId: 'MAT.11.2.5.1',
    prompt: 'Üçgen parçaları köşeye yaklaştır ve kadranı çevir. Halka 360° olunca 360° mührünü seç.',
  },
  {
    id: 'tile-alignment',
    title: 'Fayans Hizası',
    atomId: 'MAT.11.2.5.2',
    prompt: 'Hizalama rayını sona taşı. Desen çakışınca Hizalı mührünü seç.',
  },
];

export default function MosaicTilingWorkshopApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<MosaicWorkshopState>(initialMosaicState);
  const [dragTarget, setDragTarget] = useState<MosaicDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = mosaicTargets[activeIndex];
  const measure = measureMosaic(state, activeIndex);
  const missionOk = isMosaicMissionMatched(state, activeIndex);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateFromProgress = (nextTarget: MosaicDragTarget, nextProgress: number) => {
    const value = roundProgress(nextProgress);
    setState((current) => {
      if (nextTarget === 'hexagon-tile') {
        return { ...current, hexagonFit: value, selectedSeal: null };
      }
      if (nextTarget === 'triangle-tile') {
        return { ...current, triangleFit: value, selectedSeal: null };
      }
      return { ...current, rotationDial: value, selectedSeal: null };
    });
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: MosaicDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateFromProgress(nextTarget, railXToProgress(transformed.x));
  };

  const handlePointerDown = (nextTarget: MosaicDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const getProgressForTarget = (keyTarget: MosaicDragTarget) => {
    if (keyTarget === 'hexagon-tile') return state.hexagonFit;
    if (keyTarget === 'triangle-tile') return state.triangleFit;
    return state.rotationDial;
  };

  const handleKeyDown = (keyTarget: MosaicDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      updateFromProgress(keyTarget, 1);
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.16 : 0.05;
    const signedDelta = event.key === 'ArrowRight' ? delta : -delta;
    updateFromProgress(keyTarget, clamp(getProgressForTarget(keyTarget) + signedDelta));
  };

  const resetPanel = () => {
    setState(resetForMission(activeIndex));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialMosaicState);
    setDragTarget(null);
    progress.restart();
  };

  const getErrorMessage = () => {
    if (state.selectedSeal !== target.correctSeal) {
      return `Yanlış mühür seçildi. ${target.hint}`;
    }
    return target.hint;
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: getErrorMessage(),
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForMission(activeIndex + 1));
      setDragTarget(null);
    }
  };

  const handleSelectSeal = (seal: MosaicSeal) => {
    setState((current) => ({ ...current, selectedSeal: seal }));
  };

  return (
    <HighSchoolLabShell
      title="Mozaik Kaplama Atölyesi"
      subtitle="MAT.11.2.5"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.12),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Alarm', value: measure.alarmLabel, tone: missionOk ? 'green' : 'amber' },
        { label: 'Mühür', value: measure.selectedLabel, tone: missionOk ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <MosaicScene
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
        <MosaicControls
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
