import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { RootHunterControls } from './RootHunterControls';
import { RootHunterScene } from './RootHunterScene';
import { RootMarkerId } from './types';
import {
  angleFromX,
  clamp,
  initialRootHunterState,
  isTargetMatched,
  measureRootHunter,
  prepareRootMission,
  rootHunterTargets,
  snapAngle,
} from './rootHunterModel';

const MODULE_ID = 'trigonometric-root-hunter';

const ATOM_IDS = ['MAT.11.1.2.1', 'MAT.11.1.2.2', 'MAT.11.1.2.3', 'MAT.11.1.2.4'];

const MISSIONS: MissionStep[] = [
  {
    id: 'sin-roots',
    title: 'Sinüs Kökleri',
    atomId: 'MAT.11.1.2.1',
    prompt: 'İki kök işaretçisini sinüs dalgasının 1/2 hedef ışınını kestiği açılara taşı.',
  },
  {
    id: 'cos-roots',
    title: 'Kosinüs Kökleri',
    atomId: 'MAT.11.1.2.2',
    prompt: 'Kosinüs dalgasında -1/2 hedef ışınını yakala. İki kesişim açısını kilitle.',
  },
  {
    id: 'tan-roots',
    title: 'Tanjant Kökleri',
    atomId: 'MAT.11.1.2.3',
    prompt: 'Tanjant dalgasında 1 hedef ışınını kesen iki kökü yakala. Duvarlar kök değildir.',
  },
  {
    id: 'cot-roots',
    title: 'Kotanjant Kökleri',
    atomId: 'MAT.11.1.2.4',
    prompt: 'Kotanjant dalgasında √3 hedef ışınını kesen iki kökü işaretle.',
  },
];

export default function TrigonometricRootHunterApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState(initialRootHunterState);
  const [dragMarker, setDragMarker] = useState<RootMarkerId | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = rootHunterTargets[activeIndex];
  const measure = measureRootHunter(state, target);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(prepareRootMission(target));
    setDragMarker(null);
  };

  const restart = () => {
    setState(initialRootHunterState);
    setDragMarker(null);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, marker: RootMarkerId | null = dragMarker) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !marker) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    const angle = angleFromX(transformed.x);
    setState((current) => ({
      markers: { ...current.markers, [marker]: angle },
    }));
  };

  const handleMarkerPointerDown = (marker: RootMarkerId, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragMarker(marker);
    updateFromPointer(event, marker);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    updateFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragMarker(null);
  };

  const handleMarkerKeyDown = (marker: RootMarkerId, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({
        markers: { ...current.markers, [marker]: target.roots[marker === 'a' ? 0 : 1] },
      }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 15 : 5;
    setState((current) => ({
      markers: {
        ...current.markers,
        [marker]: snapAngle(clamp(current.markers[marker] + (event.key === 'ArrowRight' ? delta : -delta), 0, 360)),
      },
    }));
  };

  const prepareNextMission = () => {
    const nextTarget = rootHunterTargets[activeIndex + 1];
    if (!nextTarget) return;
    setState(prepareRootMission(nextTarget));
    setDragMarker(null);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Kesişim açıları kilitlendi. Bir sonraki dalga avı açılıyor.',
      error: `İki kök de hedef ışınında değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      prepareNextMission();
    }
  };

  return (
    <HighSchoolLabShell
      title="Trigonometrik Kök Avcısı"
      subtitle="MAT.11.1.2"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-0 py-5 xl:max-w-6xl"
      frameClassName="bg-[#04111d] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(167,139,250,0.16),transparent_30%),linear-gradient(180deg,#04111d_0%,#0b1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Kanal', value: target.channel.toUpperCase(), tone: target.channel === 'tan' || target.channel === 'cot' ? 'purple' : 'cyan' },
        { label: 'Kilit', value: `${measure.lockedCount}/2`, tone: missionOk ? 'green' : 'amber' },
      ]}
    >
      <div className="mx-4 grid min-h-0 min-w-0 items-start gap-4 md:mx-0 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RootHunterScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onMarkerPointerDown={handleMarkerPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMarkerKeyDown={handleMarkerKeyDown}
        />
        <RootHunterControls
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
