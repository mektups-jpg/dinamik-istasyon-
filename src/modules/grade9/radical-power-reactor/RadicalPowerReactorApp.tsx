import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { RadicalControls } from './RadicalControls';
import { RadicalScene } from './RadicalScene';
import { DragTarget, Point, PowerChallenge, PowerKey, PowerPlaced, PowerPositions, RootChallenge, RootKey, RootPlaced, RootPositions } from './types';
import { clamp, createPowerChallenge, createRootChallenge, formatPower, initialPowerPlaced, initialPowerPositions, initialRootPlaced, initialRootPositions, isNear, powerSlots, rootSlots } from './reactorModel';

const MODULE_ID = 'radical-power-reactor';
const ATOM_LABEL = 'MAT.9.1.1.1-2 / MAT.9.1.2.1-2';
const POWER_CHALLENGE_STORAGE_KEY = 'radical-power-reactor:last-power-challenge';
const ROOT_CHALLENGE_STORAGE_KEY = 'radical-power-reactor:last-root-challenge';

const ATOM_IDS = ['MAT.9.1.1.1', 'MAT.9.1.1.2', 'MAT.9.1.2.1', 'MAT.9.1.2.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'power-fusion',
    title: 'Üs Füzyonu',
    atomId: 'MAT.9.1.1.2',
    prompt: 'Aynı tabanlı iki üslü ifadeyi merkezdeki füzyon yuvalarına taşı. Taban aynı kalır, üsler toplanır.',
  },
  {
    id: 'root-extractor',
    title: 'Kök İçinde Tam Kareyi Ayır',
    atomId: 'MAT.9.1.2.2',
    prompt: 'Köklü sayının içindeki tam kare çarpanı ayır. Tam kare çarpan dışarı çıkar, kalan çarpan kökün içinde kalır.',
  },
];

