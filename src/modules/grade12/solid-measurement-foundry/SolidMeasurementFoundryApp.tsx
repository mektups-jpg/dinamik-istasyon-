import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { SolidMeasurementCompletion } from './SolidMeasurementCompletion';
import { SolidMeasurementControls } from './SolidMeasurementControls';
import { SolidMeasurementScene } from './SolidMeasurementScene';
import {
  ATOM_IDS,
  explainSolidMismatch,
  isSolidAnswerCorrect,
  MeasurementMode,
  modeCopy,
  MODULE_ID,
  SolidKind,
  solidCopy,
  solidMissions,
  TEST_ID_CONTRACT,
} from './solidMeasurementModel';

export default function SolidMeasurementFoundryApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedSolid, setSelectedSolid] = useState<SolidKind | null>(null);
  const [selectedMode, setSelectedMode] = useState<MeasurementMode | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('Prizma görevinde önce doğru cismi ve iç hacim dolumunu seç; sahnedeki 3D gövde kanıtı bekliyor.');

  const mission = solidMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Ölçüm kilitlendi; sıradaki istasyonda iç dolum mu dış kaplama mı istendiğine dikkat et.'
    : selectedSolid === null || selectedMode === null
      ? 'Bir cisim ve bir ölçüm modu seç: hacim iç dolumdur, yüzey alanı dış kaplamadır.'
      : status === 'error'
        ? 'Alarmın neden yandığını izle: yanlış cisim mi, yanlış ölçüm modu mu?'
        : 'Seçimin 3D sahnede önizleniyor; karar test düğmesinden sonra verilecek.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseSolid = (solid: SolidKind) => {
    setSelectedSolid(solid);
    setSolved(false);
    setStatus('info');
    setFeedback(solidCopy[solid].hint);
    showMessage(solidCopy[solid].hint, 'info');
  };

  const chooseMode = (mode: MeasurementMode) => {
    setSelectedMode(mode);
    setSolved(false);
    setStatus('info');
    setFeedback(modeCopy[mode].hint);
    showMessage(modeCopy[mode].hint, 'info');
  };

  const resetSelection = () => {
    setSelectedSolid(null);
    setSelectedMode(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Seçim sıfırlandı. Home tuşu sahneyi bekleme durumuna döndürür; yeniden cisim ve mod seç.');
    showMessage('Dökümhane sıfırlandı; önce cismi, sonra iç dolum mu dış kaplama mı istendiğini seç.', 'info');
  };

  const checkAnswer = () => {
    if (!isSolidAnswerCorrect(mission, selectedSolid, selectedMode)) {
      setStatus('error');
      setSolved(false);
      const mismatch = explainSolidMismatch(mission, selectedSolid, selectedMode);
      setFeedback(mismatch);
      showMessage(mismatch, 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === solidMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(300);
      setCompleted(true);
      showMessage('Katı cisim dökümhanesi tamamlandı: hacim iç dolum, yüzey alanı dış kaplama olarak ayrıştı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    setMissionIndex(nextIndex);
    setSelectedSolid(null);
    setSelectedMode(null);
    setSolved(false);
    setStatus('info');
    setFeedback(solidMissions[nextIndex].prompt);
    showMessage(solidMissions[nextIndex].prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedSolid(null);
    setSelectedMode(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('Prizma görevinde önce doğru cismi ve iç hacim dolumunu seç; sahnedeki 3D gövde kanıtı bekliyor.');
    showMessage('Dökümhane sıfırlandı; ilk görevde prizma ve hacim dolumunu eşleştir.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Katı Cisim Ölçüm Dökümhanesi"
      subtitle="MAT.12.4"
      statusLabel="Görüş Gerekli"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Dökümhane kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="KATI CİSİM ÖLÇÜM DÖKÜMHANESİ TAMAMLANDI"
      completedMessage="Hacim iç dolum, yüzey alanı dış kaplama olarak 3D sahnede ayrıştırıldı."
      scoreEarned={300}
      completion={<SolidMeasurementCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <SolidMeasurementScene
          mission={mission}
          solid={selectedSolid}
          mode={selectedMode}
          solved={solved}
          status={status}
          onHome={resetSelection}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <SolidMeasurementControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={solidMissions.length}
            solid={selectedSolid}
            mode={selectedMode}
            solved={solved}
            onSolidChange={chooseSolid}
            onModeChange={chooseMode}
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
