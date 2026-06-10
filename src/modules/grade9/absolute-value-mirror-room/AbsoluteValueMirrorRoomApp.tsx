import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { AbsoluteValueControls } from './AbsoluteValueControls';
import { AbsoluteValueScene } from './AbsoluteValueScene';
import {
  MODULE_ID,
  atomIds,
  buildMatches,
  getMissionStartBuild,
  mirrorMissions,
  nudgeVertex,
  svgToGraphX,
  toggleSlope,
} from './absoluteValueModel';
import { AbsoluteBuild } from './types';

const MISSIONS: MissionStep[] = mirrorMissions.map(({ id, title, atomId, prompt }) => ({ id, title, atomId, prompt }));

export default function AbsoluteValueMirrorRoomApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const [build, setBuild] = useState<AbsoluteBuild>(() => getMissionStartBuild(mirrorMissions[0]));
  const [draggingVertex, setDraggingVertex] = useState(false);
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mission = mirrorMissions[progress.activeIndex];
  const matched = buildMatches(build, mission.target);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(getMissionStartBuild(mission));
    setDraggingVertex(false);
    setLockedMissionId(null);
  }, [mission]);

  const resetPanel = () => {
    setBuild(getMissionStartBuild(mission));
    setDraggingVertex(false);
    setLockedMissionId(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const updateVertexFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    const svg = svgRef.current;
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, vertexX: svgToGraphX(transformed.x) }));
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingVertex(true);
    updateVertexFromPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!draggingVertex) return;
    updateVertexFromPointer(event);
  };

  const handlePointerUp = () => {
    if (draggingVertex) showMessage('Tepe noktası x ekseninde yeni yerine taşındı.', 'info');
    setDraggingVertex(false);
  };

  const alignToTarget = () => {
    setLockedMissionId(null);
    setBuild(mission.target);
    showMessage('Tepe noktası hedef düzene hizalandı; şimdi testi çalıştır.', 'info');
  };

  const handleVertexKeyDown = (event: KeyboardEvent<SVGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      alignToTarget();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setLockedMissionId(null);
      setBuild((current) => nudgeVertex(current, event.key === 'ArrowLeft' ? -1 : 1));
    }
  };

  const handleToggleFold = () => {
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, folded: !current.folded }));
    showMessage(build.folded ? 'Katlama kapandı; negatif kol altta kaldı.' : 'Negatif kol x eksenindeki aynadan yukarı katlandı.', 'info');
  };

  const handleToggleSlope = () => {
    setLockedMissionId(null);
    setBuild((current) => toggleSlope(current));
    showMessage(build.slope === 1 ? 'V kolları iki kat dikleşti.' : 'V kolları standart dikliğe döndü.', 'info');
  };

  const handleCheck = () => {
    if (matched) setLockedMissionId(mission.id);
    window.setTimeout(() => {
      progress.submitMission({
        ok: matched,
        success: mission.success,
        error: mission.error,
      });
    }, matched ? 260 : 0);
  };

  return (
    <Grade9LabShell
      title="Mutlak Değer Ayna Odası"
      subtitle={atomIds.join(' / ')}
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#030713] [background-image:radial-gradient(circle_at_16%_14%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(0,255,136,0.12),transparent_27%),radial-gradient(circle_at_46%_92%,rgba(251,191,36,0.10),transparent_34%),linear-gradient(180deg,#030713_0%,#071425_56%,#03050c_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
        { label: 'Tepe', value: `x=${build.vertexX}`, tone: matched ? 'green' : 'purple' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AbsoluteValueScene
          mission={mission}
          build={build}
          matched={matched}
          locked={locked}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onVertexKeyDown={handleVertexKeyDown}
          onToggleFold={handleToggleFold}
          onToggleSlope={handleToggleSlope}
        />
        <AbsoluteValueControls
          missionStep={progress.activeMission}
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          totalMissions={MISSIONS.length}
          matched={matched}
          locked={locked}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
