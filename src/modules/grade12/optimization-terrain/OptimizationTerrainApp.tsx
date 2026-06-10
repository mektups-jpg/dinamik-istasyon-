import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { OptimizationTerrainCompletion } from './OptimizationTerrainCompletion';
import { OptimizationTerrainControls } from './OptimizationTerrainControls';
import { OptimizationTerrainScene } from './OptimizationTerrainScene';
import {
  ATOM_IDS,
  isOptimizationCorrect,
  MODULE_ID,
  optimizationMissions,
  OptimizationTool,
  TEST_ID_CONTRACT,
  toolCopy,
} from './optimizationTerrainModel';

export default function OptimizationTerrainApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<OptimizationTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState("İlk arazide araç sağa giderken yükseliyor: f'(x) işareti hangi davranışı üretir?");

  const mission = optimizationMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Arazi kararı kilitlendi; sıradaki görevde türev işaretinin yönünü sahnede izle.'
    : selectedTool === null
      ? 'Bir arazi kararı seç: artan, azalan, tepe/çukur, maksimum hacim veya minimum maliyet.'
      : status === 'error'
        ? 'Pembe alarmın yandığı noktaya bak; bu pistte işaret mi, tepe mi, gerçek problem mi soruluyor?'
        : 'Seçtiğin karar arazide önizleme yapıyor; doğru/yanlış kararı test düğmesinden sonra gelecek.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (nextTool: OptimizationTool) => {
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
    setFeedback('Arazi kararı sıfırlandı. Home tuşu seçili kararı bırakır ve pisti başlangıca döndürür.');
    showMessage('Arazi kararı sıfırlandı; pisti yeniden oku.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir arazi kararı seç: bu nokta artan mı, azalan mı, ekstremum mu, maksimum hacim mi, minimum maliyet mi?');
      showMessage('Önce bir arazi kararı seç; sahnedeki sensör ancak seçimden sonra çalışır.', 'error');
      return;
    }

    if (!isOptimizationCorrect(mission, selectedTool)) {
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
    if (missionIndex === optimizationMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(190);
      setCompleted(true);
      showMessage('Optimizasyon arazisi tamamlandı: türev işareti, ekstremum ve gerçek problem kararları ayrıştı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = optimizationMissions[nextIndex];
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
    setFeedback("İlk arazide araç sağa giderken yükseliyor: f'(x) işareti hangi davranışı üretir?");
    showMessage("Optimizasyon arazisi sıfırlandı; ilk görevde f'(x) işaretinin arazi davranışını izle.", 'info');
  };

  return (
    <Grade12FullStageLab
      title="Optimizasyon Arazisi"
      subtitle="MAT.12.2.6"
      statusLabel="Görüş Gerekli"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Arazi kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="OPTİMİZASYON ARAZİSİ TAMAMLANDI"
      completedMessage="Artan/azalan bölgeler, ekstremum kapısı, maksimum hacim ve minimum maliyet kararları ayrıştırıldı."
      scoreEarned={190}
      completion={<OptimizationTerrainCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <OptimizationTerrainScene
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
          <OptimizationTerrainControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={optimizationMissions.length}
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
  return (
    <span aria-hidden="true" hidden>
      {TEST_ID_CONTRACT.join(' ')}
    </span>
  );
}
