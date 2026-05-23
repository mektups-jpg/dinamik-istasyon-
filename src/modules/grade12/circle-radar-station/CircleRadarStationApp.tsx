import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { CircleRadarCompletion } from './CircleRadarCompletion';
import { CircleRadarControls } from './CircleRadarControls';
import { CircleRadarScene } from './CircleRadarScene';
import {
  ATOM_IDS,
  circleRadarMissions,
  isCircleRadarCorrect,
  MODULE_ID,
  RadarTool,
  TEST_ID_CONTRACT,
  toolCopy,
} from './circleRadarModel';

export default function CircleRadarStationApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<RadarTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk görevde çemberi iki noktada kesen ışını bul: radar iki temas noktası arıyor.');

  const mission = circleRadarMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Radar kanıtı kilitlendi; sıradaki görevde ışının çemberle nasıl temas ettiğine odaklan.'
    : selectedTool === null
      ? 'Bir radar modu seç: kesen, kiriş, teğet, yay, çevre açı, merkez açı veya alan.'
      : status === 'error'
        ? 'Alarmın nerede yandığına bak: temas sayısı mı, bakış noktası mı, yoksa tüm disk mi soruluyor?'
        : 'Seçtiğin mod sahnede önizleme yapıyor; doğru/yanlış kararı test düğmesinden sonra gelecek.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (nextTool: RadarTool) => {
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
    setFeedback('Radar modu sıfırlandı. Home tuşu seçili modu bırakır ve çemberi bekleme durumuna döndürür.');
    showMessage('Radar modu sıfırlandı; çemberde temas sayısını yeniden oku.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir radar modu seç: bu görev çizgi mi, yay mı, açı mı, alan mı soruyor?');
      showMessage('Önce bir radar modu seç; ışın çemberle temas kurmadan karar veremeyiz.', 'error');
      return;
    }

    if (!isCircleRadarCorrect(mission, selectedTool)) {
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
    if (missionIndex === circleRadarMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(210);
      setCompleted(true);
      showMessage('Çember radar istasyonu tamamlandı: temas, açı, yay ve alan ilişkileri ayrıştı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = circleRadarMissions[nextIndex];
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
    setFeedback('İlk görevde çemberi iki noktada kesen ışını bul: radar iki temas noktası arıyor.');
    showMessage('Çember radarı sıfırlandı; ilk görevde iki temas noktasını ara.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Çember Radar İstasyonu"
      subtitle="MAT.12.3"
      statusLabel="Görüş Gerekli"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Radar kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="ÇEMBER RADAR İSTASYONU TAMAMLANDI"
      completedMessage="Kesen, kiriş, teğet, yay, çevre açı, merkez açı ve alan radar gövdesinde ayrıştırıldı."
      scoreEarned={210}
      completion={<CircleRadarCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <CircleRadarScene
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
          <CircleRadarControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={circleRadarMissions.length}
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
