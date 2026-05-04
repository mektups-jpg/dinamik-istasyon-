import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { LogMirrorControls } from './LogMirrorControls';
import { LogMirrorScene } from './LogMirrorScene';
import { LogDragTarget, LogMirrorState } from './types';
import {
  clamp,
  initialLogMirrorState,
  isTargetMatched,
  logFrame,
  logMirrorTargets,
  measureLogMirror,
  railXToBase,
  railXToMirror,
  roundBase,
  roundMirror,
} from './logMirrorModel';

const MODULE_ID = 'logarithm-inverse-mirror';

const ATOM_IDS = ['MAT.11.1.4.1', 'MAT.11.1.5.1', 'MAT.11.1.5.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'inverse-mirror',
    title: 'Ters Ayna Dönüşümü',
    atomId: 'MAT.11.1.4.1',
    prompt: 'Ayna sürgüsünü %100 aç. Üstel eğrinin x ve y rolleri yer değiştirip logaritmaya dönüşsün.',
  },
  {
    id: 'log-growth',
    title: 'Artan Logaritma',
    atomId: 'MAT.11.1.5.1',
    prompt: 'Ayna açıkken tabanı 1’in sağına taşı. Taban 1’den büyükse logaritma grafiği artar.',
  },
  {
    id: 'log-decay',
    title: 'Azalan Logaritma',
    atomId: 'MAT.11.1.5.2',
    prompt: 'Ayna açıkken tabanı 0 ile 1 arasına indir. Taban kesir olduğunda logaritma grafiği azalır.',
  },
];

export default function LogarithmInverseMirrorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<LogMirrorState>(initialLogMirrorState);
  const [dragTarget, setDragTarget] = useState<LogDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = logMirrorTargets[activeIndex];
  const measure = measureLogMirror(state);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(initialLogMirrorState);
    setDragTarget(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: LogDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());

    if (nextTarget === 'base') {
      setState((current) => ({ ...current, base: railXToBase(transformed.x) }));
      return;
    }

    setState((current) => ({ ...current, mirrorPower: railXToMirror(transformed.x) }));
  };

  const handlePointerDown = (nextTarget: LogDragTarget, event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(nextTarget);
    updateFromPointer(event, nextTarget);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    updateFromPointer(event);
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const handleKeyDown = (keyTarget: LogDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({
        ...current,
        [keyTarget === 'base' ? 'base' : 'mirrorPower']: keyTarget === 'base' ? target.targetBase : target.targetMirror,
      }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();

    if (keyTarget === 'base') {
      const delta = event.shiftKey ? 0.2 : 0.05;
      setState((current) => ({
        ...current,
        base: roundBase(clamp(current.base + (event.key === 'ArrowRight' ? delta : -delta), logFrame.minBase, logFrame.maxBase)),
      }));
      return;
    }

    const delta = event.shiftKey ? 0.2 : 0.05;
    setState((current) => ({
      ...current,
      mirrorPower: roundMirror(clamp(current.mirrorPower + (event.key === 'ArrowRight' ? delta : -delta), 0, 1)),
    }));
  };

  const prepareNextMission = (nextIndex: number) => {
    const nextTarget = logMirrorTargets[nextIndex];
    if (!nextTarget) return;
    const stagedBase = nextTarget.kind === 'log-decay' ? 0.82 : 1.28;
    setState({
      base: stagedBase,
      mirrorPower: nextTarget.targetMirror,
    });
    setDragTarget(null);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Ayna doğru hizalandı. Bir sonraki ters dönüşüm kilidi açılıyor.',
      error: `Ayna odası hedefte değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      prepareNextMission(activeIndex + 1);
    }
  };

  return (
    <HighSchoolLabShell
      title="Logaritma Ters Ayna Odası"
      subtitle="MAT.11.1.4-5"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06101c] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.19),transparent_30%),radial-gradient(circle_at_80%_22%,rgba(244,114,182,0.15),transparent_32%),linear-gradient(180deg,#06101c_0%,#11172a_58%,#03070d_100%)]"
      badges={[
        { label: 'Ayna', value: `${Math.round(measure.mirrorPower * 100)}%`, tone: missionOk ? 'green' : 'amber' },
        { label: 'Taban', value: `a=${measure.base.toFixed(2)}`, tone: measure.mode === 'decay' ? 'purple' : 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <LogMirrorScene
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
        <LogMirrorControls
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
