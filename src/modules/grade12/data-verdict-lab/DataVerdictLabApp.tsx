import { useEffect, useMemo, useState } from 'react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { DataVerdictCompletion } from './DataVerdictCompletion';
import { DataVerdictControls } from './DataVerdictControls';
import { DataVerdictScene } from './DataVerdictScene';
import {
  ATOM_IDS,
  dataVerdictMissions,
  explainDataVerdictMismatch,
  FilterTool,
  filterCopy,
  isDataVerdictCorrect,
  MODULE_ID,
  SourceTool,
  sourceCopy,
  TEST_ID_CONTRACT,
  VerdictTool,
  verdictCopy,
} from './dataVerdictModel';

export default function DataVerdictLabApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedSource, setSelectedSource] = useState<SourceTool | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterTool | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<VerdictTool | null>(null);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState('Kurum kaynağını, doğru istatistik filtresini ve güvenli sonuç cümlesini seç; veri hattı mühür bekliyor.');

  const mission = dataVerdictMissions[missionIndex];
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? 'Yargı kilitlendi; sıradaki veri setinde hangi filtrenin asıl kanıtı açtığını izle.'
    : selectedSource === null || selectedFilter === null || selectedVerdict === null
      ? 'Üç kilidi sırayla kur: kaynak, filtre, sonuç cümlesi. Her seçim sahnede ışık yakacak.'
      : status === 'error'
        ? 'Alarmın yerini bul: kaynak mı güvenilir değil, filtre mi yanlış, yoksa sonuç cümlesi fazla iddialı mı?'
        : 'Kanıt zinciri hazır görünüyor; test düğmesi gerçek yargıyı mühürleyecek.';

  useEffect(() => {
    if (!completed) {
      showMessage(mission.prompt, 'info');
    }
  }, [completed, mission.prompt, showMessage]);

  const chooseSource = (source: SourceTool) => {
    setSelectedSource(source);
    setSolved(false);
    setStatus('info');
    setFeedback(sourceCopy[source].hint);
    showMessage(sourceCopy[source].hint, 'info');
  };

  const chooseFilter = (filter: FilterTool) => {
    setSelectedFilter(filter);
    setSolved(false);
    setStatus('info');
    setFeedback(filterCopy[filter].hint);
    showMessage(filterCopy[filter].hint, 'info');
  };

  const chooseVerdict = (verdict: VerdictTool) => {
    setSelectedVerdict(verdict);
    setSolved(false);
    setStatus('info');
    setFeedback(verdictCopy[verdict].hint);
    showMessage(verdictCopy[verdict].hint, 'info');
  };

  const resetSelection = () => {
    setSelectedSource(null);
    setSelectedFilter(null);
    setSelectedVerdict(null);
    setSolved(false);
    setStatus('info');
    setFeedback('Seçimler sıfırlandı. Home tuşu veri hattını bekleme durumuna döndürür.');
    showMessage('Veri hattı sıfırlandı; kaynak, filtre ve yargı kilitlerini sırayla kur.', 'info');
  };

  const checkAnswer = () => {
    if (!isDataVerdictCorrect(mission, selectedSource, selectedFilter, selectedVerdict)) {
      setStatus('error');
      setSolved(false);
      const mismatch = explainDataVerdictMismatch(mission, selectedSource, selectedFilter, selectedVerdict);
      setFeedback(mismatch);
      showMessage(mismatch, 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.conclusion);
    showMessage(mission.conclusion, 'success');
  };

  const nextMission = () => {
    if (missionIndex === dataVerdictMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(180);
      setCompleted(true);
      showMessage('Büyük veri yargı laboratuvarı tamamlandı: kaynak, filtre ve güvenli sonuç cümlesi ayrıştı.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    setMissionIndex(nextIndex);
    setSelectedSource(null);
    setSelectedFilter(null);
    setSelectedVerdict(null);
    setSolved(false);
    setStatus('info');
    setFeedback(dataVerdictMissions[nextIndex].prompt);
    showMessage(dataVerdictMissions[nextIndex].prompt, 'info');
  };

  const reset = () => {
    setMissionIndex(0);
    setSelectedSource(null);
    setSelectedFilter(null);
    setSelectedVerdict(null);
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback('Kurum kaynağını, doğru istatistik filtresini ve güvenli sonuç cümlesini seç; veri hattı mühür bekliyor.');
    showMessage('Veri yargı laboratuvarı sıfırlandı; önce güvenilir kaynak kilidini kur.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Büyük Veri Yargı Laboratuvarı"
      subtitle="MAT.12.5"
      statusLabel="Görüş Gerekli"
      eyebrow="12. sınıf kalite adayı"
      panelTitle="Yargı kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="BÜYÜK VERİ YARGI LABORATUVARI TAMAMLANDI"
      completedMessage="Hazır kurumsal veriden filtreli ve güvenli sonuç cümlesi çıkarıldı."
      scoreEarned={180}
      completion={<DataVerdictCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <DataVerdictScene
          mission={mission}
          source={selectedSource}
          filter={selectedFilter}
          verdict={selectedVerdict}
          solved={solved}
          status={status}
          onHome={resetSelection}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <DataVerdictControls
            mission={mission}
            missionIndex={missionIndex}
            missionCount={dataVerdictMissions.length}
            source={selectedSource}
            filter={selectedFilter}
            verdict={selectedVerdict}
            solved={solved}
            onSourceChange={chooseSource}
            onFilterChange={chooseFilter}
            onVerdictChange={chooseVerdict}
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
