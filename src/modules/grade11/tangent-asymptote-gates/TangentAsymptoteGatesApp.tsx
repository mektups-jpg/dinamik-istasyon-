import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { AsymptoteControls } from './AsymptoteControls';
import { AsymptoteScene } from './AsymptoteScene';
import { GateId } from './types';
import { angleFromX, asymptoteTargets, clamp, initialAsymptoteState, isTargetMatched, measureAsymptote, snapAngle } from './asymptoteModel';

const MODULE_ID = 'tangent-asymptote-gates';

const ATOM_IDS = ['MAT.11.1.1.3', 'MAT.11.1.1.4'];

const MISSIONS: MissionStep[] = [
  {
    id: 'tan-first-wall',
    title: 'Tanjant İlk Duvar',
    atomId: 'MAT.11.1.1.3',
    prompt: 'İlk tanjant kapısını 90° çizgisine sürükle. Bu çizgide grafik duvara yaklaşır ama çizgiyi kesmez.',
  },
  {
    id: 'tan-second-wall',
    title: 'Tanjant İkinci Duvar',
    atomId: 'MAT.11.1.1.3',
    prompt: 'İkinci tanjant kapısını 270° çizgisine kilitle. Tanjantın asimptot ritmi 180° aralıkla tekrar eder.',
  },
  {
    id: 'cot-wall-family',
    title: 'Kotanjant Kapı Ailesi',
    atomId: 'MAT.11.1.1.4',
    prompt: 'Kotanjant kapılarını 0°, 180° ve 360° çizgilerine yerleştir. Kotanjant sinüsün sıfır olduğu yerlerde tanımsızdır.',
  },
  {
    id: 'cot-approach-scan',
    title: 'Duvara Yaklaşma Taraması',
    atomId: 'MAT.11.1.1.4',
    prompt: 'Tarayıcıyı 180° duvarına yaklaştır. Değer büyürken duvarın üzerinde nokta oluşmadığını gözle.',
  },
];

type DragTarget = { kind: 'gate'; gate: GateId } | { kind: 'scanner' } | null;

export default function TangentAsymptoteGatesApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState(initialAsymptoteState);
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = asymptoteTargets[activeIndex];
  const measure = measureAsymptote(state, target.channel);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(initialAsymptoteState);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const angleFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return null;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    return angleFromX(transformed.x);
  };

  const updateDrag = (event: ReactPointerEvent<SVGElement>, nextTarget: DragTarget = dragTarget) => {
    const angle = angleFromPointer(event);
    if (angle === null || !nextTarget) return;

    if (nextTarget.kind === 'scanner') {
      setState((current) => ({ ...current, scannerAngle: angle }));
      return;
    }

    setState((current) => ({
      ...current,
      gates: {
        ...current.gates,
        [nextTarget.gate]: angle,
      },
    }));
  };

  const handleGatePointerDown = (gate: GateId, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const nextTarget: DragTarget = { kind: 'gate', gate };
    setDragTarget(nextTarget);
    updateDrag(event, nextTarget);
  };

  const handleScannerPointerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const nextTarget: DragTarget = { kind: 'scanner' };
    setDragTarget(nextTarget);
    updateDrag(event, nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    updateDrag(event);
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleGateKeyDown = (gate: GateId, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      const homeTarget = target.gateTargets[gate];
      if (homeTarget === undefined) return;
      setState((current) => ({ ...current, gates: { ...current.gates, [gate]: homeTarget } }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 15 : 5;
    setState((current) => ({
      ...current,
      gates: {
        ...current.gates,
        [gate]: snapAngle(clamp(current.gates[gate] + (event.key === 'ArrowRight' ? delta : -delta), 0, 360)),
      },
    }));
  };

  const handleScannerKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({ ...current, scannerAngle: target.scannerTarget ?? current.scannerAngle }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 15 : 5;
    setState((current) => ({
      ...current,
      scannerAngle: snapAngle(clamp(current.scannerAngle + (event.key === 'ArrowRight' ? delta : -delta), 0, 360)),
    }));
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Asimptot kapısı doğru çizgiye kilitlendi. Yeni kanal açılıyor.',
      error: `Kapı grafiğin yasak duvarında değil. ${target.hint}`,
    });
  };

  return (
    <HighSchoolLabShell
      title="Tanjant Asimptot Kapıları"
      subtitle="MAT.11.1.1.3-4"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#070713] [background-image:radial-gradient(circle_at_18%_14%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(217,70,239,0.16),transparent_30%),linear-gradient(180deg,#070713_0%,#111426_56%,#050711_100%)]"
      badges={[
        { label: 'Kanal', value: target.channel.toUpperCase(), tone: target.channel === 'tan' ? 'cyan' : 'purple' },
        { label: 'Tarama', value: `${Math.round(state.scannerAngle)}°`, tone: missionOk ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AsymptoteScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onGatePointerDown={handleGatePointerDown}
          onScannerPointerDown={handleScannerPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onGateKeyDown={handleGateKeyDown}
          onScannerKeyDown={handleScannerKeyDown}
        />
        <AsymptoteControls
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
