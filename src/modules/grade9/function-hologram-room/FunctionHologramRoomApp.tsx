import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { FunctionControls } from './FunctionControls';
import { FunctionScene } from './FunctionScene';
import { DragTarget, FunctionParams, GraphPoint } from './types';
import { calibrationTargets, clamp, initialParams, isTargetMatched, roundToTenth, svgToGraph } from './functionModel';

const MODULE_ID = 'function-hologram-room';

const ATOM_IDS = calibrationTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'reference-laser',
    title: 'Referans Lazeri Yak',
    atomId: 'MAT.9.2.1.1',
    prompt: 'Çizgiyi f(x)=x referansına kalibre et. Kaynak orijinde, eğim 1 olmalı.',
  },
  {
    id: 'vertical-thrust',
    title: 'Dikey İtki',
    atomId: 'MAT.9.2.1.2',
    prompt: 'Kaynak noktasını yukarı taşı. Aynı eğimli lazer paralel biçimde +2 yükselsin.',
  },
  {
    id: 'horizontal-slide',
    title: 'Yatay Sürgü',
    atomId: 'MAT.9.2.1.3',
    prompt: 'Kaynak noktasını sağdaki düğüme çek. r değişince grafik yatay konum değiştirir.',
  },
  {
    id: 'slope-arm',
    title: 'Eğim Kolu',
    atomId: 'MAT.9.2.1.4',
    prompt: 'Kaynağı sabit tut, eğim kolunu yukarı çek. Lazerin dikliği a katsayısıyla artsın.',
  },
];

export default function FunctionHologramRoomApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [params, setParams] = useState<FunctionParams>(initialParams);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = calibrationTargets[activeIndex];
  const missionOk = isTargetMatched(params, target.params);

  const resetPanel = () => {
    setParams(initialParams);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>, nextTarget: DragTarget) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragTarget) return;
    const point = getGraphPoint(event, svgRef.current);
    if (!point) return;

    if (dragTarget === 'anchor') {
      setParams((current) => ({ ...current, r: point.x, k: point.y }));
      return;
    }

    setParams((current) => ({
      ...current,
      a: roundToTenth(clamp((point.y - current.k) / 2, -2.5, 3)),
    }));
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Lazer dönüşümü doğru okundu. Bir sonraki kalibrasyon düğümü açılıyor.',
      error: 'Lazer hedef çizgiyle çakışmadı. Kaynak noktasını veya eğim kolunu yeniden ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Fonksiyonel Hologram Odası"
      subtitle="MAT.9.2.1.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#030711] [background-image:radial-gradient(circle_at_16%_18%,rgba(0,229,255,0.19),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(0,255,136,0.12),transparent_26%),linear-gradient(180deg,#030711_0%,#071426_58%,#040712_100%)]"
      badges={[
        { label: 'Hedef', value: target.label, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <FunctionScene
          params={params}
          target={target}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <FunctionControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          params={params}
          target={target}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
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
