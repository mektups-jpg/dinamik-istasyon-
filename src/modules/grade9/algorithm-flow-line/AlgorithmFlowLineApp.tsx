import { useEffect, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { AlgorithmFlowControls } from './AlgorithmFlowControls';
import { AlgorithmFlowScene } from './AlgorithmFlowScene';
import {
  MODULE_ID,
  atomIds,
  buildMatches,
  completedSlotCount,
  flowMissions,
  initialBuildFor,
  placeBlock,
  removeSlot,
} from './algorithmFlowModel';
import type { FlowBlockId, FlowBuild } from './types';

const MISSIONS: MissionStep[] = flowMissions.map(({ id, title, atomId, story }) => ({
  id,
  title,
  atomId,
  prompt: story,
}));

export default function AlgorithmFlowLineApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const mission = flowMissions[progress.activeIndex];
  const [build, setBuild] = useState<FlowBuild>(() => initialBuildFor(mission));
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const matched = buildMatches(build, mission);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(initialBuildFor(mission));
    setLockedMissionId(null);
  }, [mission]);

  const resetPanel = () => {
    setBuild(initialBuildFor(mission));
    setLockedMissionId(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handlePlaceBlock = (blockId: FlowBlockId) => {
    setLockedMissionId(null);
    setBuild((current) => {
      const next = placeBlock(current, blockId);
      if (next !== current) showMessage('Blok akış hattına yerleşti.', 'info');
      return next;
    });
  };

  const handleRemoveSlot = (index: number) => {
    setLockedMissionId(null);
    setBuild((current) => removeSlot(current, index));
    showMessage('Akış bloğu havuza döndü.', 'info');
  };

  const handleAutoAlign = () => {
    setLockedMissionId(null);
    setBuild({ slots: [...mission.target] });
    showMessage('Akış hedef sıraya hizalandı; şimdi testi çalıştır.', 'info');
  };

  const handleCheck = () => {
    if (locked && matched) {
      progress.submitMission({
        ok: true,
        success: mission.success,
        error: mission.error,
      });
      return;
    }

    if (matched) {
      setLockedMissionId(mission.id);
      showMessage(mission.success, 'success');
      return;
    }

    const missing = completedSlotCount(build) < mission.target.length;
    progress.submitMission({
      ok: false,
      success: mission.success,
      error: missing ? 'Akış hattında boş yuva kaldı. Problemi adım adım tamamla.' : mission.error,
    });
  };

  return (
    <Grade9LabShell
      title="Algoritma Akış Hattı"
      subtitle="MAT.9.3.1.1"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#020712] [background-image:radial-gradient(circle_at_18%_14%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(0,255,136,0.12),transparent_26%),radial-gradient(circle_at_52%_94%,rgba(251,191,36,0.09),transparent_34%),linear-gradient(180deg,#020712_0%,#061321_58%,#02040b_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
        { label: 'Blok', value: `${completedSlotCount(build)}/${mission.target.length}`, tone: matched ? 'green' : 'purple' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AlgorithmFlowScene
          mission={mission}
          build={build}
          locked={locked}
          onPlaceBlock={handlePlaceBlock}
          onRemoveSlot={handleRemoveSlot}
          onAutoAlign={handleAutoAlign}
        />
        <AlgorithmFlowControls
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          totalMissions={MISSIONS.length}
          matched={matched}
          locked={locked}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
