import { useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { ForensicsControls } from './ForensicsControls';
import { ForensicsScene } from './ForensicsScene';
import { AxisChoice, DragTarget, GraphPoint } from './types';
import {
  angleDelta,
  angleFromGraphPoint,
  distance,
  formatPoint,
  initialAngle,
  initialAxis,
  initialCenter,
  svgToGraph,
  targetAngle,
  targetAxis,
  targetCenter,
} from './forensicsModel';

const MODULE_ID = 'transformation-forensics';

const ATOM_IDS = ['MAT.9.5.1.1', 'MAT.9.5.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'rotation-center',
    title: 'Döndürme Merkezi',
    atomId: 'MAT.9.5.1.1',
    prompt: 'Sarı merkezi sürükle. Hayalet şekil, döndürme merkezi orijindeyken hedef izle çakışır.',
  },
  {
    id: 'rotation-angle',
    title: 'Açı İmzası',
    atomId: 'MAT.9.5.1.1',
    prompt: 'Mor açı kolunu çevir. Bu iz saat yönünün tersine 90° döndürme ile kilitlenir.',
  },
  {
    id: 'reflection-axis',
    title: 'Ayna Ekseni',
    atomId: 'MAT.9.5.1.2',
    prompt: 'Sahnedeki ayna çizgilerinden birini seç. Doğru eksen, yansıyan hayaleti hedef izin üstüne getirir.',
  },
];

export default function TransformationForensicsApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [center, setCenter] = useState<GraphPoint>(initialCenter);
  const [angle, setAngle] = useState(initialAngle);
  const [axis, setAxis] = useState<AxisChoice>(initialAxis);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const missionOk = getMissionOk(activeIndex, center, angle, axis);

  const resetPanel = () => {
    setCenter(activeIndex === 0 ? initialCenter : targetCenter);
    setAngle(activeIndex <= 1 ? initialAngle : targetAngle);
    setAxis(initialAxis);
    setDragTarget(null);
  };

  const restart = () => {
    setCenter(initialCenter);
    setAngle(initialAngle);
    setAxis(initialAxis);
    setDragTarget(null);
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, nextTarget: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
  };

  const handleSurfacePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (activeIndex === 2) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    if (activeIndex === 0) {
      setCenter(point);
      setDragTarget('center');
      return;
    }

    setAngle(angleFromGraphPoint(point));
    setDragTarget('angle');
  };

  const handleSurfaceClick = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (activeIndex === 2) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;

    if (activeIndex === 0) {
      setCenter(point);
      return;
    }

    setAngle(angleFromGraphPoint(point));
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;

    if (dragTarget === 'center') {
      setCenter(point);
      return;
    }

    setAngle(angleFromGraphPoint(point));
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Adli iz doğru çakıştı. Bir sonraki dönüşüm katmanı açılıyor.',
      error: 'Hayalet şekil hedef iz ile çakışmadı. Merkez, açı veya ekseni sahneden yeniden ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Dönüşüm Adli Bilişimi"
      subtitle="MAT.9.5.1.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#05060d] [background-image:radial-gradient(circle_at_16%_14%,rgba(125,92,255,0.18),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(0,229,255,0.10),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(255,255,255,0.06),transparent_36%),linear-gradient(180deg,#05060d_0%,#0b0c14_56%,#04050a_100%)]"
      badges={[
        { label: 'Merkez', value: activeIndex === 0 ? formatPoint(center) : 'orijin', tone: missionOk ? 'green' : 'purple' },
        { label: 'Açı', value: `${activeIndex === 0 ? targetAngle : Math.round(angle)}°`, tone: 'amber' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-5 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ForensicsScene
          activeIndex={activeIndex}
          center={center}
          angle={angle}
          axis={axis}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onSurfacePointerDown={handleSurfacePointerDown}
          onSurfaceClick={handleSurfaceClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onCenterTargetSelect={() => setCenter(targetCenter)}
          onAngleTargetSelect={() => setAngle(targetAngle)}
          onAxisSelect={setAxis}
        />
        <ForensicsControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          center={center}
          angle={angle}
          axis={axis}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

function getMissionOk(activeIndex: number, center: GraphPoint, angle: number, axis: AxisChoice) {
  if (activeIndex === 0) return distance(center, targetCenter) <= 0.28;
  if (activeIndex === 1) return angleDelta(angle, targetAngle) <= 8;
  return axis === targetAxis;
}

function getGraphPoint(event: { clientX: number; clientY: number }, svg: SVGSVGElement | null): GraphPoint | null {
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const transformed = point.matrixTransform(matrix.inverse());
  return svgToGraph({ x: transformed.x, y: transformed.y });
}
