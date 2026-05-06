import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { PolygonWorkshopControls } from './PolygonWorkshopControls';
import { PolygonWorkshopScene } from './PolygonWorkshopScene';
import { PolygonDragTarget, PolygonWorkshopState } from './types';
import {
  clamp,
  initialPolygonWorkshopState,
  isPolygonMissionMatched,
  measurePolygonWorkshop,
  polygonTargets,
  progressToSides,
  railXToProgress,
  resetForMission,
  roundProgress,
} from './polygonWorkshopModel';

const MODULE_ID = 'polygon-diagonal-symmetry-workshop';

const ATOM_IDS = ['MAT.11.2.4.1', 'MAT.11.2.4.2', 'MAT.11.2.4.3'];

const MISSIONS: MissionStep[] = [
  {
    id: 'diagonal-counter',
    title: 'Köşegen Sayacı',
    atomId: 'MAT.11.2.4.1',
    prompt: 'Kenar sayısını 6 yap, köşegen lazerlerini sona taşı ve toplam 9 köşegeni kilitle.',
  },
  {
    id: 'exterior-walk',
    title: 'Dış Açı Yürüyüşü',
    atomId: 'MAT.11.2.4.2',
    prompt: 'Yürüyüş halkasını tamamla. Dış açı parçaları tam tur yaptığında 360° kilidini seç.',
  },
  {
    id: 'symmetry-mirror',
    title: 'Simetri Aynası',
    atomId: 'MAT.11.2.4.3',
    prompt: 'Aynayı altıgenin tüm eksenlerinden geçir ve toplam 6 simetri eksenini kilitle.',
  },
];

export default function PolygonDiagonalSymmetryWorkshopApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<PolygonWorkshopState>(initialPolygonWorkshopState);
  const [dragTarget, setDragTarget] = useState<PolygonDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeIndex = progress.activeIndex;
  const target = polygonTargets[activeIndex];
  const measure = measurePolygonWorkshop(state, activeIndex);
  const missionOk = isPolygonMissionMatched(state, activeIndex);

  const updateFromProgress = (nextTarget: PolygonDragTarget, nextProgress: number) => {
    const value = roundProgress(nextProgress);
    setState((current) => {
      if (nextTarget === 'vertex-dial') {
        return { ...current, sides: progressToSides(value), selectedAnswer: null };
      }
      if (nextTarget === 'diagonal-burst') {
        return { ...current, diagonalScan: value };
      }
      if (nextTarget === 'exterior-walker') {
        return { ...current, exteriorWalk: value };
      }
      return { ...current, symmetryScan: value };
    });
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: PolygonDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    updateFromProgress(nextTarget, railXToProgress(transformed.x));
  };

  const handlePointerDown = (nextTarget: PolygonDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (keyTarget: PolygonDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      if (keyTarget === 'vertex-dial') {
        setState((current) => ({ ...current, sides: 6, selectedAnswer: null }));
        return;
      }
      updateFromProgress(keyTarget, 1);
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.16 : 0.05;
    const signedDelta = event.key === 'ArrowRight' ? delta : -delta;
    const currentProgress = keyTarget === 'vertex-dial'
      ? (state.sides - 5) / 3
      : keyTarget === 'diagonal-burst'
        ? state.diagonalScan
        : keyTarget === 'exterior-walker'
          ? state.exteriorWalk
          : state.symmetryScan;
    updateFromProgress(keyTarget, clamp(currentProgress + signedDelta));
  };

  const resetPanel = () => {
    setState(resetForMission(activeIndex));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialPolygonWorkshopState);
    setDragTarget(null);
    progress.restart();
  };

  const getErrorMessage = () => {
    if (state.sides !== 6) {
      return 'Bu deney altıgen hedefiyle kalibre edildi. Kenar sayısını 6 yapmadan kilit doğru çalışmaz.';
    }
    if (state.selectedAnswer !== target.correctAnswer) {
      return `Seçilen kilit hedefi karşılamıyor. ${target.hint}`;
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

  const handleSelectAnswer = (answer: number) => {
    setState((current) => ({ ...current, selectedAnswer: answer }));
  };

  return (
    <HighSchoolLabShell
      title="Çokgen Köşegen ve Simetri Atölyesi"
      subtitle="MAT.11.2.4"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#050b12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(251,191,36,0.12),transparent_32%),linear-gradient(180deg,#050b12_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Kenar', value: `${state.sides}`, tone: state.sides === 6 ? 'green' : 'cyan' },
        { label: 'Kilit', value: measure.selectedLabel, tone: missionOk ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <PolygonWorkshopScene
          state={state}
          activeIndex={activeIndex}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          onSelectAnswer={handleSelectAnswer}
        />
        <PolygonWorkshopControls
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