export default function RadicalPowerReactorApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [powerChallenge, setPowerChallenge] = useState(createStoredPowerChallenge);
  const [rootChallenge, setRootChallenge] = useState(createStoredRootChallenge);
  const [powerPositions, setPowerPositions] = useState<PowerPositions>(initialPowerPositions);
  const [rootPositions, setRootPositions] = useState<RootPositions>(initialRootPositions);
  const [powerPlaced, setPowerPlaced] = useState<PowerPlaced>(initialPowerPlaced);
  const [rootPlaced, setRootPlaced] = useState<RootPlaced>(initialRootPlaced);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const powerComplete = powerPlaced.cube && powerPlaced.square;
  const rootComplete = rootPlaced.square && rootPlaced.remainder;
  const leftPower = formatPower(powerChallenge.base, powerChallenge.leftExponent);
  const rightPower = formatPower(powerChallenge.base, powerChallenge.rightExponent);
  const totalPower = formatPower(powerChallenge.base, powerChallenge.totalExponent);
  const activeMission = activeIndex === 0
    ? {
        ...progress.activeMission,
        prompt: `${leftPower} ve ${rightPower} ifadelerini füzyon yuvalarına taşı. Taban ${powerChallenge.base} aynı kalır; üsler ${powerChallenge.leftExponent} + ${powerChallenge.rightExponent} olur.`,
      }
    : {
        ...progress.activeMission,
        prompt: `${rootChallenge.radicand} sayısını ${rootChallenge.squareFactor} · ${rootChallenge.remainder} olarak ayır. ${rootChallenge.squareFactor} tam karedir; dışarı ${rootChallenge.outsideFactor} olarak çıkar.`,
      };

  const resetPanel = () => {
    setPowerPositions(initialPowerPositions);
    setRootPositions(initialRootPositions);
    setPowerPlaced(initialPowerPlaced);
    setRootPlaced(initialRootPlaced);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    setPowerChallenge((current) => {
      const nextChallenge = createPowerChallenge(current);
      writeStoredPowerChallenge(nextChallenge);
      return nextChallenge;
    });
    setRootChallenge((current) => {
      const nextChallenge = createRootChallenge(current);
      writeStoredRootChallenge(nextChallenge);
      return nextChallenge;
    });
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(target);
  };

  const placePower = (key: PowerKey) => {
    if (powerPlaced[key]) return;
    const nextPlaced = { ...powerPlaced, [key]: true };
    setPowerPositions((current) => ({ ...current, [key]: powerSlots[key] }));
    setPowerPlaced(nextPlaced);
    showMessage(
      nextPlaced.cube && nextPlaced.square
        ? `Üsler birleşti: taban ${powerChallenge.base} kalır, üstler ${powerChallenge.leftExponent} + ${powerChallenge.rightExponent} olur.`
        : 'İlk enerji çekirdeği yuvaya kilitlendi; diğer çekirdeği de merkeze taşı.',
      nextPlaced.cube && nextPlaced.square ? 'success' : 'info',
    );
  };

  const placeRoot = (key: RootKey) => {
    if (rootPlaced[key]) return;
    const nextPlaced = { ...rootPlaced, [key]: true };
    setRootPositions((current) => ({ ...current, [key]: rootSlots[key] }));
    setRootPlaced(nextPlaced);
    showMessage(
      nextPlaced.square && nextPlaced.remainder
        ? `Kök ayrıldı: ${rootChallenge.squareFactor} dışarı ${rootChallenge.outsideFactor} olur, ${rootChallenge.remainder} kökün içinde kalır.`
        : key === 'square'
          ? `Tam kare ${rootChallenge.squareFactor} dışarı ${rootChallenge.outsideFactor} olarak çıkar; şimdi ${rootChallenge.remainder} parçasını kök içinde bırak.`
          : `${rootChallenge.remainder} kökün içinde kalır; şimdi tam kare ${rootChallenge.squareFactor} parçasını dışarı çıkar.`,
      nextPlaced.square && nextPlaced.remainder ? 'success' : 'info',
    );
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
      success: 'Üs kuralı kuruldu. Şimdi kökteki tam kare parçayı ayıralım.',
      error: activeIndex === 0
        ? 'İki enerji çekirdeği de füzyon yuvalarına oturmadı.'
        : 'Tam kare kristali ve kökte kalan parça doğru haznelere ayrılmadı.',
    });
  };

  return (
    <Grade9LabShell
      title="Kök ve Üs Reaktörü"
      subtitle={ATOM_LABEL}
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#05070b] [background-image:radial-gradient(circle_at_18%_12%,rgba(52,211,153,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.10),transparent_26%),radial-gradient(circle_at_52%_92%,rgba(255,255,255,0.055),transparent_38%),linear-gradient(180deg,#05070b_0%,#07110d_54%,#030504_100%)]"
      badges={[
        { label: 'Durum', value: 'Vitrin Hazır', tone: 'green' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
        { label: 'Odak', value: activeIndex === 0 ? 'üs füzyonu' : 'kök ayrımı', tone: 'amber' },
        { label: 'Sonuç', value: activeIndex === 0 ? (powerComplete ? `${totalPower} = ${powerChallenge.value}` : 'bekliyor') : (rootComplete ? `${rootChallenge.outsideFactor} dışarı, ${rootChallenge.remainder} içerde` : `${rootChallenge.squareFactor} · ${rootChallenge.remainder} ayrılıyor`), tone: powerComplete || rootComplete ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-5 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RadicalScene
          activeIndex={activeIndex}
          atomLabel={ATOM_LABEL}
          powerChallenge={powerChallenge}
          rootChallenge={rootChallenge}
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
          mission={activeMission}
          activeIndex={activeIndex}
          powerChallenge={powerChallenge}
          rootChallenge={rootChallenge}
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

function createStoredPowerChallenge() {
  const nextChallenge = createPowerChallenge(readStoredPowerChallenge());
  writeStoredPowerChallenge(nextChallenge);
  return nextChallenge;
}

function createStoredRootChallenge() {
  const nextChallenge = createRootChallenge(readStoredRootChallenge());
  writeStoredRootChallenge(nextChallenge);
  return nextChallenge;
}

function readStoredPowerChallenge(): PowerChallenge | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const stored = window.sessionStorage.getItem(POWER_CHALLENGE_STORAGE_KEY);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored) as Partial<PowerChallenge>;
    if (
      typeof parsed.base === 'number' &&
      typeof parsed.leftExponent === 'number' &&
      typeof parsed.rightExponent === 'number'
    ) {
      return {
        base: parsed.base,
        leftExponent: parsed.leftExponent,
        rightExponent: parsed.rightExponent,
        totalExponent: parsed.leftExponent + parsed.rightExponent,
        value: parsed.value ?? parsed.base ** (parsed.leftExponent + parsed.rightExponent),
      };
    }
  } catch {
    try {
      window.sessionStorage.removeItem(POWER_CHALLENGE_STORAGE_KEY);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function writeStoredPowerChallenge(challenge: PowerChallenge) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(POWER_CHALLENGE_STORAGE_KEY, JSON.stringify(challenge));
  } catch {
  }
}

function readStoredRootChallenge(): RootChallenge | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const stored = window.sessionStorage.getItem(ROOT_CHALLENGE_STORAGE_KEY);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored) as Partial<RootChallenge>;
    if (
      typeof parsed.radicand === 'number' &&
      typeof parsed.squareFactor === 'number' &&
      typeof parsed.outsideFactor === 'number' &&
      typeof parsed.remainder === 'number'
    ) {
      return {
        radicand: parsed.radicand,
        squareFactor: parsed.squareFactor,
        outsideFactor: parsed.outsideFactor,
        remainder: parsed.remainder,
      };
    }
  } catch {
    try {
      window.sessionStorage.removeItem(ROOT_CHALLENGE_STORAGE_KEY);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function writeStoredRootChallenge(challenge: RootChallenge) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(ROOT_CHALLENGE_STORAGE_KEY, JSON.stringify(challenge));
  } catch {
  }
}
