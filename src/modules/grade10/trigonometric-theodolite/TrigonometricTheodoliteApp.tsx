import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { SideSelection, RatioSide } from './types';
import { TheodoliteControls } from './TheodoliteControls';
import { TheodoliteScene } from './TheodoliteScene';
import { basePoint, clamp, initialSelection, isSelectionCorrect, measureTriangle, ratioTargets } from './theodoliteModel';

const MODULE_ID = 'trigonometric-theodolite';

const ATOM_IDS = ratioTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  { id: 'sin', title: 'Sinüs Okuyucu', atomId: 'MAT.10.4.1.1', prompt: 'Sinüs için doğru pay ve payda kenarlarını oran okuyucuya kilitle.' },
  { id: 'cos', title: 'Kosinüs Okuyucu', atomId: 'MAT.10.4.1.2', prompt: 'Kosinüs için doğru pay ve payda kenarlarını seç.' },
  { id: 'tan', title: 'Tanjant Okuyucu', atomId: 'MAT.10.4.1.3', prompt: 'Tanjant oranını doğru iki dik kenarla kur.' },
  { id: 'cot', title: 'Kotanjant Okuyucu', atomId: 'MAT.10.4.1.4', prompt: 'Kotanjant oranında pay ve payda yer değiştirir.' },
];

export default function TrigonometricTheodoliteApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [angle, setAngle] = useState(38);
  const [draggingAngle, setDraggingAngle] = useState(false);
  const [selection, setSelection] = useState<SideSelection>(() => initialSelection());
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = ratioTargets[activeIndex];
  const measure = measureTriangle(angle);
  const missionOk = isSelectionCorrect(selection, target);

  const resetPanel = () => {
    setAngle(38);
    setDraggingAngle(false);
    setSelection(initialSelection());
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const selectSide = (side: RatioSide) => {
    setSelection((current) => {
      if (!current.numerator || current.denominator) return { numerator: side, denominator: null };
      return { ...current, denominator: side };
    });
  };

  const handleAngleDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingAngle(true);
  };

  const handleAngleMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!draggingAngle) return;
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    const dx = transformed.x - basePoint.x;
    const dy = basePoint.y - transformed.y;
    const nextAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    setAngle(Math.round(clamp(nextAngle, 20, 68)));
  };

  const handleAngleUp = () => {
    setDraggingAngle(false);
  };

  const stepAngle = (delta: number) => {
    setAngle((current) => Math.round(clamp(current + delta, 20, 68)));
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: `${target.label} oranı doğru kenarlarla kuruldu. Bir sonraki oran kartuşu açılıyor.`,
      error: `${target.label} için pay/payda eşleşmesi yanlış. ${target.hint}`,
    });
    if (missionOk) setSelection(initialSelection());
  };

  return (
    <HighSchoolLabShell
      title="Trigonometrik Teodolit"
      subtitle="MAT.10.4.1.x"
      moduleId={MODULE_ID}
      gradeLabel="10. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#020d12] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(251,191,36,0.14),transparent_30%),linear-gradient(180deg,#020d12_0%,#071a22_56%,#03070d_100%)]"
      badges={[
        { label: 'Oran', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <TheodoliteScene
          target={target}
          measure={measure}
          selection={selection}
          missionOk={missionOk}
          svgRef={svgRef}
          onAngleDown={handleAngleDown}
          onAngleMove={handleAngleMove}
          onAngleUp={handleAngleUp}
          onAngleStep={stepAngle}
          onSelectSide={selectSide}
        />
        <TheodoliteControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          selection={selection}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
