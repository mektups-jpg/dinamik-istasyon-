import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { ParabolaControls } from './ParabolaControls';
import { ParabolaScene } from './ParabolaScene';
import { DragTarget, ParabolaParams, GraphPoint } from './types';
import { initialParams, isTargetMatched, parabolaTargets, svgToGraph, updateWidthFromPoint } from './parabolaModel';

const MODULE_ID = 'parabola-shape-studio';

const ATOM_IDS = parabolaTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'reference-bowl',
    title: 'Referans Kasesi',
    atomId: 'MAT.10.2.2.1',
    prompt: 'Parabolü f(x)=x² referansına getir. Tepe orijinde, genişlik kolu standart kasede olmalı.',
  },
  {
    id: 'narrow-bowl',
    title: 'Kaseyi Daralt',
    atomId: 'MAT.10.2.2.2',
    prompt: 'Tepeyi sabit tut. Pembe genişlik kolunu yukarı çekerek parabolün inceldiğini gör.',
  },
  {
    id: 'wide-bowl',
    title: 'Kaseyi Genişlet',
    atomId: 'MAT.10.2.2.3',
    prompt: 'Genişlik kolunu aşağı indir. a küçüldükçe parabol daha yayvan açılır.',
  },
  {
    id: 'vertex-translation',
    title: 'Tepeyi Taşı',
    atomId: 'MAT.10.2.2.4',
    prompt: 'Mavi tepe düğümünü hedefe taşı. h ve k değişince bütün kase eksenlerde kayar.',
  },
];

export default function ParabolaShapeStudioApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [params, setParams] = useState<ParabolaParams>(initialParams);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = parabolaTargets[activeIndex];
  const missionOk = isTargetMatched(params, target.params);

  const resetPanel = () => {
    setParams(initialParams);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, nextTarget: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;

    if (dragTarget === 'vertex') {
      setParams((current) => ({ ...current, h: point.x, k: point.y }));
      return;
    }

    setParams((current) => updateWidthFromPoint(current, point));
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Parabol kasesi hedef holograma oturdu. Bir sonraki şekil katmanı açılıyor.',
      error: 'Parabol hedef hologramla çakışmadı. Tepe düğümünü veya genişlik kolunu yeniden ayarla.',
    });
  };

  return (
    <HighSchoolLabShell
      title="Parabol Şekil Stüdyosu"
      subtitle="MAT.10.2.2.x"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#040712] [background-image:radial-gradient(circle_at_18%_14%,rgba(125,211,252,0.20),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(244,114,182,0.14),transparent_30%),linear-gradient(180deg,#040712_0%,#08111f_56%,#03050d_100%)]"
      badges={[
        { label: 'Hedef', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ParabolaScene
          params={params}
          target={target}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <ParabolaControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          params={params}
          target={target}
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
