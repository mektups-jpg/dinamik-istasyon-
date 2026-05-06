import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { DiagnosticControls } from './DiagnosticControls';
import { DiagnosticScene } from './DiagnosticScene';
import { DiagnosticDragTarget, DiagnosticState, SpecialQuadKind } from './types';
import {
  clamp,
  diagnosticFrame,
  diagnosticTargets,
  initialDiagnosticState,
  isTargetMatched,
  measureDiagnostic,
  railXToProgress,
  roundProgress,
} from './diagnosticModel';

const MODULE_ID = 'special-quadrilateral-diagnostic-table';

const ATOM_IDS = ['MAT.11.2.2.1', 'MAT.11.2.2.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'side-signature',
    title: 'Kenar İzi',
    atomId: 'MAT.11.2.2.1',
    prompt: 'Kenar tarayıcısını sona taşı. Dört kenar eşit ama dik açı yoksa doğru özel dörtgen kilidini seç.',
  },
  {
    id: 'diagonal-signature',
    title: 'Köşegen İzi',
    atomId: 'MAT.11.2.2.2',
    prompt: 'Köşegen tarayıcısını sona taşı. Eşit köşegen ve orta kesişim izini doğru dörtgen kilidine bağla.',
  },
];

export default function SpecialQuadrilateralDiagnosticTableApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<DiagnosticState>(initialDiagnosticState);
  const [dragTarget, setDragTarget] = useState<DiagnosticDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = diagnosticTargets[activeIndex];
  const measure = measureDiagnostic(state, target);
  const missionOk = isTargetMatched(state, target);

  const resetPanel = () => {
    setState(activeIndex === 0 ? initialDiagnosticState : { sideScan: 1, diagonalScan: 0.08, selectedKind: null });
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialDiagnosticState);
    setDragTarget(null);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: DiagnosticDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    const nextProgress = railXToProgress(transformed.x);

    setState((current) => ({
      ...current,
      [nextTarget === 'side-scanner' ? 'sideScan' : 'diagonalScan']: nextProgress,
    }));
  };

  const handlePointerDown = (nextTarget: DiagnosticDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (keyTarget: DiagnosticDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({
        ...current,
        [keyTarget === 'side-scanner' ? 'sideScan' : 'diagonalScan']: 1,
      }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.shiftKey ? 0.12 : 0.04;
    const signedDelta = event.key === 'ArrowRight' ? delta : -delta;
    setState((current) => {
      const key = keyTarget === 'side-scanner' ? 'sideScan' : 'diagonalScan';
      return { ...current, [key]: roundProgress(clamp(current[key] + signedDelta)) };
    });
  };

  const prepareNextMission = () => {
    setState({ sideScan: 1, diagonalScan: 0.08, selectedKind: null });
    setDragTarget(null);
  };

  const handleSelectKind = (kind: SpecialQuadKind) => {
    setState((current) => ({ ...current, selectedKind: kind }));
  };

  const handleCheck = () => {
    const squareRhombusWarning = target.kind === 'sides' && state.selectedKind === 'square'
      ? ' Kare de 4 eşit kenara sahip olabilir; bu numunede dik açı yok, bu yüzden eşkenar dörtgen kilidi gerekir.'
      : '';
    const accepted = progress.submitMission({
      ok: missionOk,
      success: 'Kenar izi doğru sınıflandırıldı. Şimdi köşegen kimliğini tara.',
      error: `Tanı masası hedefte değil. ${target.hint}${squareRhombusWarning}`,
    });

    if (accepted && activeIndex === 0) {
      prepareNextMission();
    }
  };

  return (
    <HighSchoolLabShell
      title="Özel Dörtgen Tanı Masası"
      subtitle="MAT.11.2.2"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#061016] [background-image:radial-gradient(circle_at_18%_14%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(167,139,250,0.14),transparent_32%),linear-gradient(180deg,#061016_0%,#0d1628_56%,#03070d_100%)]"
      badges={[
        { label: 'Tarama', value: `%${Math.round(measure.scanProgress * 100)}`, tone: missionOk ? 'green' : 'cyan' },
        { label: 'Kilit', value: measure.selectedLabel, tone: missionOk ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <DiagnosticScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          onSelectKind={handleSelectKind}
        />
        <DiagnosticControls
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
