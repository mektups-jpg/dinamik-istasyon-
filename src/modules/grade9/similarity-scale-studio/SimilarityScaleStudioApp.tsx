import { useEffect, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { SimilarityScaleControls } from './SimilarityScaleControls';
import { SimilarityScaleScene } from './SimilarityScaleScene';
import {
  MODULE_ID,
  atomIds,
  autoBuildFor,
  buildMatches,
  initialBuild,
  similarityMissions,
  togglePair,
} from './similarityScaleModel';
import type { SimilarityBuild, SimilarityPairId } from './types';

const MISSIONS: MissionStep[] = similarityMissions.map(({ id, title, atomId, prompt }) => ({
  id,
  title,
  atomId,
  prompt,
}));

export default function SimilarityScaleStudioApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const mission = similarityMissions[progress.activeIndex];
  const [build, setBuild] = useState<SimilarityBuild>(() => initialBuild());
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const matched = buildMatches(build, mission);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(initialBuild());
    setLockedMissionId(null);
  }, [mission]);

  const resetPanel = () => {
    setBuild(initialBuild());
    setLockedMissionId(null);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handleTogglePair = (pairId: SimilarityPairId) => {
    setLockedMissionId(null);
    setBuild((current) => togglePair(current, pairId));
    showMessage('Kanıt parçası sahnedeki eşleştirme çizgisine bağlandı.', 'info');
  };

  const handleSetScale = (scale: number) => {
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, scale }));
    showMessage(`Ölçek k=${scale} seçildi; kenar çiftlerini aynı katsayıya bağla.`, 'info');
  };

  const handleAutoAlign = () => {
    setLockedMissionId(null);
    setBuild(autoBuildFor(mission));
    showMessage('Stüdyo hedef kanıt düzenine hizalandı; şimdi testi çalıştır.', 'info');
  };

  const errorMessage = () => {
    if (mission.mode === 'ratio' && build.scale === null) return 'Önce ortak ölçek katsayısını seç.';
    if (build.selectedPairs.length === 0) return 'Önce sahnede kanıt parçası seç.';
    return mission.error;
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

    progress.submitMission({
      ok: false,
      success: mission.success,
      error: errorMessage(),
    });
  };

  return (
    <Grade9LabShell
      title="Benzerlik Ölçek Stüdyosu"
      subtitle="MAT.9.5.2.1-2"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#03110f] [background-image:radial-gradient(circle_at_18%_14%,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(251,191,36,0.13),transparent_28%),radial-gradient(circle_at_50%_94%,rgba(0,255,136,0.08),transparent_34%),linear-gradient(180deg,#03110f_0%,#071714_58%,#020605_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
        { label: 'Kanıt', value: mission.mode === 'angles' ? 'açı' : 'oran', tone: 'cyan' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <SimilarityScaleScene
          mission={mission}
          build={build}
          locked={locked}
          onTogglePair={handleTogglePair}
          onSetScale={handleSetScale}
          onAutoAlign={handleAutoAlign}
        />
        <SimilarityScaleControls
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
