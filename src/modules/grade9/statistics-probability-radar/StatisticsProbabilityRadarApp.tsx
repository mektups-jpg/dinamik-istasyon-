import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { StatsControls } from './StatsControls';
import { StatsScene } from './StatsScene';
import { DragTarget, Point } from './types';
import { boxPlot, clamp, groups, initialMedianHandle, initialScanner, isMedianLocked, isStableScanner, nearestGroup, scaleBoxValue } from './statsModel';

const MODULE_ID = 'statistics-probability-radar';

const ATOM_IDS = ['MAT.9.6.1.1', 'MAT.9.6.1.2', 'MAT.9.6.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'stable-distribution',
    title: 'En İstikrarlı Bulutu Tara',
    atomId: 'MAT.9.6.2.1',
    prompt: 'σ tarayıcısını üç sınıfın üstünde gezdir. En dar dağılım olan Sınıf B üzerinde kilitle.',
  },
  {
    id: 'boxplot-median',
    title: 'Medyan Okuyucuyu Kilitle',
    atomId: 'MAT.9.6.1.2',
    prompt: 'Sarı medyan okuyucuyu kutu-bıyık grafiğinin orta çizgisine sürükle. Çizgi veriyi iki eş yarıya böler.',
  },
];

export default function StatisticsProbabilityRadarApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [scanner, setScanner] = useState<Point>(initialScanner);
  const [medianHandle, setMedianHandle] = useState<Point>(initialMedianHandle);
  const [scannerLocked, setScannerLocked] = useState(false);
  const [medianLocked, setMedianLocked] = useState(false);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const selectedGroup = nearestGroup(scanner.x);

  const resetPanel = () => {
    setScanner(initialScanner);
    setMedianHandle(initialMedianHandle);
    setScannerLocked(false);
    setMedianLocked(false);
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

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const nextPoint = getSvgPoint(event, svgRef.current);
    if (!nextPoint) return;

    if (dragTarget.kind === 'scanner' && !scannerLocked) {
      setScanner({ x: nextPoint.x, y: clamp(nextPoint.y, 150, 350) });
    }
    if (dragTarget.kind === 'median' && !medianLocked) {
      setMedianHandle({ x: clamp(nextPoint.x, scaleBoxValue(boxPlot.min), scaleBoxValue(boxPlot.max)), y: 248 });
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const dropPoint = getSvgPoint(event, svgRef.current);

    if (dragTarget.kind === 'scanner' && dropPoint) {
      const locked = isStableScanner(dropPoint);
      setScanner(locked ? { x: 360, y: 250 } : initialScanner);
      if (locked) setScannerLocked(true);
    }
    if (dragTarget.kind === 'median' && dropPoint) {
      const locked = isMedianLocked(dropPoint);
      setMedianHandle(locked ? { x: scaleBoxValue(boxPlot.median), y: 248 } : initialMedianHandle);
      if (locked) setMedianLocked(true);
    }

    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: activeIndex === 0 ? scannerLocked : medianLocked,
      success: 'Veri davranışı doğru okundu. Bir sonraki analiz katmanı açılıyor.',
      error: activeIndex === 0
        ? 'Tarayıcı en istikrarlı veri bulutu olan Sınıf B üzerinde kilitlenmedi.'
        : 'Medyan okuyucu kutu-bıyık grafiğinin orta çizgisine kilitlenmedi.',
    });
  };

  return (
    <Grade9LabShell
      title="Veri Karar Radarı"
      subtitle="MAT.9.6.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#061006] [background-image:radial-gradient(circle_at_18%_18%,rgba(190,242,100,0.16),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(0,229,255,0.10),transparent_26%),linear-gradient(180deg,#061006_0%,#07150d_55%,#030803_100%)]"
      badges={[
        { label: 'Seçim', value: `Sınıf ${selectedGroup}`, tone: 'green' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <StatsScene
          activeIndex={activeIndex}
          scanner={scanner}
          medianHandle={medianHandle}
          scannerLocked={scannerLocked}
          medianLocked={medianLocked}
          selectedGroup={selectedGroup}
          groups={groups}
          boxPlot={boxPlot}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <StatsControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          selectedGroup={selectedGroup}
          scannerLocked={scannerLocked}
          medianLocked={medianLocked}
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
