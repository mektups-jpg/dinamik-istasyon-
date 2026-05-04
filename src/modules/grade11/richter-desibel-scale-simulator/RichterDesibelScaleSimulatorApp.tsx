import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { ScaleSimulatorControls } from './ScaleSimulatorControls';
import { ScaleSimulatorScene } from './ScaleSimulatorScene';
import { ScaleState } from './types';
import {
  initialScaleState,
  isTargetMatched,
  measureScale,
  prepareScaleMission,
  railXToDial,
  roundDial,
  scaleTargets,
} from './scaleSimulatorModel';

const MODULE_ID = 'richter-desibel-scale-simulator';

const ATOM_IDS = ['MAT.11.1.6.1', 'MAT.11.1.6.2', 'MAT.11.1.6.3'];

const MISSIONS: MissionStep[] = [
  {
    id: 'growth-problem',
    title: 'Üstel Büyüme Eşiği',
    atomId: 'MAT.11.1.6.1',
    prompt: 'Zaman kadranını büyüt. Küçük saat artışlarının koloni sayısını nasıl hızla büyüttüğünü izle.',
  },
  {
    id: 'desibel-compressor',
    title: 'Desibel Kompresörü',
    atomId: 'MAT.11.1.6.2',
    prompt: 'Ses şiddeti oranını büyüt. 10 bin katlık oran desibel göstergesinde okunabilir 40 dB olur.',
  },
  {
    id: 'richter-seismograph',
    title: 'Richter Sismografı',
    atomId: 'MAT.11.1.6.3',
    prompt: 'Deprem genlik oranını 1000 kata yaklaştır. Log ölçek küçük sayı farkının büyük fiziksel anlamını gösterir.',
  },
];

export default function RichterDesibelScaleSimulatorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<ScaleState>(initialScaleState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = scaleTargets[activeIndex];
  const measure = measureScale(state, target);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(prepareScaleMission(target));
    setDragging(false);
  };

  const restart = () => {
    setState(initialScaleState);
    setDragging(false);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setState({ dial: railXToDial(transformed.x) });
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragging) return;
    updateFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState({ dial: target.targetDial });
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.075 : 0.025;
    setState((current) => ({
      dial: roundDial(current.dial + (event.key === 'ArrowRight' ? delta : -delta)),
    }));
  };

  const prepareNextMission = (nextIndex: number) => {
    const nextTarget = scaleTargets[nextIndex];
    if (!nextTarget) return;
    setState(prepareScaleMission(nextTarget));
    setDragging(false);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Ölçek dönüşümü doğru kilitlendi. Sıradaki gerçek yaşam ölçerine geçiliyor.',
      error: `Ölçek hedefte değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      prepareNextMission(activeIndex + 1);
    }
  };

  return (
    <HighSchoolLabShell
      title="Richter-Desibel Ölçek Simülatörü"
      subtitle="MAT.11.1.6.x"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06121a] [background-image:radial-gradient(circle_at_18%_14%,rgba(52,211,153,0.16),transparent_31%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.15),transparent_32%),radial-gradient(circle_at_72%_78%,rgba(244,114,182,0.12),transparent_30%),linear-gradient(180deg,#06121a_0%,#0b1826_58%,#03070d_100%)]"
      badges={[
        { label: 'Ham', value: measure.rawLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Ölçek', value: measure.outputLabel, tone: target.mode === 'richter' ? 'pink' : target.mode === 'desibel' ? 'cyan' : 'green' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ScaleSimulatorScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <ScaleSimulatorControls
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
