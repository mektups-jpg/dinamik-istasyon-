import { useEffect, useMemo, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { AlgorithmFlowControls } from './AlgorithmFlowControls';
import { AlgorithmFlowScene } from './AlgorithmFlowScene';
import {
  MODULE_ID,
  atomIds,
  buildMatches,
  completedSlotCount,
  FLOW_MISSION_SET_COUNT,
  getFlowMissions,
  initialBuildFor,
  placeBlock,
  removeSlot,
} from './algorithmFlowModel';
import type { FlowBlockId, FlowBuild } from './types';

const missionSetStorageKey = `${MODULE_ID}:mission-set-index`;

function normalizeMissionSetIndex(index: number): number {
  return ((index % FLOW_MISSION_SET_COUNT) + FLOW_MISSION_SET_COUNT) % FLOW_MISSION_SET_COUNT;
}

function readPinnedMissionSetIndex(): number | null {
  if (typeof window === 'undefined') return null;
  const rawMissionSet = new URLSearchParams(window.location.search).get('missionSet');
  if (rawMissionSet === null) return null;
  const parsed = Number(rawMissionSet);
  return Number.isInteger(parsed) ? normalizeMissionSetIndex(parsed) : null;
}

function readInitialMissionSetIndex(): number {
  const pinnedMissionSet = readPinnedMissionSetIndex();
  if (pinnedMissionSet !== null) return pinnedMissionSet;
  if (typeof window === 'undefined') return 0;

  const stored = Number(window.sessionStorage.getItem(missionSetStorageKey));
  const nextIndex = Number.isInteger(stored) ? normalizeMissionSetIndex(stored + 1) : Math.floor(Math.random() * FLOW_MISSION_SET_COUNT);
  window.sessionStorage.setItem(missionSetStorageKey, String(nextIndex));
  return nextIndex;
}

function getNextMissionSetIndex(currentIndex: number): number {
  const pinnedMissionSet = readPinnedMissionSetIndex();
  if (pinnedMissionSet !== null) return pinnedMissionSet;
  const nextIndex = normalizeMissionSetIndex(currentIndex + 1);
  if (typeof window !== 'undefined') window.sessionStorage.setItem(missionSetStorageKey, String(nextIndex));
  return nextIndex;
}

function toMissionSteps(missions: ReturnType<typeof getFlowMissions>): MissionStep[] {
  return missions.map(({ id, title, atomId, story }) => ({
    id,
    title,
    atomId,
    prompt: story,
  }));
}

export default function AlgorithmFlowLineApp() {
  const [missionSetIndex, setMissionSetIndex] = useState(readInitialMissionSetIndex);
  const missions = useMemo(() => getFlowMissions(missionSetIndex), [missionSetIndex]);
  const missionSteps = useMemo(() => toMissionSteps(missions), [missions]);
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: missionSteps, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const mission = missions[progress.activeIndex] ?? missions[0];
  const [build, setBuild] = useState<FlowBuild>(() => initialBuildFor(mission));
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const [orderWarning, setOrderWarning] = useState(false);
  const matched = buildMatches(build, mission);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(initialBuildFor(mission));
    setLockedMissionId(null);
    setOrderWarning(false);
  }, [mission]);

  const resetPanel = () => {
    setBuild(initialBuildFor(mission));
    setLockedMissionId(null);
    setOrderWarning(false);
  };

  const restart = () => {
    resetPanel();
    setMissionSetIndex((currentIndex) => getNextMissionSetIndex(currentIndex));
    progress.restart();
  };

  const handlePlaceBlock = (blockId: FlowBlockId) => {
    setLockedMissionId(null);
    setOrderWarning(false);
    setBuild((current) => {
      const next = placeBlock(current, blockId);
      if (next !== current) showMessage('Blok akış hattına yerleşti.', 'info');
      return next;
    });
  };

  const handleRemoveSlot = (index: number) => {
    setLockedMissionId(null);
    setOrderWarning(false);
    setBuild((current) => removeSlot(current, index));
    showMessage('Seçilen adımdan sonrası temizlendi; doğru sıradan devam et.', 'info');
  };

  const handleAutoAlign = () => {
    setLockedMissionId(null);
    setOrderWarning(false);
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
      setOrderWarning(false);
      showMessage(mission.success, 'success');
      return;
    }

    const missing = completedSlotCount(build) < mission.target.length;
    setOrderWarning(!missing);
    progress.submitMission({
      ok: false,
      success: mission.success,
      error: missing ? 'Akış hattında boş yuva kaldı. Problemi adım adım tamamla.' : mission.error,
    });
  };

  return (
    <Grade9LabShell
      title="Problemi Adımlara Ayır"
      subtitle="MAT.9.3.1.1"
      moduleId={MODULE_ID}
      missions={missionSteps}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#020712] [background-image:radial-gradient(circle_at_18%_14%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(0,255,136,0.12),transparent_26%),radial-gradient(circle_at_52%_94%,rgba(251,191,36,0.09),transparent_34%),linear-gradient(180deg,#020712_0%,#061321_58%,#02040b_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${missionSteps.length}`, tone: 'cyan' },
        { label: 'Blok', value: `${completedSlotCount(build)}/${mission.target.length}`, tone: matched ? 'green' : 'purple' },
        { label: 'Sonuç', value: locked ? 'açık' : matched ? 'kontrol' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <AlgorithmFlowScene
          mission={mission}
          build={build}
          locked={locked}
          orderWarning={orderWarning}
          onPlaceBlock={handlePlaceBlock}
          onRemoveSlot={handleRemoveSlot}
          onAutoAlign={handleAutoAlign}
          onCheck={handleCheck}
        />
        <AlgorithmFlowControls
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          totalMissions={missionSteps.length}
          matched={matched}
          locked={locked}
          orderWarning={orderWarning}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
