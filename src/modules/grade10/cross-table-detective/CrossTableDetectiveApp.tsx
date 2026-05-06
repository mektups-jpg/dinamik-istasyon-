import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { CrossTableControls } from './CrossTableControls';
import { CrossTableScene } from './CrossTableScene';
import { CrossTableState } from './types';
import {
  clamp,
  crossTableTargets,
  initialCrossTableState,
  isCrossTableMissionMatched,
  measureCrossTable,
  progressFromX,
  resetForCrossTableMission,
  roundProgress,
} from './crossTableModel';

const MODULE_ID = 'cross-table-detective';

const ATOM_IDS = ['MAT.10.6.1.1', 'MAT.10.6.1.2', 'MAT.10.6.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'cell',
    title: 'Kategori Hücresi',
    atomId: 'MAT.10.6.1.1',
    prompt: 'Planlı çalışma satırı ile yükseldi sütununun kesiştiği 28 hücresini tara.',
  },
  {
    id: 'deviation',
    title: 'Sapma Sinyali',
    atomId: 'MAT.10.6.1.2',
    prompt: 'Gözlenen 28 ile beklenen 19 arasındaki +9 sapma sinyalini kilitle.',
  },
  {
    id: 'media',
    title: 'Medya Denetimi',
    atomId: 'MAT.10.6.2.1',
    prompt: 'Medya iddiasını yanlılık bayrağı ve güvenli rapor mührüyle denetle.',
  },
];

export default function CrossTableDetectiveApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<CrossTableState>(initialCrossTableState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = crossTableTargets[activeIndex];
  const measure = measureCrossTable(state, target);
  const missionOk = isCrossTableMissionMatched(state, target);

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
    setState(resetForCrossTableMission(activeIndex));
    setDragging(false);
  };

  const restart = () => {
    setState(initialCrossTableState);
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
      setState(resetForCrossTableMission(activeIndex + 1));
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Çapraz Tablo Dedektifi"
      subtitle="MAT.10.6"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Kanıt', value: target.shortLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Tablo', value: '2x2', tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <CrossTableScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectChoice={(choice) => setState((current) => ({ ...current, selectedChoice: choice }))}
          onToggleBias={() => setState((current) => ({ ...current, railProgress: crossTableTargets[2].targetProgress, biasFlagged: !current.biasFlagged, selectedChoice: 'bias' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: crossTableTargets[2].targetProgress, reportSealed: !current.reportSealed, selectedChoice: 'seal' }))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <CrossTableControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          state={state}
          missionOk={missionOk}
          onSelectChoice={(choice) => setState((current) => ({ ...current, selectedChoice: choice }))}
          onToggleBias={() => setState((current) => ({ ...current, railProgress: crossTableTargets[2].targetProgress, biasFlagged: !current.biasFlagged, selectedChoice: 'bias' }))}
          onToggleSeal={() => setState((current) => ({ ...current, railProgress: crossTableTargets[2].targetProgress, reportSealed: !current.reportSealed, selectedChoice: 'seal' }))}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
