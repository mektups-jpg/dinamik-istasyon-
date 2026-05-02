import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { FunctionFilterControls } from './FunctionFilterControls';
import { FunctionFilterScene } from './FunctionFilterScene';
import { GraphPoint, MappingState } from './types';
import {
  clamp,
  functionTargets,
  getHitPoints,
  graphConfig,
  initialMappingState,
  initialScannerX,
  isMappingComplete,
  isScannerMatched,
  mappingPairs,
  relationScenarios,
  roundToTenth,
  svgToGraph,
} from './filterModel';

const MODULE_ID = 'function-filter';

const ATOM_IDS = ['MAT.10.2.1.1', 'MAT.10.2.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'reject-relation',
    title: 'İki Çıkışı Yakala',
    atomId: 'MAT.10.2.1.1',
    prompt: 'Dikey lazeri aynı x değerinde iki noktaya çarpacak şekilde hizala.',
  },
  {
    id: 'accept-function',
    title: 'Tek Çıkışı Doğrula',
    atomId: 'MAT.10.2.1.1',
    prompt: 'Dikey lazeri fonksiyon örneğinde tek çıktı veren hedefe getir.',
  },
  {
    id: 'map-domain',
    title: 'Tanım Kümesini Bağla',
    atomId: 'MAT.10.2.1.2',
    prompt: 'f(x)=2x+1 kuralını kullanarak her giriş portunu doğru çıkışa bağla.',
  },
];

export default function FunctionFilterApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [scannerX, setScannerX] = useState(initialScannerX);
  const [draggingScanner, setDraggingScanner] = useState(false);
  const [mapping, setMapping] = useState<MappingState>(() => initialMappingState());
  const [selectedInput, setSelectedInput] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = functionTargets[activeIndex];
  const scenario = target.kind === 'reject-relation' ? relationScenarios.notFunction : relationScenarios.function;
  const hitCount = getHitPoints(scenario.points, scannerX).length;
  const missionOk = target.kind === 'map-domain'
    ? isMappingComplete(mapping)
    : isScannerMatched(scannerX, target.targetX ?? 0) && (target.kind === 'reject-relation' ? hitCount >= 2 : hitCount === 1);

  const resetPanel = () => {
    setScannerX(initialScannerX);
    setDraggingScanner(false);
    setMapping(initialMappingState());
    setSelectedInput(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handleScannerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingScanner(true);
  };

  const handleScannerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!draggingScanner || target.kind === 'map-domain') return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;
    setScannerX(point.x);
  };

  const handleScannerUp = () => {
    setDraggingScanner(false);
  };

  const stepScanner = (delta: number) => {
    if (target.kind === 'map-domain') return;
    setScannerX((current) => roundToTenth(clamp(current + delta, graphConfig.minX, graphConfig.maxX)));
  };

  const snapScanner = () => {
    if (target.kind === 'map-domain') return;
    setScannerX(target.targetX ?? 0);
  };

  const selectInput = (input: number) => {
    setSelectedInput(input);
  };

  const selectOutput = (output: number) => {
    if (selectedInput === null) return;
    setMapping((current) => ({ ...current, [selectedInput]: output }));
    const next = mappingPairs.find((pair) => currentValueIsEmpty(mapping, pair.input) && pair.input !== selectedInput);
    setSelectedInput(next?.input ?? null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: target.kind === 'reject-relation' ? 'Aynı x iki y üretti. İlişki reddedildi.' : 'Filtre geçti. Bir sonraki fonksiyon katmanı açılıyor.',
      error: target.kind === 'map-domain'
        ? 'Bazı girişler f(x)=2x+1 kuralıyla doğru çıkışa bağlanmadı.'
        : target.kind === 'reject-relation'
          ? 'Bu x değeri iki farklı y üretmiyor. Dikey lazeri çift noktaya hizala.'
          : 'Bu tarama henüz tek çıktı hedefini doğrulamıyor.',
    });
  };

  return (
    <HighSchoolLabShell
      title="Fonksiyon Mu Filtresi"
      subtitle="MAT.10.2.1.x"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#020817] [background-image:radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(167,139,250,0.16),transparent_30%),linear-gradient(180deg,#020817_0%,#08162a_58%,#030712_100%)]"
      badges={[
        { label: 'Filtre', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <FunctionFilterScene
          target={target}
          scannerX={scannerX}
          scenario={scenario}
          hitCount={hitCount}
          missionOk={missionOk}
          mapping={mapping}
          selectedInput={selectedInput}
          svgRef={svgRef}
          onScannerDown={handleScannerDown}
          onScannerMove={handleScannerMove}
          onScannerUp={handleScannerUp}
          onScannerStep={stepScanner}
          onScannerSnap={snapScanner}
          onSelectInput={selectInput}
          onSelectOutput={selectOutput}
        />
        <FunctionFilterControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          scannerX={scannerX}
          hitCount={hitCount}
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

function currentValueIsEmpty(mapping: MappingState, input: number) {
  return mapping[input] === null;
}
