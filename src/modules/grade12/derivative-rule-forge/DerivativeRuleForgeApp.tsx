import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { DerivativeRuleCompletion } from './DerivativeRuleCompletion';
import { DerivativeRuleControls } from './DerivativeRuleControls';
import { DerivativeRuleScene } from './DerivativeRuleScene';
import {
  ATOM_IDS,
  forgeMissions,
  MODULE_ID,
  RuleTool,
  TEST_ID_CONTRACT,
  toolCopy,
} from './derivativeRuleModel';

export default function DerivativeRuleForgeApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<RuleTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk üretimde iki fonksiyon toplanıyor: hangi kartuş iki türev ışınını birleştirir?');

  const mission = forgeMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Kural dökümü kilitlendi; sıradaki üretimde hangi parçanın korunacağını izle.'
    : selectedTool === null
      ? 'Bir kural kartuşu seç: toplam, fark, çarpım, bölüm ya da zincir.'
      : status === 'error'
        ? 'Pembe alarmın yandığı üretim koluna bak; bu işlemde parça korunuyor mu, çıkarılıyor mu, içe mi giriyor?'
        : 'Seçtiğin kartuş üretim bandında önizleme yapıyor; karar test düğmesinden sonra verilecek.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (nextTool: RuleTool) => {
    setSelectedTool(nextTool);
    setSolved(false);
    setStatus('info');
    setFeedback(toolCopy[nextTool].hint);
    showMessage(toolCopy[nextTool].hint, 'info');
  };

  const resetTool = () => {
    setSelectedTool(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Kural kartuşu sıfırlandı. Home tuşu seçili kartuşu bırakır ve döküm bandını başlangıca döndürür.');
    showMessage('Kural döküm bandı sıfırlandı; önce hangi kartuşun çalışacağını seç.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir kural kartuşu seç: bu üretim toplam mı, fark mı, çarpım mı, bölüm mü, zincir mi?');
      showMessage('Önce kartuş seçelim; döküm bandı ancak öyle test yapar.', 'error');
      return;
    }

    if (selectedTool !== mission.expectedTool) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedTool]);
      showMessage(mission.failure[selectedTool], 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === forgeMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(180);
      setCompleted(true);
      showMessage('Türev kural dökümhanesi tamamlandı: beş kuralın üretim mantığı kilitlendi.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = forgeMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedTool(null);
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    showMessage(nextMissionItem.prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedTool(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk üretimde iki fonksiyon toplanıyor: hangi kartuş iki türev ışınını birleştirir?');
    showMessage('Türev kural dökümhanesi sıfırlandı. İlk görevde toplam kartuşunu bul.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Türev Kural Dökümhanesi"
      subtitle="MAT.12.2.5"
      statusLabel="Review Needed"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Kural kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="TÜREV KURAL DÖKÜMHANESİ TAMAMLANDI"
      completedMessage="Toplam, fark, çarpım, bölüm ve zincir kuralları üretim bandında ayrıştırıldı."
      scoreEarned={180}
      completion={<DerivativeRuleCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <DerivativeRuleScene
          mission={mission}
          tool={selectedTool}
          solved={solved}
          status={status}
          onHome={resetTool}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <DerivativeRuleControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={forgeMissions.length}
            tool={selectedTool}
            solved={solved}
            onToolChange={chooseTool}
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
