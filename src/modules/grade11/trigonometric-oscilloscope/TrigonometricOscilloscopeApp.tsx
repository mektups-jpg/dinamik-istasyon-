import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { OscilloscopeControls } from './OscilloscopeControls';
import { OscilloscopeScene } from './OscilloscopeScene';
import { OscilloscopeState } from './types';
import { angleFromSvgPoint, clamp, initialOscilloscope, isTargetMatched, measureOscilloscope, oscilloscopeTargets, snapAngle } from './oscilloscopeModel';

const MODULE_ID = 'trigonometric-oscilloscope';

const ATOM_IDS = ['MAT.11.1.1.1', 'MAT.11.1.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'sin-peak',
    title: 'Sinüs Tepe Sinyali',
    atomId: 'MAT.11.1.1.1',
    prompt: 'Faz kolunu 90° tepesine getir. Sinüs dikey izdüşüm olduğu için değer 1 olur.',
  },
  {
    id: 'sin-period',
    title: 'Sinüs Tam Tur',
    atomId: 'MAT.11.1.1.1',
    prompt: 'Faz kolunu 360° tam tura tamamla. Sinüs dalgası başladığı yüksekliğe geri döner.',
  },
  {
    id: 'cos-valley',
    title: 'Kosinüs Sol Uç',
    atomId: 'MAT.11.1.1.2',
    prompt: 'Faz kolunu 180° sol uca getir. Kosinüs yatay izdüşüm olduğu için değer -1 olur.',
  },
  {
    id: 'cos-period',
    title: 'Kosinüs Tam Tur',
    atomId: 'MAT.11.1.1.2',
    prompt: 'Faz kolunu 360° tam tura tamamla. Kosinüs tekrar 1 değerine döner.',
  },
];

export default function TrigonometricOscilloscopeApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<OscilloscopeState>(initialOscilloscope);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = oscilloscopeTargets[activeIndex];
  const measure = measureOscilloscope(state);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(initialOscilloscope);
    setDragging(false);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
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

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setState({ angle: angleFromSvgPoint(transformed.x, transformed.y) });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState({ angle: target.targetAngle });
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 15 : 5;
    setState((current) => ({
      angle: snapAngle(clamp(current.angle + (event.key === 'ArrowRight' ? delta : -delta), 0, 360)),
    }));
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Dalga izi hedef faza kilitlendi. Bir sonraki kanal açılıyor.',
      error: `Faz kolu hedefte değil. ${target.hint}`,
    });
  };

  return (
    <HighSchoolLabShell
      title="Trigonometrik Osiloskop"
      subtitle="MAT.11.1.1.x"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#031015] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(52,211,153,0.14),transparent_30%),linear-gradient(180deg,#031015_0%,#071a22_56%,#03070d_100%)]"
      badges={[
        { label: 'Kanal', value: target.channel.toUpperCase(), tone: target.channel === 'sin' ? 'cyan' : 'green' },
        { label: 'Faz', value: `${Math.round(measure.angle)}°`, tone: missionOk ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <OscilloscopeScene
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
        <OscilloscopeControls
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
