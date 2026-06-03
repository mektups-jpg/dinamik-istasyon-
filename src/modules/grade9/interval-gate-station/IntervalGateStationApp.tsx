import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { IntervalControls } from './IntervalControls';
import { IntervalScene } from './IntervalScene';
import { buildMatches, initialBuild, intervalLabel, intervalMissions, updateEndpoint, xToValue, toggleGate } from './intervalModel';
import { GateSide, IntervalBuild } from './types';

const MODULE_ID = 'interval-gate-station';
const ATOM_IDS = intervalMissions.map((mission) => mission.atomId);
const MISSIONS: MissionStep[] = intervalMissions.map(({ id, title, atomId, prompt }) => ({ id, title, atomId, prompt }));

export default function IntervalGateStationApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [build, setBuild] = useState<IntervalBuild>(initialBuild);
  const [dragSide, setDragSide] = useState<GateSide | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const mission = intervalMissions[activeIndex];
  const matched = buildMatches(build, mission.target);

  useEffect(() => {
    setBuild(initialBuild);
    setDragSide(null);
  }, [activeIndex]);

  const resetPanel = () => {
    setBuild(initialBuild);
    setDragSide(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, side: GateSide) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragSide(side);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragSide) return;
    const nextValue = getValueFromPointer(event, svgRef.current);
    if (nextValue === null) return;
    setBuild((current) => updateEndpoint(current, dragSide, nextValue));
  };

  const handlePointerUp = () => {
    setDragSide(null);
  };

  const handleToggleGate = (side: GateSide) => {
    setBuild((current) => toggleGate(current, side));
  };

  const handleAutoAlign = () => {
    setBuild(mission.target);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: matched,
      success: 'Kapı mantığı doğru kuruldu. Sıradaki aralık görevi açılıyor.',
      error: mission.kind === 'intersection'
        ? 'Kesişimde yalnız iki aralığın ortak yandığı bölge kalmalı.'
        : mission.kind === 'union'
          ? 'Birleşimde iki aralıktan en az birinin kapsadığı bütün ışık yolu alınmalı.'
          : 'Kapı konumu veya açık-kapalı uçlardan biri hedef aralıkla uyuşmuyor.',
    });
  };

  return (
    <Grade9LabShell
      title="Aralık Kapıları İstasyonu"
      subtitle="MAT.9.1.3.1-4"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl overflow-x-hidden px-3 py-4 sm:px-4"
      frameClassName="bg-[#030711] [background-image:radial-gradient(circle_at_18%_18%,rgba(0,229,255,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(0,255,136,0.11),transparent_26%),linear-gradient(180deg,#030711_0%,#071324_56%,#040711_100%)]"
      badges={[
        { label: 'Durum', value: 'Vitrin hazır', tone: 'green' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
        { label: 'Aralık', value: intervalLabel(build), tone: matched ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <IntervalScene
          mission={mission}
          build={build}
          matched={matched}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onToggleGate={handleToggleGate}
          onAutoAlign={handleAutoAlign}
        />
        <IntervalControls
          mission={mission}
          build={build}
          matched={matched}
          activeIndex={activeIndex}
          totalMissions={MISSIONS.length}
          onToggleGate={handleToggleGate}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

function getValueFromPointer(event: ReactPointerEvent<SVGElement>, svg: SVGSVGElement | null): number | null {
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const transformed = point.matrixTransform(matrix.inverse());
  return xToValue(transformed.x);
}
