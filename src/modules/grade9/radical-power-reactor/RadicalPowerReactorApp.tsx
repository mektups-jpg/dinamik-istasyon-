import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { RadicalControls } from './RadicalControls';
import { RadicalScene } from './RadicalScene';
import { DragTarget, Point, PowerKey, PowerPlaced, PowerPositions, RootKey, RootPlaced, RootPositions } from './types';
import { clamp, initialPowerPlaced, initialPowerPositions, initialRootPlaced, initialRootPositions, isNear, powerSlots, rootSlots } from './reactorModel';

const MODULE_ID = 'radical-power-reactor';

const ATOM_IDS = ['MAT.9.1.1.1', 'MAT.9.1.1.2', 'MAT.9.1.2.1', 'MAT.9.1.2.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'power-fusion',
    title: 'Üs Füzyonu',
    atomId: 'MAT.9.1.1.2',
    prompt: '2³ ve 2² çekirdeklerini merkezdeki füzyon yuvalarına taşı. Taban aynı kaldığında üstteki enerji birleşir.',
  },
  {
    id: 'root-extractor',
    title: 'Kristal Ayrıştırma',
    atomId: 'MAT.9.1.2.2',
    prompt: '√72 kristalinden √36 tam kare bloğunu dış hazneye, √2 kalıntısını kök içi hazneye ayır.',
  },
];

export default function RadicalPowerReactorApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [powerPositions, setPowerPositions] = useState<PowerPositions>(initialPowerPositions);
  const [rootPositions, setRootPositions] = useState<RootPositions>(initialRootPositions);
  const [powerPlaced, setPowerPlaced] = useState<PowerPlaced>(initialPowerPlaced);
  const [rootPlaced, setRootPlaced] = useState<RootPlaced>(initialRootPlaced);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const powerComplete = powerPlaced.cube && powerPlaced.square;
  const rootComplete = rootPlaced.square && rootPlaced.remainder;

  const resetPanel = () => {
    setPowerPositions(initialPowerPositions);
    setRootPositions(initialRootPositions);
    setPowerPlaced(initialPowerPlaced);
    setRootPlaced(initialRootPlaced);
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

  const placePower = (key: PowerKey) => {
    setPowerPositions((current) => ({ ...current, [key]: powerSlots[key] }));
    setPowerPlaced((current) => ({ ...current, [key]: true }));
  };

  const placeRoot = (key: RootKey) => {
    setRootPositions((current) => ({ ...current, [key]: rootSlots[key] }));
    setRootPlaced((current) => ({ ...current, [key]: true }));
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const nextPoint = getSvgPoint(event, svgRef.current);
    if (!nextPoint) return;

    if (dragTarget.kind === 'power' && !powerPlaced[dragTarget.key]) setPowerPositions((current) => ({ ...current, [dragTarget.key]: nextPoint }));
    if (dragTarget.kind === 'root' && !rootPlaced[dragTarget.key]) setRootPositions((current) => ({ ...current, [dragTarget.key]: nextPoint }));
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const dropPoint = getSvgPoint(event, svgRef.current);

    if (dragTarget.kind === 'power') {
      const slot = powerSlots[dragTarget.key];
      const placed = Boolean(dropPoint && isNear(dropPoint, slot));
      if (placed) {
        placePower(dragTarget.key);
      } else {
        setPowerPositions((current) => ({ ...current, [dragTarget.key]: initialPowerPositions[dragTarget.key] }));
      }
    }

    if (dragTarget.kind === 'root') {
      const slot = rootSlots[dragTarget.key];
      const placed = Boolean(dropPoint && isNear(dropPoint, slot, 92));
      if (placed) {
        placeRoot(dragTarget.key);
      } else {
        setRootPositions((current) => ({ ...current, [dragTarget.key]: initialRootPositions[dragTarget.key] }));
      }
    }

    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: activeIndex === 0 ? powerComplete : rootComplete,
      success: 'Reaktör doğru ayrıştı. Bir sonraki sayı deneyine geçebilirsin.',
      error: activeIndex === 0
        ? 'İki enerji çekirdeği de füzyon yuvalarına oturmadı.'
        : 'Tam kare kristali ve kökte kalan parça doğru haznelere ayrılmadı.',
    });
  };

  return (
    <Grade9LabShell
      title="Kök ve Üs Reaktörü"
      subtitle="MAT.9.1.1.x / MAT.9.1.2.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#05070b] [background-image:radial-gradient(circle_at_18%_12%,rgba(52,211,153,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.10),transparent_26%),radial-gradient(circle_at_52%_92%,rgba(255,255,255,0.055),transparent_38%),linear-gradient(180deg,#05070b_0%,#07110d_54%,#030504_100%)]"
      badges={[
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
        { label: 'Odak', value: activeIndex === 0 ? 'üs füzyonu' : 'kök ayrımı', tone: 'amber' },
        { label: 'Sonuç', value: activeIndex === 0 ? (powerComplete ? '2⁵ = 32' : 'bekliyor') : (rootComplete ? '6√2' : 'bekliyor'), tone: powerComplete || rootComplete ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-5 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RadicalScene
          activeIndex={activeIndex}
          powerPositions={powerPositions}
          rootPositions={rootPositions}
          powerPlaced={powerPlaced}
          rootPlaced={rootPlaced}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPowerSlotSelect={placePower}
          onRootSlotSelect={placeRoot}
        />
        <RadicalControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          powerPlaced={powerPlaced}
          rootPlaced={rootPlaced}
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
    x: clamp(transformed.x, 62, 658),
    y: clamp(transformed.y, 72, 430),
  };
}
