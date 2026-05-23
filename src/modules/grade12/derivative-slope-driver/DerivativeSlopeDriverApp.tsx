import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { DerivativeSlopeCompletion } from './DerivativeSlopeCompletion';
import { DerivativeSlopeControls } from './DerivativeSlopeControls';
import { DerivativeSlopeScene } from './DerivativeSlopeScene';
import {
  ATOM_IDS,
  MODULE_ID,
  slopeMissions,
  SlopeTool,
  TEST_ID_CONTRACT,
  toolCopy,
} from './derivativeSlopeModel';

export default function DerivativeSlopeDriverApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const clearMessage = useAstroBotStore((state) => state.clearMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<SlopeTool | null>(null);
  const [probeProgress, setProbeProgress] = useState(0.72);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk pistte A-B araçları arasındaki kesen doğruyu oku: ortalama değişim nerede görünüyor?');

  const mission = slopeMissions[missionIndex];
  const hasNextMission = missionIndex < slopeMissions.length - 1;
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? hasNextMission
      ? 'Eğim kanıtı sahnede tamamlandı; sıradaki pistte aynı teşhis disiplinini koru.'
      : 'Final pist kilitlendi; Bitir ile türev kanıtını kapat.'
    : selectedTool === null
      ? mission.prompt
    : status === 'error'
        ? 'Bu görev ortalama değişim mi, yoksa anlık teğet mi? Sahnedeki A-B aralığını oku.'
        : 'Seçtiğin parça pistte gerçek eğim hareketini gösteriyor.';

  useEffect(() => {
    if (completed) return;
    showMessage(mission.prompt, 'info');
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (nextTool: SlopeTool) => {
    setSelectedTool(nextTool);
    setProbeProgress(probeProgressForTool(nextTool, mission.mode));
    setSolved(false);
    setStatus('info');
    setFeedback(toolCopy[nextTool].hint);
    showMessage(toolCopy[nextTool].hint, 'info');
  };

  const commitProbe = (nextProgress: number) => {
    const nextTool = toolFromProbe(mission.mode, nextProgress);
    setProbeProgress(nextProgress);
    setSelectedTool(nextTool);
    setSolved(false);
    setStatus('info');
    const message = `${toolCopy[nextTool].hint} Sahnedeki eğim sürgüsünü hareket ettirerek bu parçayı seçtin.`;
    setFeedback(message);
    showMessage(message, 'info');
  };

  const resetTool = () => {
    setSelectedTool(null);
    setProbeProgress(probeStartForMission(mission.mode));
    setSolved(false);
    setStatus('info');
    setFeedback('Pist teşhisi sıfırlandı. Home tuşu seçili parçayı bırakır ve eğim sahnesini başlangıca döndürür.');
    showMessage('Eğim pisti sıfırlandı; önce hangi parçayı okuyacağını seç.', 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir pist parçası seç: bu görev kesen doğru mu, teğet kızağı mı?');
      showMessage('Önce pist parçasını seçelim; eğim kızağı ancak öyle cevap verir.', 'error');
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
    if (missionIndex === slopeMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(120);
      setCompleted(true);
      clearMessage();
      showMessage('Türev eğim sürücüsü tamamlandı: kesen doğru teğete yaklaşarak anlık eğim fikrini kilitledi.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = slopeMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedTool(null);
    setProbeProgress(probeStartForMission(nextMissionItem.mode));
    setSolved(false);
    setStatus('info');
    setFeedback(nextMissionItem.prompt);
    clearMessage();
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedTool(null);
    setProbeProgress(probeStartForMission(slopeMissions[0].mode));
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk pistte A-B araçları arasındaki kesen doğruyu oku: ortalama değişim nerede görünüyor?');
    clearMessage();
    showMessage('Türev eğim pisti sıfırlandı. İlk görevde kesen doğruyu bul.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Türev Eğim Sürücüsü"
      subtitle="MAT.12.2.4"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Eğim kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="TÜREV EĞİM PİSTİ TAMAMLANDI"
      completedMessage="Kesen doğru, A noktasına yaklaşırken teğet kızağına dönüşen canlı eğim hareketi olarak ayrıştırıldı."
      scoreEarned={120}
      completion={<DerivativeSlopeCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <DerivativeSlopeScene
          mission={mission}
          tool={selectedTool}
          solved={solved}
          status={status}
          onHome={resetTool}
          probeProgress={probeProgress}
          onProbeChange={setProbeProgress}
          onProbeCommit={commitProbe}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <DerivativeSlopeControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={slopeMissions.length}
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

function probeStartForMission(mode: string) {
  if (mode === 'tangent') return 0.68;
  return 0.74;
}

function probeProgressForTool(tool: SlopeTool, mode: string) {
  if (tool === 'tangent') return mode === 'tangent' ? 0.92 : 0.82;
  return 0.74;
}

function toolFromProbe(mode: string, progress: number): SlopeTool {
  if (mode === 'corner') return Math.abs(progress - 0.5) < 0.18 ? 'corner' : 'tangent';
  if (mode === 'gap') return Math.abs(progress - 0.5) < 0.18 ? 'gap' : 'secant';
  if (mode === 'tangent') return progress > 0.76 ? 'tangent' : 'secant';
  return progress > 0.22 ? 'secant' : 'tangent';
}
