import { useEffect, useMemo, useState } from 'react';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { SequenceWheelControls } from './SequenceWheelControls';
import { SequenceWheelCompletion } from './SequenceWheelCompletion';
import { SequenceWheelScene } from './SequenceWheelScene';
import {
  ATOM_IDS,
  MODULE_ID,
  modeCopy,
  sequenceMissions,
  TEST_ID_CONTRACT,
  WheelMode,
} from './sequenceWheelModel';

export default function SequenceWheelApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<WheelMode | null>(null);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('İlk rayda sabit farkı ara: komşu kapsüller aynı miktarda mı artıyor?');

  const mission = sequenceMissions[missionIndex];

  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Kural kilitlendi; aynı bakışı sonraki raya taşı.'
    : selectedMode === null
      ? 'Önce bir mercek seç: fark mı, oran mı, ayrık adım mı?'
    : status === 'error'
      ? 'Sabit kalmayan izleri sahnede karşılaştır, sonra doğru merceği seç.'
      : 'Bu dizinin motoru fark mı, oran mı, ayrık adım mı?';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseMode = (nextMode: WheelMode) => {
    setSelectedMode(nextMode);
    setSolved(false);
    setStatus('info');
    setFeedback(modeCopy[nextMode].feedback);
    showMessage(modeCopy[nextMode].feedback, 'info');
  };

  const nudge = (direction: -1 | 1) => {
    setOffset((current) => Math.max(-1, Math.min(1, current + direction)));
    setStatus('idle');
    setFeedback(direction > 0 ? 'Ray sağa alındı; kapsüller hâlâ okunuyorsa sahne dengede.' : 'Ray sola alındı; kapsüller kırpılmadan aynı hizada kalmalı.');
  };

  const resetOffset = () => {
    setOffset(0);
    setStatus('idle');
    setFeedback('Ray merkeze döndü. Klavyede Home, sağ/sol oklar da bu sahneyi kontrol eder.');
  };

  const checkAnswer = () => {
    if (selectedMode === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir mercek seç: bu ray farkla mı, oranla mı, ayrık adımla mı çalışıyor?');
      showMessage('Önce bir mercek seç; sonra çarkı kilitle.', 'error');
      return;
    }

    if (selectedMode !== mission.expectedMode) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedMode]);
      showMessage(mission.failure[selectedMode], 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === sequenceMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(120);
      setCompleted(true);
      showMessage('Dizi çarkı kilitlendi. Üç bakış ikişer örnekle tamamlandı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = sequenceMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedMode(null);
    setOffset(0);
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    showMessage(nextMissionItem.prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedMode(null);
    setOffset(0);
    setStatus('info');
    setSolved(false);
    setCompleted(false);
    setFeedback('İlk rayda sabit farkı ara: komşu kapsüller aynı miktarda mı artıyor?');
    showMessage('Dizi çarkı sıfırlandı. İlk rayda sabit farkı ara.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Dizi Çarkı"
      subtitle="MAT.12.1.1.1-3"
      statusLabel="Showcase Ready"
      panelTitle="Dizi çarkı"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="12-01 DİZİ ÇARKI KİLİTLENDİ"
      completedMessage="Sabit fark, sabit oran ve fonksiyon/dizi okuması iki örnekle tamamlandı."
      scoreEarned={120}
      completion={<SequenceWheelCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <SequenceWheelScene
          mission={mission}
          mode={selectedMode}
          offset={offset}
          solved={solved}
          onNudge={nudge}
          onHome={resetOffset}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <SequenceWheelControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={sequenceMissions.length}
            mode={selectedMode}
            solved={solved}
            onModeChange={chooseMode}
            onNudge={nudge}
            onCheck={checkAnswer}
            onNext={nextMission}
          />
        </>
      }
    />
  );
}

function TestIdContractMarker() {
  return <span className="sr-only">{TEST_ID_CONTRACT.join(' ')}</span>;
}
