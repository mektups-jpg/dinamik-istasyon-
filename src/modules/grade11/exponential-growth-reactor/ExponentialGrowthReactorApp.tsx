import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { ExponentialGrowthControls } from './ExponentialGrowthControls';
import { ExponentialGrowthScene } from './ExponentialGrowthScene';
import { ExponentialState } from './types';
import { clamp, exponentialFrame, exponentialTargets, initialExponentialState, isTargetMatched, measureExponential, railXToBase, roundBase } from './exponentialModel';

const MODULE_ID = 'exponential-growth-reactor';

const ATOM_IDS = ['MAT.11.1.3.1', 'MAT.11.1.3.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'growth-curve',
    title: 'Artan Üstel Eğri',
    atomId: 'MAT.11.1.3.1',
    prompt: 'Taban çekirdeğini a=1 kapısının sağına taşı. Taban 1’den büyük olunca eğri sağa doğru hızlanarak yükselir.',
  },
  {
    id: 'decay-curve',
    title: 'Azalan Üstel Eğri',
    atomId: 'MAT.11.1.3.2',
    prompt: 'Taban çekirdeğini 0 ile 1 arasına indir. Taban kesir olunca eğri sağa doğru sönümlenir.',
  },
];

export default function ExponentialGrowthReactorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<ExponentialState>(initialExponentialState);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = exponentialTargets[activeIndex];
  const measure = measureExponential(state);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(initialExponentialState);
    setDragging(false);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setState({ base: railXToBase(transformed.x) });
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
      setState({ base: target.targetBase });
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.2 : 0.05;
    setState((current) => ({
      base: roundBase(clamp(current.base + (event.key === 'ArrowRight' ? delta : -delta), exponentialFrame.minBase, exponentialFrame.maxBase)),
    }));
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Taban bölgesi doğru. Reaktör grafiği yeni davranışa geçiriyor.',
      error: `Taban doğru bölgede değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      setState(initialExponentialState);
      setDragging(false);
    }
  };

  return (
    <HighSchoolLabShell
      title="Üstel Büyüme Reaktörü"
      subtitle="MAT.11.1.3.x"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#05101a] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.16),transparent_31%),linear-gradient(180deg,#05101a_0%,#0a1725_58%,#03070d_100%)]"
      badges={[
        { label: 'Taban', value: `a=${measure.base.toFixed(2)}`, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Davranış', value: measure.mode === 'growth' ? 'ARTAN' : measure.mode === 'decay' ? 'AZALAN' : 'NÖTR', tone: measure.mode === 'decay' ? 'purple' : measure.mode === 'growth' ? 'cyan' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <ExponentialGrowthScene
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
        <ExponentialGrowthControls
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
