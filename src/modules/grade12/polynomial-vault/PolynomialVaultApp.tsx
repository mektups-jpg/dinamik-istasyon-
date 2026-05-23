import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { PolynomialVaultCompletion } from './PolynomialVaultCompletion';
import { PolynomialVaultControls } from './PolynomialVaultControls';
import { PolynomialVaultScene } from './PolynomialVaultScene';
import {
  ATOM_IDS,
  lensCopy,
  MODULE_ID,
  polynomialMissions,
  TEST_ID_CONTRACT,
  VaultLens,
} from './polynomialVaultModel';

export default function PolynomialVaultApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedLens, setSelectedLens] = useState<VaultLens | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk kasada en yüksek dolu rafı oku: x rafı dolu, x² ve x³ boş.');

  const mission = polynomialMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Kasa kilitlendi; aynı raf okuma disiplinini sonraki göreve taşı.'
    : selectedLens === null
      ? 'Önce bir mercek seç: kimlik mi, derece mi, katsayı mı?'
      : status === 'error'
        ? 'Yanlış mercek pembe alarm verir; hangi rafın başrol olduğunu sahnede ara.'
        : 'Seçtiğin mercek kasanın hangi rafını ışıklandırıyor?';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseLens = (nextLens: VaultLens) => {
    setSelectedLens(nextLens);
    setSolved(false);
    setStatus('info');
    setFeedback(lensCopy[nextLens].hint);
    showMessage(lensCopy[nextLens].hint, 'info');
  };

  const resetLens = () => {
    setSelectedLens(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Mercek sıfırlandı. Home tuşu kasayı merceksiz başlangıca döndürür.');
    showMessage('Mercek sıfırlandı; rafları yeniden oku.', 'info');
  };

  const checkAnswer = () => {
    if (selectedLens === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir mercek seç: bu görev kimlik, derece, başkatsayı veya sabit terim mi soruyor?');
      showMessage('Önce mercek seç; kasayı kilitlemeden geçemeyiz.', 'error');
      return;
    }

    if (selectedLens !== mission.expectedLens) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedLens]);
      showMessage(mission.failure[selectedLens], 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === polynomialMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(140);
      setCompleted(true);
      showMessage('Polinom kasası açıldı. Beş raf okuması tamamlandı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = polynomialMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedLens(null);
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    showMessage(nextMissionItem.prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedLens(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk kasada en yüksek dolu rafı oku: x rafı dolu, x² ve x³ boş.');
    showMessage('Polinom kasası sıfırlandı. İlk görevde doğrusal kimliği ara.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Polinom Kasası"
      subtitle="MAT.12.1.2.1-5"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin hazır"
      panelTitle="Polinom tarayıcı"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="POLİNOM KASASI AÇILDI"
      completedMessage="Doğrusal/karesel kimlik, derece, başkatsayı ve sabit terim okuması tamamlandı."
      scoreEarned={140}
      completion={<PolynomialVaultCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <PolynomialVaultScene
          mission={mission}
          lens={selectedLens}
          status={status}
          solved={solved}
          onHome={resetLens}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <PolynomialVaultControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={polynomialMissions.length}
            lens={selectedLens}
            solved={solved}
            onLensChange={chooseLens}
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
