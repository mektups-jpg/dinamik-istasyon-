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
  BuildStepId,
  forgeMissions,
  MODULE_ID,
  RuleTool,
  TEST_ID_CONTRACT,
  toolCopy,
} from './derivativeRuleModel';
import { bridgeStepCopy } from './derivativeRuleBridgeCopy';

export default function DerivativeRuleForgeApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<RuleTool | null>(null);
  const [lockedSteps, setLockedSteps] = useState<BuildStepId[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<string>>(() => new Set());
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('İlk görevde iki fonksiyonun toplamının türevi isteniyor. Uygun türev kuralını seç.');

  const mission = forgeMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const allStepsLocked = useMemo(
    () => mission.buildSteps.every((step) => lockedSteps.includes(step.id)),
    [lockedSteps, mission],
  );
  const completedMissionIndexes = useMemo(
    () => new Set(forgeMissions.flatMap((item, index) => (completedMissionIds.has(item.id) ? [index] : []))),
    [completedMissionIds],
  );
  const astroBotMessage = solved
    ? 'Sonuç doğru kuruldu. Başka bir türev kuralı seçip onu sahnede kurabilirsin.'
    : selectedTool === null
      ? 'Bir türev kuralı seç: toplam, fark, çarpım, bölüm ya da zincir.'
      : !allStepsLocked
        ? 'Kural seçildi. Şimdi sahnedeki adımları tamamla; hangi fonksiyonun türevlendiğini tek tek gör.'
      : status === 'error'
        ? 'Pembe uyarıya bak: bu işlemde toplama mı, çıkarma mı, aynen bırakma mı gerekiyor?'
        : 'Adımlar hazır. Sonucu kontrol ederek seçtiğin kuralın bu ifadeye uyup uymadığını gör.';

  useEffect(() => {
    if (!completed && selectedTool === null) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, selectedTool, showMessage]);

  const chooseTool = (nextTool: RuleTool) => {
    const nextMissionIndex = forgeMissions.findIndex((item) => item.expectedTool === nextTool);
    if (nextMissionIndex === -1) return;

    const nextMissionItem = forgeMissions[nextMissionIndex];
    setMissionIndex(nextMissionIndex);
    setSelectedTool(nextTool);
    setLockedSteps([]);
    setSolved(false);
    setStatus('info');
    setFeedback(`${nextMissionItem.title}: ${toolCopy[nextTool].hint} Şimdi sahnedeki adımları sırayla uygula.`);
    showMessage(`${toolCopy[nextTool].hint} Şimdi bu kuralın adımlarını tek tek sahnede tamamlayalım.`, 'info');
  };

  const resetTool = () => {
    setSelectedTool(null);
    setLockedSteps([]);
    setSolved(false);
    setStatus('info');
    setFeedback('Seçili kural sıfırlandı. Home tuşu kural seçimini bırakır ve sahneyi başlangıca döndürür.');
    showMessage('Kural seçimi sıfırlandı; önce hangi türev kuralının kullanılacağını seç.', 'info');
  };

  const lockStep = (stepId: BuildStepId) => {
    const step = mission.buildSteps.find((item) => item.id === stepId);
    if (!step) return;

    if (selectedTool === null) {
      setStatus('error');
      setFeedback('Önce bir türev kuralı seç; sonra sahnedeki adımları uygula.');
      showMessage('Önce kuralı seçelim, sonra adımları sahnede tamamlayalım.', 'error');
      return;
    }

    if (solved) {
      showMessage('Bu görev tamamlandı; başka bir türev kuralı seçebilirsin.', 'success');
      return;
    }

    setStatus('info');
    const stepNote = step.target === 'bridge' ? bridgeStepCopy[selectedTool].note : step.note;

    if (lockedSteps.includes(stepId)) {
      setFeedback(stepNote);
      showMessage(stepNote, 'info');
      return;
    }

    const next = [...lockedSteps, stepId];
    const remaining = mission.buildSteps.length - next.length;
    const message = remaining === 0
      ? `${stepNote} Tüm adımlar tamamlandı; şimdi sonucu kontrol et.`
      : `${stepNote} Kalan adım: ${remaining}.`;

    setLockedSteps(next);
    setFeedback(message);
    showMessage(message, remaining === 0 ? 'success' : 'info');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce bir türev kuralı seç: toplam mı, fark mı, çarpım mı, bölüm mü, zincir mi?');
      showMessage('Önce türev kuralını seçelim; sahne ancak o zaman kontrol yapar.', 'error');
      return;
    }

    if (selectedTool !== mission.expectedTool) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedTool]);
      showMessage(mission.failure[selectedTool], 'error');
      return;
    }

    if (!allStepsLocked) {
      setStatus('error');
      setSolved(false);
      setFeedback(
        `Kural doğru; ama tüm matematik adımları tamamlanmadan sonuç hazır olmaz. Adım: ${lockedSteps.length}/${mission.buildSteps.length}.`,
      );
      showMessage('Kural doğru, fakat matematik henüz tamamlanmadı. Sahnede kalan adımları uygula.', 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    const nextCompletedMissionIds = new Set(completedMissionIds);
    nextCompletedMissionIds.add(mission.id);
    setCompletedMissionIds(nextCompletedMissionIds);

    if (nextCompletedMissionIds.size === forgeMissions.length) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(180);
      setCompleted(true);
      showMessage('Türev alma kuralları tamamlandı: beş kuralın ne zaman ve nasıl kullanıldığı kuruldu.', 'success');
      return;
    }

    setFeedback(`${mission.success} Başka bir kural seçip devam edebilirsin.`);
    showMessage(`${mission.success} Başka bir türev kuralı seçebilirsin.`, 'success');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedTool(null);
    setLockedSteps([]);
    setCompletedMissionIds(new Set());
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('İlk görevde iki fonksiyonun toplamının türevi isteniyor. Uygun türev kuralını seç.');
    showMessage('Dört işlem ve zincir türevi sıfırlandı. İlk görevde toplam kuralını bul.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Dört İşlem ve Zincir Türevi"
      subtitle="MAT.12.2.5"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin hazır"
      panelTitle="Kural Adımları"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="TÜREV ALMA KURALLARI TAMAMLANDI"
      completedMessage="Toplam, fark, çarpım, bölüm ve zincir kuralları anlamlarıyla birlikte kuruldu."
      scoreEarned={180}
      completion={<DerivativeRuleCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      successFeedbackLabel="Sonuç hazır; ayrıntı sahne kartında."
      stage={
        <DerivativeRuleScene
          mission={mission}
          tool={selectedTool}
          lockedSteps={lockedSteps}
          solved={solved}
          status={status}
          onLockStep={lockStep}
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
            completedMissionIndexes={completedMissionIndexes}
            tool={selectedTool}
            lockedCount={lockedSteps.length}
            buildCount={mission.buildSteps.length}
            solved={solved}
            onToolChange={chooseTool}
            onCheck={checkAnswer}
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
