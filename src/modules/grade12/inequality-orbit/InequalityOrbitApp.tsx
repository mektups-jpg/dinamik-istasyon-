import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { InequalityOrbitCompletion } from './InequalityOrbitCompletion';
import { InequalityOrbitControls } from './InequalityOrbitControls';
import { InequalityOrbitScene } from './InequalityOrbitScene';
import {
  ATOM_IDS,
  MODULE_ID,
  orbitMissions,
  OrbitScanner,
  scannerCopy,
  TEST_ID_CONTRACT,
} from './inequalityOrbitModel';

export default function InequalityOrbitApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedScanner, setSelectedScanner] = useState<OrbitScanner | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk yörüngede ifadeyi sıfıra indiren kök istasyonlarını ara.');

  const mission = orbitMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Yörünge kilitlendi; aynı işaret disiplinini sonraki göreve taşı.'
    : selectedScanner === null
      ? 'Önce tarayıcı seç: kök mü, yasak kapı mı, işaret bölgesi mi?'
      : status === 'error'
        ? 'Yanlış tarayıcı pembe alarm verir; görevin istediği matematiksel parçayı sahnede ara.'
        : 'Seçtiğin tarayıcı yörüngede hangi istasyonu veya aralığı ışıklandırıyor?';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseScanner = (nextScanner: OrbitScanner) => {
    setSelectedScanner(nextScanner);
    setSolved(false);
    setStatus('info');
    setFeedback(scannerCopy[nextScanner].hint);
    showMessage(scannerCopy[nextScanner].hint, 'info');
  };

  const resetScanner = () => {
    setSelectedScanner(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Tarayıcı sıfırlandı. Home tuşu yörüngeyi başlangıç kararına döndürür.');
    showMessage('Tarayıcı sıfırlandı; kritik istasyonları yeniden oku.', 'info');
  };

  const checkAnswer = () => {
    if (selectedScanner === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir tarayıcı seç: bu görev kök, yasak kapı, pozitif/negatif bölge veya çözüm koridoru mu soruyor?');
      showMessage('Önce tarayıcı seç; yörüngeyi kilitlemeden geçemeyiz.', 'error');
      return;
    }

    if (selectedScanner !== mission.expectedScanner) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedScanner]);
      showMessage(mission.failure[selectedScanner], 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === orbitMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(150);
      setCompleted(true);
      showMessage('İşaret yörüngesi kilitlendi. Dört denklem/eşitsizlik okuması tamamlandı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = orbitMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedScanner(null);
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    showMessage(nextMissionItem.prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedScanner(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk yörüngede ifadeyi sıfıra indiren kök istasyonlarını ara.');
    showMessage('İşaret yörüngesi sıfırlandı. İlk görevde kök istasyonlarını tara.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="İşaret Yörünge Radarı"
      subtitle="MAT.12.1.3.1-4"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin hazır"
      panelTitle="İşaret radarı"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="İŞARET YÖRÜNGESİ KİLİTLENDİ"
      completedMessage="Kök, yasak kapı, işaret bölgesi ve çözüm koridoru okuması tamamlandı."
      scoreEarned={150}
      completion={<InequalityOrbitCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <InequalityOrbitScene
          mission={mission}
          scanner={selectedScanner}
          status={status}
          solved={solved}
          onHome={resetScanner}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <InequalityOrbitControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={orbitMissions.length}
            scanner={selectedScanner}
            solved={solved}
            onScannerChange={chooseScanner}
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
