import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { InequalitySafetyControls } from './InequalitySafetyControls';
import { InequalitySafetyScene } from './InequalitySafetyScene';
import {
  MODULE_ID,
  atomIds,
  buildInequalityLabel,
  buildMatches,
  createSafetyMissions,
  initialBuild,
  nudgeBoundary,
  pickSafetyMissionSetIndex,
  safetyMissionSetCount,
  xToValue,
} from './safetyZoneModel';
import { SafetyBuild, SafetyDirection } from './types';

const SAFETY_MISSION_SET_STORAGE_KEY = 'inequality-safety-zone-mission-set';

function getLockedMissionSetIndex() {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const shouldLockMissionSet = searchParams.get('lockMissionSet') === '1';
  if (!shouldLockMissionSet) return null;

  const rawIndex = searchParams.get('missionSet');
  if (rawIndex === null) return null;

  const parsedIndex = Number(rawIndex);
  return Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < safetyMissionSetCount ? parsedIndex : null;
}

function getStoredMissionSetIndex() {
  if (typeof window === 'undefined') return null;

  const rawIndex = window.sessionStorage.getItem(SAFETY_MISSION_SET_STORAGE_KEY);
  if (rawIndex === null) return null;

  const parsedIndex = Number(rawIndex);
  return Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < safetyMissionSetCount ? parsedIndex : null;
}

function rememberMissionSetIndex(index: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SAFETY_MISSION_SET_STORAGE_KEY, String(index));
}

function createMissionRotation(lockedMissionSetIndex: number | null) {
  if (lockedMissionSetIndex !== null) {
    return {
      activeIndex: lockedMissionSetIndex,
      usedIndexes: [lockedMissionSetIndex],
    };
  }

  const previousIndex = getStoredMissionSetIndex();
  const activeIndex = pickSafetyMissionSetIndex(previousIndex === null ? [] : [previousIndex]);
  rememberMissionSetIndex(activeIndex);

  return {
    activeIndex,
    usedIndexes: [activeIndex],
  };
}

export default function InequalitySafetyZoneApp() {
  const lockedMissionSetIndex = getLockedMissionSetIndex();
  const [missionRotation, setMissionRotation] = useState(() => createMissionRotation(lockedMissionSetIndex));
  const safetyMissions = useMemo(() => createSafetyMissions(missionRotation.activeIndex), [missionRotation.activeIndex]);
  const missions: MissionStep[] = useMemo(
    () => safetyMissions.map(({ id, title, atomId, ruleHint }) => ({ id, title, atomId, prompt: ruleHint })),
    [safetyMissions],
  );
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions, completionAtomIds: atomIds });
  const { showMessage } = useAstroBotStore();
  const [build, setBuild] = useState<SafetyBuild>(initialBuild);
  const [dragging, setDragging] = useState(false);
  const [lockedMissionId, setLockedMissionId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mission = safetyMissions[progress.activeIndex];
  const matched = buildMatches(build, mission.target);
  const locked = lockedMissionId === mission.id;

  useEffect(() => {
    setBuild(initialBuild);
    setDragging(false);
    setLockedMissionId(null);
  }, [progress.activeIndex]);

  const resetPanel = () => {
    setBuild(initialBuild);
    setDragging(false);
    setLockedMissionId(null);
  };

  const restart = () => {
    resetPanel();
    if (lockedMissionSetIndex === null) {
      setMissionRotation((current) => {
        const usedIndexes = current.usedIndexes.length >= safetyMissionSetCount ? [current.activeIndex] : current.usedIndexes;
        const nextIndex = pickSafetyMissionSetIndex(usedIndexes);
        rememberMissionSetIndex(nextIndex);

        return {
          activeIndex: nextIndex,
          usedIndexes: [...usedIndexes, nextIndex],
        };
      });
    }
    progress.restart();
  };

  const updateBoundaryFromPointer = (event: ReactPointerEvent<SVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    const svg = svgRef.current;
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, boundary: xToValue(transformed.x) }));
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateBoundaryFromPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGElement>) => {
    if (!dragging) return;
    updateBoundaryFromPointer(event);
  };

  const handlePointerUp = () => {
    if (dragging) showMessage('Sınır işareti yeni sayıya taşındı.', 'info');
    setDragging(false);
  };

  const alignToTarget = () => {
    setLockedMissionId(null);
    setBuild(mission.target);
    showMessage('Güvenlik alanı hedef düzene hizalandı; şimdi testi çalıştır.', 'info');
  };

  const handleBoundaryKeyDown = (event: KeyboardEvent<SVGElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      alignToTarget();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setLockedMissionId(null);
      setBuild((current) => nudgeBoundary(current, event.key === 'ArrowLeft' ? -1 : 1));
    }
  };

  const handleSelectDirection = (direction: SafetyDirection) => {
    setLockedMissionId(null);
    setBuild((current) => ({ ...current, direction }));
    showMessage(direction === 'left' ? 'Güvenli alan sınırdan sola açıldı.' : 'Güvenli alan sınırdan sağa açıldı.', 'info');
  };

  const handleCheck = () => {
    if (locked) {
      progress.submitMission({
        ok: true,
        success: progress.activeIndex >= missions.length - 1 ? mission.success : 'Yeni görev açıldı; bu kez sınırı modelden sen kur.',
        error: mission.error,
      });
      return;
    }

    if (!build.direction) {
      showMessage('Önce çözüm bölgesinin sola mı sağa mı açılacağını seç.', 'error');
      return;
    }

    if (!matched) {
      progress.submitMission({
        ok: false,
        success: mission.success,
        error: mission.error,
      });
      return;
    }

    setLockedMissionId(mission.id);
    showMessage(mission.success, 'success');
  };

  return (
    <Grade9LabShell
      title="Eşitsizlik Güvenlik Alanı"
      subtitle={atomIds.join(' / ')}
      moduleId={MODULE_ID}
      missions={missions}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#030713] [background-image:radial-gradient(circle_at_16%_14%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(0,255,136,0.12),transparent_27%),radial-gradient(circle_at_46%_92%,rgba(179,136,255,0.10),transparent_34%),linear-gradient(180deg,#030713_0%,#071425_56%,#03050c_100%)]"
      badges={[
        { label: 'Görev', value: `${progress.activeIndex + 1}/${missions.length}`, tone: 'cyan' },
        { label: 'Seçim', value: buildInequalityLabel(build), tone: matched ? 'green' : 'purple' },
        { label: 'Mühür', value: locked ? 'açık' : matched ? 'hazır' : 'bekliyor', tone: locked || matched ? 'green' : 'amber' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <InequalitySafetyScene
          mission={mission}
          build={build}
          matched={matched}
          locked={locked}
          svgRef={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onBoundaryKeyDown={handleBoundaryKeyDown}
          onSelectDirection={handleSelectDirection}
        />
        <InequalitySafetyControls
          missionStep={progress.activeMission}
          mission={mission}
          build={build}
          activeIndex={progress.activeIndex}
          totalMissions={missions.length}
          matched={matched}
          locked={locked}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
