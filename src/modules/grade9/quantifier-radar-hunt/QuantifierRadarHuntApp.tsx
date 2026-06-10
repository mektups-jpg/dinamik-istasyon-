import { useEffect, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { QuantifierRadarControls } from './QuantifierRadarControls';
import { QuantifierRadarScene } from './QuantifierRadarScene';
import {
  MODULE_ID,
  atomIds,
  autoBuildFor,
  buildMatches,
  initialBuild,
  quantifierLabels,
  radarMissions,
  toggleElement,
} from './quantifierRadarModel';
import type { Quantifier, RadarBuild, RadarElementId } from './types';

const MISSIONS: MissionStep[] = radarMissions.map(({ id, title, atomId, prompt }) => ({
  id,
  title,
  atomId,
  prompt,
}));

export default function QuantifierRadarHuntApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const mission = radarMissions[progress.activeIndex];
  const [build, setBuild] = useState<RadarBuild>(() => initialBuild());
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

  const handleSetQuantifier = (quantifier: Quantifier) => {
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, quantifier }));
    const item = quantifierLabels[quantifier];
    showMessage(`${item.label} radarı seçildi; şimdi kümeden kanıt elemanlarını tara.`, 'info');
  };

  const handleToggleElement = (elementId: RadarElementId) => {
    setLockedMissionId(null);
    setBuild((current) => toggleElement(current, elementId));
    showMessage('Eleman kanıt hattına alındı veya hattan çıkarıldı.', 'info');
  };

  const handleAutoAlign = () => {
    setLockedMissionId(null);
    setBuild(autoBuildFor(mission));
    showMessage('Radar hedef niceleyiciye ve kanıta hizalandı; şimdi testi çalıştır.', 'info');
  };

  const errorMessage = () => {
    if (!build.quantifier) return 'Önce Her veya Bazı niceleyicisini seç.';
    if (build.selectedIds.length === 0) return 'Kümeden en az bir kanıt elemanı tara.';
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
      title="Niceleyici Radar Avı"
      subtitle="MAT.9.3.3.1-2"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#020712] [background-image:radial-gradient(circle_at_20%_12%,rgba(190,242,100,0.14),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(0,229,255,0.13),transparent_28%),radial-gradient(circle_at_50%_94%,rgba(0,255,136,0.08),transparent_34%),linear-gradient(180deg,#020712_0%,#06131d_58%,#02040b_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
        { label: 'Niceleyici', value: build.quantifier ? quantifierLabels[build.quantifier].label : 'seçilmedi', tone: build.quantifier ? 'cyan' : 'amber' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <QuantifierRadarScene
          mission={mission}
          build={build}
          locked={locked}
          onToggleElement={handleToggleElement}
          onAutoAlign={handleAutoAlign}
        />
        <QuantifierRadarControls
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          totalMissions={MISSIONS.length}
          matched={matched}
          locked={locked}
          onSetQuantifier={handleSetQuantifier}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
