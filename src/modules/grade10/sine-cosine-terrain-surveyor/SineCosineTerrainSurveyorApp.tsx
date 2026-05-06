import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { TerrainSurveyorControls } from './TerrainSurveyorControls';
import { TerrainSurveyorScene } from './TerrainSurveyorScene';
import { TerrainState } from './types';
import {
  clamp,
  initialTerrainState,
  isTerrainMissionMatched,
  measureTerrain,
  progressFromSurveyPoint,
  resetForTerrainMission,
  roundProgress,
  terrainTargets,
} from './terrainSurveyorModel';

const MODULE_ID = 'sine-cosine-terrain-surveyor';

const ATOM_IDS = ['MAT.10.4.4.1', 'MAT.10.4.4.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'cosine-distance',
    title: 'Kosinüs Mesafe Kablosu',
    atomId: 'MAT.10.4.4.1',
    prompt: 'Kosinüs kilidini seç, C istasyonunu hedef açıya getir ve eksik BC kenarını ölç.',
  },
  {
    id: 'sine-angle',
    title: 'Sinüs Açı Vizörü',
    atomId: 'MAT.10.4.4.2',
    prompt: 'Sinüs kilidini seç, B açı vizörünü hedefe getir ve bilinmeyen açıyı bul.',
  },
  {
    id: 'terrain-report',
    title: 'Arazi Raporu',
    atomId: 'MAT.10.4.4.2',
    prompt: 'Rapor kilidini seç ve teorem seçim kuralını mühürle.',
  },
];

export default function SineCosineTerrainSurveyorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<TerrainState>(initialTerrainState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = terrainTargets[activeIndex];
  const measure = measureTerrain(state, target);
  const missionOk = isTerrainMissionMatched(state, target);

  useEffect(() => {
    if (!progress.completed) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [progress.completed]);

  const updateProgress = (nextProgress: number) => {
    setState((current) => ({ ...current, cursorProgress: roundProgress(nextProgress) }));
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateProgress(progressFromSurveyPoint(target.lock, { x: transformed.x, y: transformed.y }));
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
    updateProgress(clamp(state.cursorProgress + (event.key === 'ArrowRight' ? delta : -delta)));
  };

  const resetPanel = () => {
    setState(resetForTerrainMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialTerrainState);
    setDragging(false);
    progress.restart();
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: state.selectedLock === target.lock ? target.hint : `Bu görevde ${target.shortLabel} için doğru teorem kilidini seçmelisin.`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(resetForTerrainMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Sinüs-Kosinüs Arazi Ölçeri"
      subtitle="MAT.10.4.4"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(167,139,250,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Teorem', value: target.lock === 'cosine' ? 'Kosinüs' : target.lock === 'sine' ? 'Sinüs' : 'Rapor', tone: missionOk ? 'green' : 'cyan' },
        { label: 'Sonuç', value: measure.resultLabel, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <TerrainSurveyorScene
          state={state}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <TerrainSurveyorControls
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
