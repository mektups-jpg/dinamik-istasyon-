import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { CorrelationControls } from './CorrelationControls';
import { CorrelationScene } from './CorrelationScene';
import { ScatterDragTarget, ScatterPoint } from './types';
import {
  alignToTarget,
  initialScatterPoints,
  isScatterTargetMatched,
  measureScatter,
  movePoint,
  nudgePoint,
  prepareMissionStart,
  scatterTargets,
  svgToData,
  targetForPoint,
} from './correlationModel';

const MODULE_ID = 'correlation-scatter-radar';

const ATOM_IDS = ['MAT.11.3.1.1', 'MAT.11.3.1.2', 'MAT.11.3.1.3'];

const MISSIONS: MissionStep[] = [
  {
    id: 'place-points',
    title: 'Noktaları Yerleştir',
    atomId: 'MAT.11.3.1.1',
    prompt: 'Dört veri kapsülünü hedef halkalara taşı. Her çift serpilme grafiğinde tek bir noktaya dönüşsün.',
  },
  {
    id: 'positive-trend',
    title: 'Pozitif Eğilim',
    atomId: 'MAT.11.3.1.2',
    prompt: 'Nokta bulutunu artan düzene sok. Eğilim ışını sol alttan sağ üste yükselsin.',
  },
  {
    id: 'negative-trend',
    title: 'Negatif Eğilim',
    atomId: 'MAT.11.3.1.3',
    prompt: 'Nokta bulutunu azalan düzene çevir. Eğilim ışını sol üstten sağ alta insin.',
  },
];

export default function CorrelationScatterRadarApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [points, setPoints] = useState<ScatterPoint[]>(initialScatterPoints);
  const [dragTarget, setDragTarget] = useState<ScatterDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = scatterTargets[activeIndex];
  const measure = measureScatter(points, target);
  const missionOk = isScatterTargetMatched(points, target);

  const resetPanel = () => {
    setPoints(prepareMissionStart(target));
    setDragTarget(null);
  };

  const restart = () => {
    setPoints(initialScatterPoints);
    setDragTarget(null);
    progress.restart();
  };

  const updatePointFromPointer = (event: ReactPointerEvent<SVGElement>, pointId: ScatterDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !pointId) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setPoints((current) => movePoint(current, pointId, svgToData(transformed.x, transformed.y)));
  };

  const handlePointerDown = (pointId: string, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(pointId);
    updatePointFromPointer(event, pointId);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    updatePointFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleKeyDown = (pointId: string, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setPoints(alignToTarget(target));
      return;
    }

    const step = event.shiftKey ? 0.6 : 0.2;
    const deltas: Record<string, { dx: number; dy: number }> = {
      ArrowLeft: { dx: -step, dy: 0 },
      ArrowRight: { dx: step, dy: 0 },
      ArrowUp: { dx: 0, dy: step },
      ArrowDown: { dx: 0, dy: -step },
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    setPoints((current) => nudgePoint(current, pointId, delta.dx, delta.dy));
  };

  const prepareNextMission = () => {
    const nextTarget = scatterTargets[activeIndex + 1];
    if (!nextTarget) return;
    setPoints(prepareMissionStart(nextTarget));
    setDragTarget(null);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: activeIndex === 0 ? 'Veri çiftleri grafiğe oturdu. Şimdi bulutun yönünü oku.' : 'Eğilim ışını doğru ilişki yönüne kilitlendi.',
      error: `Radar hedefte değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      prepareNextMission();
    }
  };

  const activeTargetPoint = targetForPoint(target, dragTarget ?? 'a');

  return (
    <HighSchoolLabShell
      title="Korelasyon Serpilme Radarı"
      subtitle="MAT.11.3.1"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06131f] [background-image:radial-gradient(circle_at_18%_14%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(52,211,153,0.13),transparent_32%),linear-gradient(180deg,#06131f_0%,#0b1c2a_56%,#02070d_100%)]"
      badges={[
        { label: 'Yön', value: measure.direction, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Hedef', value: `${activeTargetPoint.x},${activeTargetPoint.y}`, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <CorrelationScene
          points={points}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <CorrelationControls
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
