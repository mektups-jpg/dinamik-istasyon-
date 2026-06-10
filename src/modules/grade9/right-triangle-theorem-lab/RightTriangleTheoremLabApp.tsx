import { useEffect, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { RightTriangleTheoremControls } from './RightTriangleTheoremControls';
import { RightTriangleTheoremScene } from './RightTriangleTheoremScene';
import {
  MODULE_ID,
  atomIds,
  autoBuildFor,
  buildMatches,
  initialBuild,
  theoremMissions,
  toggleTool,
} from './rightTriangleTheoremModel';
import type { TheoremBuild, TheoremToolId } from './types';

const MISSIONS: MissionStep[] = theoremMissions.map(({ id, title, atomId, prompt }) => ({
  id,
  title,
  atomId,
  prompt,
}));

export default function RightTriangleTheoremLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const mission = theoremMissions[progress.activeIndex];
  const [build, setBuild] = useState<TheoremBuild>(() => initialBuild());
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

  const handleToggleTool = (toolId: TheoremToolId) => {
    setLockedMissionId(null);
    setBuild((current) => toggleTool(current, toolId));
    showMessage('Teorem parçası sahneye bağlandı; ışıklı kanıt hattını izle.', 'info');
  };

  const handleAutoBuild = () => {
    setLockedMissionId(null);
    setBuild(autoBuildFor(mission));
    showMessage('Laboratuvar hedef kanıt düzenine hizalandı; şimdi testi çalıştır.', 'info');
  };

  const errorMessage = () => {
    if (build.selectedTools.length === 0) return 'Önce sahnede bir teorem parçası seç.';
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
      title="Dik Üçgen Teorem Laboratuvarı"
      subtitle="MAT.9.5.3.1-3"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#04101a] [background-image:radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(16,185,129,0.13),transparent_28%),radial-gradient(circle_at_50%_94%,rgba(251,191,36,0.08),transparent_34%),linear-gradient(180deg,#04101a_0%,#061822_58%,#02070d_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'cyan' },
        { label: 'Teorem', value: mission.mode === 'tales' ? 'Tales' : mission.mode === 'euclid' ? 'Öklid' : 'Pisagor', tone: 'green' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RightTriangleTheoremScene
          mission={mission}
          build={build}
          locked={locked}
          onToggleTool={handleToggleTool}
          onAutoBuild={handleAutoBuild}
        />
        <RightTriangleTheoremControls
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
