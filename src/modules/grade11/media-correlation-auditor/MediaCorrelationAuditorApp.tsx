import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HighSchoolLabShell, MissionStep, useHighSchoolMissionProgress } from '../../high-school/shared/HighSchoolLabShell';
import { MediaAuditControls } from './MediaAuditControls';
import { MediaAuditScene } from './MediaAuditScene';
import { AuditDragTarget, MediaAuditState } from './types';
import {
  initialMediaAuditState,
  isMediaAuditTargetMatched,
  measureEvidence,
  mediaAuditFrame,
  mediaAuditTargets,
  prepareMediaMission,
  roundProgress,
  xToProgress,
} from './mediaAuditModel';

const MODULE_ID = 'media-correlation-auditor';

const ATOM_IDS = ['MAT.11.3.2.1'];

const MISSIONS: MissionStep[] = [
  {
    id: 'evidence-trace',
    title: 'İz Uyumunu Tara',
    atomId: 'MAT.11.3.2.1',
    prompt: 'Denetim merceğini veri izinin sonuna taşı. Hazır veri iddianın yönüyle gerçekten uyumlu mu?',
  },
  {
    id: 'causation-alarm',
    title: 'Nedensellik Alarmı',
    atomId: 'MAT.11.3.2.1',
    prompt: 'İddia kartındaki fazla güçlü sebep-sonuç kelimesini işaretle.',
  },
  {
    id: 'safe-conclusion',
    title: 'Güvenli Sonuç Mührü',
    atomId: 'MAT.11.3.2.1',
    prompt: 'Mührü güvenli sonuca taşı. Veri ilişki gösterir, tek başına neden-sonuç kanıtı kurmaz.',
  },
];

export default function MediaCorrelationAuditorApp() {
  const progress = useHighSchoolMissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<MediaAuditState>(initialMediaAuditState);
  const [dragTarget, setDragTarget] = useState<AuditDragTarget | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activeIndex = progress.activeIndex;
  const target = mediaAuditTargets[activeIndex];
  const measure = measureEvidence(state);
  const missionOk = isMediaAuditTargetMatched(state, target);

  const resetPanel = () => {
    setState(prepareMediaMission(target));
    setDragTarget(null);
  };

  const restart = () => {
    setState(initialMediaAuditState);
    setDragTarget(null);
    progress.restart();
  };

  const updateFromPointer = (event: ReactPointerEvent<SVGElement>, nextTarget: AuditDragTarget | null = dragTarget) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!svgRef.current || !matrix || !nextTarget) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());

    if (nextTarget === 'lens') {
      setState((current) => ({
        ...current,
        lensProgress: xToProgress(transformed.x, mediaAuditFrame.railX, mediaAuditFrame.railWidth),
      }));
      return;
    }

    setState((current) => ({
      ...current,
      conclusionProgress: xToProgress(transformed.x, mediaAuditFrame.sealX, mediaAuditFrame.sealWidth),
    }));
  };

  const handlePointerDown = (nextTarget: AuditDragTarget, event: ReactPointerEvent<SVGElement>) => {
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

  const handleKeyDown = (keyTarget: AuditDragTarget, event: ReactKeyboardEvent<SVGGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      setState((current) => ({
        ...current,
        [keyTarget === 'lens' ? 'lensProgress' : 'conclusionProgress']: 1,
      }));
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 0.06 : -0.06;
    setState((current) => ({
      ...current,
      [keyTarget === 'lens' ? 'lensProgress' : 'conclusionProgress']: roundProgress(
        (keyTarget === 'lens' ? current.lensProgress : current.conclusionProgress) + delta,
      ),
    }));
  };

  const prepareNextMission = () => {
    const nextTarget = mediaAuditTargets[activeIndex + 1];
    if (!nextTarget) return;
    setState(prepareMediaMission(nextTarget));
    setDragTarget(null);
  };

  const handleCheck = () => {
    const accepted = progress.submitMission({
      ok: missionOk,
      success: activeIndex === 2 ? 'Sonuç dili güvenli hale geldi.' : 'Denetim katmanı geçti. Bir sonraki zayıf noktayı incele.',
      error: `Denetim henüz güvenli değil. ${target.hint}`,
    });

    if (accepted && activeIndex < MISSIONS.length - 1) {
      prepareNextMission();
    }
  };

  return (
    <HighSchoolLabShell
      title="Medya Korelasyon Denetçisi"
      subtitle="MAT.11.3.2"
      moduleId={MODULE_ID}
      gradeLabel="11. SINIF"
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#06170f] [background-image:radial-gradient(circle_at_18%_14%,rgba(52,211,153,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.13),transparent_32%),linear-gradient(180deg,#06170f_0%,#0b1c2a_56%,#02070d_100%)]"
      badges={[
        { label: 'Veri', value: measure.direction, tone: missionOk ? 'green' : 'amber' },
        { label: 'Alarm', value: state.causationFlagged ? 'işaretli' : 'açık', tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <MediaAuditScene
          state={state}
          target={target}
          measure={measure}
          missionOk={missionOk}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          onFlagWord={() => setState((current) => ({ ...current, causationFlagged: true }))}
        />
        <MediaAuditControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          target={target}
          measure={measure}
          missionOk={missionOk}
          causationFlagged={state.causationFlagged}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </HighSchoolLabShell>
  );
}
