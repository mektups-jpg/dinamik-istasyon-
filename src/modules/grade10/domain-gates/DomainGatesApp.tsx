import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { DomainGatesControls } from './DomainGatesControls';
import { DomainGatesScene } from './DomainGatesScene';
import { DomainParams, DragTarget, GraphPoint } from './types';
import { domainTargets, getXValue, initialParams, isTargetMatched, setXValue, svgToGraph } from './domainModel';

const MODULE_ID = 'domain-gates';

const ATOM_IDS = domainTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'root-reference',
    title: 'Karekök Başlangıcı',
    atomId: 'MAT.10.2.3.1',
    prompt: '√x eğrisinin başladığı noktayı bul. Başlangıç düğümü x=0 çizgisinde olmalı.',
  },
  {
    id: 'root-safe-zone',
    title: 'Güvenli Bölge',
    atomId: 'MAT.10.2.3.2',
    prompt: 'Karekök için sol taraf yasak. Güvenlik kapısını x=0 çizgisine kilitle.',
  },
  {
    id: 'rational-asymptote',
    title: 'Asimptot Duvarı',
    atomId: 'MAT.10.2.4.1',
    prompt: '1/x grafiğinin yaklaşacağı dikey duvarı y eksenine hizala.',
  },
  {
    id: 'zero-denominator',
    title: 'Sıfır Payda Alarmı',
    atomId: 'MAT.10.2.4.2',
    prompt: 'Paydayı sıfır yapan noktayı işaretle. Rasyonel grafik x=0 noktasını atlamalı.',
  },
];

export default function DomainGatesApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [params, setParams] = useState<DomainParams>(initialParams);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = domainTargets[activeIndex];
  const missionOk = isTargetMatched(params, target);

  const resetPanel = () => {
    setParams(initialParams);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const snapActiveTarget = () => {
    setParams((current) => setXValue(current, target.dragTarget, target.targetX));
    setDragTarget(null);
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, nextTarget: DragTarget) => {
    if (event.detail >= 2 && nextTarget === target.dragTarget) {
      event.preventDefault();
      snapActiveTarget();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;
    setParams((current) => setXValue(current, dragTarget, point.x));
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleKeyboardStep = (nextTarget: DragTarget, delta: number) => {
    setParams((current) => setXValue(current, nextTarget, getXValue(current, nextTarget) + delta));
  };

  const handleKeyboardSnap = (nextTarget: DragTarget) => {
    setParams((current) => setXValue(current, nextTarget, target.targetX));
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Kapı doğru çizgiye kilitlendi. Bir sonraki tanım bölgesi açılıyor.',
      error: 'Kapı x=0 hedef çizgisinde değil. Kolu sarı hedef çizgiye hizala.',
    });
  };

  return (
    <HighSchoolLabShell
      title="Tanım Kümesi Kapıları"
      subtitle="MAT.10.2.3.x / MAT.10.2.4.x"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#031015] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(251,113,133,0.14),transparent_30%),linear-gradient(180deg,#031015_0%,#071923_56%,#03070d_100%)]"
      badges={[
        { label: 'Hedef', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <DomainGatesScene
          params={params}
          target={target}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onSnapTarget={snapActiveTarget}
          onKeyboardStep={handleKeyboardStep}
          onKeyboardSnap={handleKeyboardSnap}
        />
        <DomainGatesControls
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
