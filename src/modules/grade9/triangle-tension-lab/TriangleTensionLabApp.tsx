import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { TriangleControls } from './TriangleControls';
import { TriangleScene } from './TriangleScene';
import { DragTarget, Point, TokenPositions, TrianglePoints, VertexKey } from './types';
import { clamp, initialPoints, initialTokenPositions, isInsideProofRail, sideName, useTriangleMeasurements } from './triangleGeometry';

const MODULE_ID = 'triangle-tension-lab';

const ATOM_IDS = ['MAT.9.4.1.1', 'MAT.9.4.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'angle-side',
    title: 'Açı-Kenar Gerilimi',
    atomId: 'MAT.9.4.1.1',
    prompt: 'C köşesini sağa çek. A açısı büyüdükçe karşısındaki BC kenarının en uzun ip olduğunu canlı gör.',
  },
  {
    id: 'angle-sum',
    title: '180 Derece İspat Rayı',
    atomId: 'MAT.9.4.1.2',
    prompt: 'A, B ve C açı parçalarını ispat rayına sürükle. Üç parça birleşince iç açı toplamı 180° olur.',
  },
];

export default function TriangleTensionLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [points, setPoints] = useState<TrianglePoints>(initialPoints);
  const [tokens, setTokens] = useState<TokenPositions>(initialTokenPositions);
  const [placedOrder, setPlacedOrder] = useState<VertexKey[]>([]);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const measurements = useTriangleMeasurements(points);
  const missionOneOk = measurements.largestAngle === 'A' && measurements.longestSide === 'a' && measurements.angles.A >= 80;
  const missionTwoOk = placedOrder.length === 3;

  const resetPanel = () => {
    setPoints(initialPoints);
    setTokens(initialTokenPositions);
    setPlacedOrder([]);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(target);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const nextPoint = getSvgPoint(event, svgRef.current);
    if (!nextPoint) return;

    if (dragTarget.kind === 'vertex') {
      setPoints((current) => ({ ...current, [dragTarget.key]: nextPoint }));
      return;
    }

    if (!placedOrder.includes(dragTarget.key)) {
      setTokens((current) => ({ ...current, [dragTarget.key]: nextPoint }));
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const dropPoint = getSvgPoint(event, svgRef.current);

    if (dragTarget.kind === 'token' && dropPoint && isInsideProofRail(dropPoint) && !placedOrder.includes(dragTarget.key)) {
      setPlacedOrder((current) => [...current, dragTarget.key]);
    }

    if (dragTarget.kind === 'token' && !placedOrder.includes(dragTarget.key)) {
      setTokens((current) => ({ ...current, [dragTarget.key]: initialTokenPositions[dragTarget.key] }));
    }

    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: activeIndex === 0 ? missionOneOk : missionTwoOk,
      success: 'Üçgen ilişkisi doğru okundu. Şimdi açı parçalarını 180° rayında birleştir.',
      error: activeIndex === 0
        ? 'En büyük açı ile en uzun karşı kenar henüz eşleşmedi.'
        : 'Açı parçaları 180° rayını tamamlamadı.',
    });
  };

  return (
    <Grade9LabShell
      title="Üçgen Gerilim Laboratuvarı"
      subtitle="MAT.9.4.1.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#04110f] [background-image:radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(251,191,36,0.13),transparent_26%),linear-gradient(180deg,#04110f_0%,#071a16_58%,#030706_100%)]"
      badges={[
        { label: 'En Büyük Açı', value: `${measurements.largestAngle} ${Math.round(measurements.angles[measurements.largestAngle])}°`, tone: 'amber' },
        { label: 'En Uzun Kenar', value: sideName(measurements.longestSide), tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <TriangleScene
          activeIndex={activeIndex}
          points={points}
          tokens={tokens}
          placedOrder={placedOrder}
          measurements={measurements}
          missionOneOk={missionOneOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <TriangleControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          measurements={measurements}
          placedOrder={placedOrder}
          missionOneOk={missionOneOk}
          missionTwoOk={missionTwoOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

function getSvgPoint(event: ReactPointerEvent<SVGElement>, svg: SVGSVGElement | null): Point | null {
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const transformed = point.matrixTransform(matrix.inverse());
  return {
    x: clamp(transformed.x, 78, 642),
    y: clamp(transformed.y, 92, 430),
  };
}
