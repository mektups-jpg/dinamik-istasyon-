import { useEffect, useMemo, useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { RealNumberLawControls } from './RealNumberLawControls';
import { RealNumberLawScene } from './RealNumberLawScene';
import { atlasExampleSetCount, atomIds, autoBuildFor, buildMatches, createAtlasMissions, initialBuild, MODULE_ID, nextBuild, pickAtlasExampleSetIndex } from './realNumberLawModel';
import { BuildKey, LawBuild } from './types';

function getFixedExampleSetIndex() {
  if (typeof window === 'undefined') return null;

  const rawIndex = new URLSearchParams(window.location.search).get('exampleSet');
  if (rawIndex === null) return null;

  const parsedIndex = Number(rawIndex);
  return Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < atlasExampleSetCount ? parsedIndex : null;
}

function createExampleRotation(fixedExampleSetIndex: number | null) {
  const activeIndex = fixedExampleSetIndex ?? pickAtlasExampleSetIndex();
  return {
    activeIndex,
    usedIndexes: [activeIndex],
  };
}

export default function RealNumberLawAtlasApp() {
  const fixedExampleSetIndex = getFixedExampleSetIndex();
  const [exampleRotation, setExampleRotation] = useState(() => createExampleRotation(fixedExampleSetIndex));
  const atlasMissions = useMemo(() => createAtlasMissions(exampleRotation.activeIndex), [exampleRotation.activeIndex]);
  const missions: MissionStep[] = useMemo(() => atlasMissions.map(({ id, title, atomId, prompt }) => ({ id, title, atomId, prompt })), [atlasMissions]);
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions, completionAtomIds: atomIds });
  const [build, setBuild] = useState<LawBuild>(initialBuild);
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const mission = atlasMissions[progress.activeIndex];
  const matched = buildMatches(build, mission);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(initialBuild);
    setLockedMissionId(null);
  }, [progress.activeIndex]);

  const resetPanel = () => {
    setBuild(initialBuild);
    setLockedMissionId(null);
  };

  const restart = () => {
    resetPanel();
    if (fixedExampleSetIndex === null) {
      setExampleRotation((current) => {
        const usedIndexes = current.usedIndexes.length >= atlasExampleSetCount ? [current.activeIndex] : current.usedIndexes;
        const nextIndex = pickAtlasExampleSetIndex(usedIndexes);
        return {
          activeIndex: nextIndex,
          usedIndexes: [...usedIndexes, nextIndex],
        };
      });
    }
    progress.restart();
  };

  const toggleBuild = (key: BuildKey) => {
    setLockedMissionId(null);
    setBuild((current) => nextBuild(current, key));
  };

  const handleAutoAlign = () => {
    setLockedMissionId(null);
    setBuild(autoBuildFor(mission));
  };

  const handleCheck = () => {
    if (matched) setLockedMissionId(mission.id);
    window.setTimeout(() => {
      progress.submitMission({
        ok: matched,
        success: mission.success,
        error: mission.error,
      });
    }, matched ? 260 : 0);
  };

  return (
    <Grade9LabShell
      title="Gerçek Sayı Atlası ve İşlem Yasaları"
      subtitle="MAT.9.1.4.x / MAT.9.1.5.x"
      moduleId={MODULE_ID}
      missions={missions}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#030713] [background-image:radial-gradient(circle_at_16%_12%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(0,255,136,0.12),transparent_27%),radial-gradient(circle_at_48%_96%,rgba(167,139,250,0.10),transparent_34%),linear-gradient(180deg,#030713_0%,#071425_56%,#03050c_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${missions.length}`, tone: 'cyan' },
        { label: 'Odak', value: mission.kind === 'distributive' ? 'dağılma' : mission.kind === 'associative' ? 'birleşme' : 'küme', tone: 'green' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'purple' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <RealNumberLawScene
          mission={mission}
          build={build}
          matched={matched}
          locked={locked}
          onToggle={toggleBuild}
          onAutoAlign={handleAutoAlign}
        />
        <RealNumberLawControls
          missionStep={progress.activeMission}
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          matched={matched}
          locked={locked}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
