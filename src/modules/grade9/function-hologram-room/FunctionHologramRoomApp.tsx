import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { FunctionControls } from './FunctionControls';
import { FunctionScene } from './FunctionScene';
import { DragTarget, FunctionParams, GraphPoint } from './types';
import { calibrationTargets, clamp, initialParams, isTargetMatched, roundToTenth, svgToGraph } from './functionModel';

const MODULE_ID = 'function-hologram-room';
const ATOM_LABEL = 'MAT.9.2.1.1-4';

const ATOM_IDS = calibrationTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'reference-laser',
    title: 'Referans Doğruyu Kur',
    atomId: 'MAT.9.2.1.1',
    prompt: 'Mavi noktayı orijine taşı, yeşil eğim noktasını 45 dereceye getir; doğru f(x)=x ile üst üste gelsin.',
  },
  {
    id: 'vertical-thrust',
    title: 'Dikey Kaydırma',
    atomId: 'MAT.9.2.1.2',
    prompt: 'Mavi noktayı yukarı taşı. Doğru aynı eğimde kalsın ve 2 birim yukarı çıksın.',
  },
  {
    id: 'horizontal-slide',
    title: 'Yatay Kaydırma',
    atomId: 'MAT.9.2.1.3',
    prompt: 'Mavi noktayı sağdaki hedefe taşı. Grafik sağa kayarken eğimi değişmesin.',
  },
  {
    id: 'slope-arm',
    title: 'Eğim Kolu',
    atomId: 'MAT.9.2.1.4',
    prompt: 'Mavi nokta yerinde kalsın. Yeşil eğim noktasını yukarı çekerek doğruyu daha dik yap.',
  },
];

export default function FunctionHologramRoomApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const { showMessage } = useAstroBotStore();
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
    if (dragTarget === 'anchor') {
      showMessage('Mavi nokta taşındı; grafiğin yatay ve dikey konumu değişti.', 'info');
    }
    if (dragTarget === 'tilt') {
      showMessage('Yeşil eğim noktası taşındı; doğru daha yatık ya da daha dik görünüyor.', 'info');
    }
    setDragTarget(null);
  };

  const handleHandleKeyDown = (event: KeyboardEvent<SVGElement>, nextTarget: DragTarget) => {
    if (event.key !== 'Home') return;
    event.preventDefault();

    if (nextTarget === 'anchor') {
      setParams((current) => ({ ...current, r: target.params.r, k: target.params.k }));
      showMessage('Mavi nokta hedef doğrunun başlangıç noktasına hizalandı.', 'info');
      return;
    }

    setParams((current) => ({ ...current, a: target.params.a }));
    showMessage('Yeşil eğim noktası hedef doğrunun eğimine hizalandı.', 'info');
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Doğru hedef grafikle üst üste geldi. Şimdi bir sonraki dönüşümü deneyelim.',
      error: 'Çizgi hedefle henüz üst üste değil. Mavi noktayı veya yeşil eğim noktasını yeniden ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Fonksiyon Grafiği Dönüşüm Atölyesi"
      subtitle={ATOM_LABEL}
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
          onHandleKeyDown={handleHandleKeyDown}
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
