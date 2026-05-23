import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { ContinuityBridgeCompletion } from './ContinuityBridgeCompletion';
import { ContinuityBridgeControls } from './ContinuityBridgeControls';
import { ContinuityBridgeScene } from './ContinuityBridgeScene';
import {
  ATOM_IDS,
  bridgeMissions,
  BridgeTool,
  MODULE_ID,
  TEST_ID_CONTRACT,
  toolCopy,
} from './continuityBridgeModel';

export default function ContinuityBridgeApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<BridgeTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState(bridgeMissions[0].prompt);

  const mission = bridgeMissions[missionIndex];
  const functionLabel = getFunctionLabel(mission.gateLabel);
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Köprü sahnede cevap verdi; şimdi bir sonraki kopma tipini yakalayalım.'
    : selectedTool === null
      ? `Bir kontrol seç: sağ-sol limit mi, ${functionLabel} değeri mi, süreksiz mi, sürekli mi?`
      : status === 'error'
        ? 'Sahnede hangi süreklilik şartının bozulduğuna bak.'
        : 'Seçtiğin kontrol sahnedeki ilgili matematik parçasını öne çıkardı.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (nextTool: BridgeTool) => {
    setSelectedTool(nextTool);
    setSolved(false);
    setStatus('info');
    const hint = personalizeCopy(toolCopy[nextTool].hint, mission);
    setFeedback(hint);
    showMessage(hint, 'info');
  };

  const resetTool = () => {
    setSelectedTool(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Kontrol sıfırlandı. Home tuşu seçili aracı bırakır ve köprüyü başlangıca döndürür.');
    showMessage('Süreklilik kontrolü sıfırlandı; üç şartı yeniden oku.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback(`Önce bir kontrol seç: sağ-sol limit, ${functionLabel} değeri, süreksiz veya sürekli.`);
      showMessage('Önce süreklilik kontrolünü seçelim; sahne buna göre kanıtı gösterecek.', 'error');
      return;
    }

    if (selectedTool !== mission.expectedTool) {
      const partialFeedback = mission.partial?.[selectedTool];
      if (partialFeedback !== undefined) {
        const message = personalizeCopy(partialFeedback, mission);
        setStatus('info');
        setSolved(false);
        setFeedback(message);
        showMessage(message, 'info');
        return;
      }

      setStatus('error');
      setSolved(false);
      const failure = personalizeCopy(mission.failure[selectedTool], mission);
      setFeedback(failure);
      showMessage(failure, 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    const success = personalizeCopy(mission.success, mission);
    setFeedback(success);
    showMessage(success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === bridgeMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(140);
      setCompleted(true);
      showMessage('Süreklilik köprüsü tamamlandı: soldan limit, sağdan limit ve nokta değeri artık sahnede okunuyor.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = bridgeMissions[nextIndex];
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
    setFeedback(bridgeMissions[0].prompt);
    showMessage('Süreklilik köprüsü sıfırlandı. İlk görevde üç şartı aynı anda ara.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Süreklilik Köprüsü"
      subtitle="MAT.12.2.3.1"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin hazır"
      panelTitle="Köprü kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="SÜREKLİLİK KÖPRÜSÜ MÜHÜRLENDİ"
      completedMessage="Soldan limit, sağdan limit ve nokta değeri aynı sahnede kontrol edildi."
      scoreEarned={140}
      completion={<ContinuityBridgeCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <ContinuityBridgeScene
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
          <ContinuityBridgeControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={bridgeMissions.length}
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

function getFunctionLabel(gateLabel: string) {
  const point = gateLabel.match(/x\s*=\s*(.+)$/)?.[1]?.trim();
  return point ? `f(${point})` : 'f(a)';
}

function personalizeCopy(text: string, mission: (typeof bridgeMissions)[number]) {
  return text
    .replaceAll('f(a)', getFunctionLabel(mission.gateLabel))
    .replaceAll('x = a', mission.gateLabel);
}
