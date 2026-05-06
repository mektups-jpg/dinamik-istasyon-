import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { OperationMixerControls } from './OperationMixerControls';
import { OperationMixerScene } from './OperationMixerScene';
import { OperationKind, OperationState } from './types';
import {
  initialOperationState,
  isTargetMatched,
  measureOperation,
  nextOperation,
  operationTargets,
} from './operationMixerModel';

const MODULE_ID = 'function-operation-mixer';

const ATOM_IDS = ['MAT.11.1.8.1', 'MAT.11.1.8.2', 'MAT.11.1.8.3', 'MAT.11.1.8.4'];

const MISSIONS: MissionStep[] = [
  {
    id: 'add-streams',
    title: 'Toplama Kanalı',
    atomId: 'MAT.11.1.8.1',
    prompt: '+ kapısını seç. Aynı x hattındaki f ve g değerleri tek çıktı akışına birleşsin.',
  },
  {
    id: 'subtract-streams',
    title: 'Çıkarma Kanalı',
    atomId: 'MAT.11.1.8.2',
    prompt: '- kapısını seç. g akışını f kanalından ayır ve fark değerlerini oku.',
  },
  {
    id: 'multiply-streams',
    title: 'Çarpma Kanalı',
    atomId: 'MAT.11.1.8.3',
    prompt: '× kapısını seç. İki değer akışı çarpan gibi aynı rayda güçlensin.',
  },
  {
    id: 'divide-streams',
    title: 'Bölme Güvenliği',
    atomId: 'MAT.11.1.8.4',
    prompt: '÷ kapısını seç. g(x)=0 olan istasyonun neden kilitlendiğini gör.',
  },
];

export default function FunctionOperationMixerApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<OperationState>(initialOperationState);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = operationTargets[activeIndex];
  const measure = measureOperation(state, target);
  const missionOk = isTargetMatched(state, target);

  useEffect(() => {
    setState(initialOperationState);
  }, [activeIndex]);

  const restart = () => {
    setState(initialOperationState);
    progress.restart();
  };

  const handleSelectOperation = (operation: OperationKind) => {
    setState({ selected: operation });
  };

  const handleDialKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState({ selected: target.operation });
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      setState((current) => ({ selected: nextOperation(current.selected, 1) }));
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      setState((current) => ({ selected: nextOperation(current.selected, -1) }));
    }
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: target.success,
      error: target.hint,
    });
  };

  return (
    <HighSchoolLabShell
      title="Fonksiyon İşlem Mikseri"
      subtitle="MAT.11.1.8.x"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06101e] [background-image:radial-gradient(circle_at_14%_16%,rgba(34,211,238,0.18),transparent_31%),radial-gradient(circle_at_78%_20%,rgba(244,114,182,0.16),transparent_34%),radial-gradient(circle_at_74%_84%,rgba(52,211,153,0.13),transparent_32%),linear-gradient(180deg,#06101e_0%,#0a1425_58%,#03070e_100%)]"
      badges={[
        { label: 'Kapı', value: measure.operationLabel, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Formül', value: target.formula, tone: 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <OperationMixerScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onSelectOperation={handleSelectOperation}
          onDialKeyDown={handleDialKeyDown}
        />
        <OperationMixerControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          onCheck={handleCheck}
          onReset={() => setState(initialOperationState)}
        />
      </div>
    </HighSchoolLabShell>
  );
}
