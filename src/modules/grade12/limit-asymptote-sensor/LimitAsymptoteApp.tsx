import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { LimitAsymptoteCompletion } from './LimitAsymptoteCompletion';
import { LimitAsymptoteControls } from './LimitAsymptoteControls';
import { LimitAsymptoteScene } from './LimitAsymptoteScene';
import {
  ATOM_IDS,
  limitMissions,
  LimitMission,
  LimitTool,
  MODULE_ID,
  TEST_ID_CONTRACT,
  toolCopy,
} from './limitAsymptoteModel';

export default function LimitAsymptoteApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<LimitTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk pistte soldan ve sağdan limit kutularını x = 2 kapısına yaklaştır.');

  const mission = limitMissions[missionIndex];
  const astroBotPrompt = getAstroBotPrompt(mission);
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Limit kilitlendi; bir sonraki pistte aynı yaklaşma disiplinini koru.'
    : selectedTool === null
      ? 'Önce yöntem seç: grafikten iki tarafı oku, x=a yerine yaz, sonsuzdaki asimptotu oku veya 0/0 ifadesini sadeleştir.'
      : status === 'error'
        ? 'Yanlış okuma pembe alarm verir; hedefin ne istediğini sahnedeki hareketten oku.'
        : 'Seçtiğin okuma pistte hangi limit davranışını görünür yaptı?';

  useEffect(() => {
    if (!completed) {
      showMessage(astroBotPrompt, 'info');
    }
  }, [astroBotPrompt, completed, showMessage]);

  const chooseTool = (nextTool: LimitTool) => {
    setSelectedTool(nextTool);
    setSolved(false);
    setStatus('info');
    setFeedback(toolCopy[nextTool].hint);
    showMessage(getAstroBotToolHint(nextTool, toolCopy[nextTool].hint), 'info');
  };

  const resetTool = () => {
    setSelectedTool(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Okuma sıfırlandı. Home tuşu yaklaşma pistini başlangıç kararına döndürür.');
    showMessage('Okuma sıfırlandı; limit tipini yeniden seç.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir okuma seç: bu görev grafik yaklaşımı mı, cebirsel hesap mı, sonsuz limit mi, 0/0 manevrası mı?');
      showMessage('Önce limit okuması seç; kapı kilitlenmeden geçemeyiz.', 'error');
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
    if (missionIndex === limitMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(160);
      setCompleted(true);
      showMessage('Limit sensörleri kilitlendi. Grafik, sonsuz ve 0/0 manevrası tamamlandı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = limitMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedTool(null);
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    showMessage(getAstroBotPrompt(nextMissionItem), 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedTool(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk pistte soldan ve sağdan limit kutularını x = 2 kapısına yaklaştır.');
    showMessage('Limit pisti sıfırlandı. İlk görevde soldan ve sağdan yaklaşımı oku.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Limit Asimptot Sensörü"
      subtitle="MAT.12.2.1-2"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin hazır"
      panelTitle="Limit okuması"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="LİMİT SENSÖRLERİ KİLİTLENDİ"
      completedMessage="Grafik yaklaşımı, sonsuz asimptot, yerine yazma ve 0/0 sadeleştirme tamamlandı."
      scoreEarned={160}
      completion={<LimitAsymptoteCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <LimitAsymptoteScene
          mission={mission}
          tool={selectedTool}
          status={status}
          solved={solved}
          onHome={resetTool}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <LimitAsymptoteControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={limitMissions.length}
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

const zeroOverZeroAstroBotFormula = '[[math:f(x)=\\displaystyle\\frac{x^2-4}{x-2}]]';
const zeroOverZeroAstroBotPrompt = `${zeroOverZeroAstroBotFormula} Doğrudan [[math:x=2]] koyunca 0/0 çıkar; payı çarpanlara ayır ve ortak [[math:(x-2)]] çarpanını sadeleştir.`;
const zeroOverZeroAstroBotHint = `${zeroOverZeroAstroBotFormula} Payı çarpanlara ayır; pay ve paydadaki aynı [[math:(x-2)]] çarpanını sadeleştir.`;

function getAstroBotPrompt(mission: LimitMission) {
  if (mission.id !== 'zero-over-zero') {
    return mission.prompt;
  }

  return zeroOverZeroAstroBotPrompt;
}

function getAstroBotToolHint(tool: LimitTool, hint: string) {
  if (tool !== 'factor') {
    return hint;
  }

  return zeroOverZeroAstroBotHint;
}
