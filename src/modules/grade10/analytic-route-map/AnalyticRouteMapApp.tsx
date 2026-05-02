import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { AnalyticRouteControls } from './AnalyticRouteControls';
import { AnalyticRouteScene } from './AnalyticRouteScene';
import { GraphPoint, RouteDragTarget, RouteState } from './types';
import { clamp, graphBounds, initialRoute, isTargetMatched, measureRoute, projectToRoute, routeTargets, svgToGraph } from './routeModel';

const MODULE_ID = 'analytic-route-map';

const ATOM_IDS = routeTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'distance',
    title: 'Mesafe Kablosu',
    atomId: 'MAT.10.5.1.1',
    prompt: 'A ve B istasyonlarını hedef halkalara taşı. 3-4-5 rota üçgeni mesafeyi görünür yapar.',
  },
  {
    id: 'slope',
    title: 'Eğim Oku',
    atomId: 'MAT.10.5.2.1',
    prompt: 'Rotayı m=1/2 hedefine ayarla. Dikey değişimi yatay değişime bölerek eğimi oku.',
  },
  {
    id: 'equation',
    title: 'Denklem Işını',
    atomId: 'MAT.10.5.2.2',
    prompt: 'A noktasını ve eğimi hedefe getir. Nokta-eğim denklemi rotanın yanında oluşur.',
  },
  {
    id: 'division',
    title: 'Transfer İstasyonu',
    atomId: 'MAT.10.5.1.2',
    prompt: 'A ve B hedefteyken mor P düğümünü AP:PB = 1:3 olacak konuma kaydır.',
  },
];

export default function AnalyticRouteMapApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [route, setRoute] = useState<RouteState>(initialRoute);
  const [dragTarget, setDragTarget] = useState<RouteDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = routeTargets[activeIndex];
  const measure = measureRoute(route);
  const missionOk = isTargetMatched(route, target);

  const resetPanel = () => {
    setRoute(initialRoute);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, nextTarget: RouteDragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;
    setRoute((current) => updateRoute(current, dragTarget, point));
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const stepTarget = (routeTarget: RouteDragTarget, dx: number, dy: number) => {
    setRoute((current) => {
      if (routeTarget === 'transfer') return { ...current, transferT: clamp(current.transferT + dx, 0, 1) };
      const point = current[routeTarget];
      return {
        ...current,
        [routeTarget]: {
          x: clamp(point.x + dx, graphBounds.minX, graphBounds.maxX),
          y: clamp(point.y + dy, graphBounds.minY, graphBounds.maxY),
        },
      };
    });
  };

  const snapTargetHome = (routeTarget: RouteDragTarget) => {
    setRoute((current) => {
      if (routeTarget === 'transfer') return { ...current, transferT: target.transferT ?? current.transferT };
      return { ...current, [routeTarget]: target[routeTarget] };
    });
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Analitik rota hedef imzaya kilitlendi. Bir sonraki ölçüm katmanı açılıyor.',
      error: `Rota henüz hedefte değil. ${target.hint}`,
    });
  };

  return (
    <HighSchoolLabShell
      title="Analitik Rota Haritası"
      subtitle="MAT.10.5.x"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#031015] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(52,211,153,0.14),transparent_30%),linear-gradient(180deg,#031015_0%,#071a22_56%,#03070d_100%)]"
      badges={[
        { label: 'Hedef', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AnalyticRouteScene
          state={route}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyStep={stepTarget}
          onHome={snapTargetHome}
        />
        <AnalyticRouteControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          state={route}
          measure={measure}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}

function getGraphPoint(event: ReactPointerEvent<SVGElement>, svg: SVGSVGElement | null): GraphPoint | null {
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const transformed = point.matrixTransform(matrix.inverse());
  return svgToGraph({ x: transformed.x, y: transformed.y });
}

function updateRoute(current: RouteState, target: RouteDragTarget, point: GraphPoint): RouteState {
  if (target === 'transfer') return { ...current, transferT: projectToRoute(current, point) };
  return { ...current, [target]: point };
}
