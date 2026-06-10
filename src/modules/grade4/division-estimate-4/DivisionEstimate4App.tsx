import { Grade4OperationMissionApp, type OperationMissionConfig } from '../shared/Grade4OperationMissionApp';
import { createDivisionEstimate4Tasks, DIVISION_ESTIMATE_4_ATOMS } from './divisionEstimate4Tasks';

const config: OperationMissionConfig = {
  moduleId: 'division-estimate-4',
  title: 'Bölme Tahmini',
  eyebrow: 'İlkokul 4. Sınıf / Bölme Tahmini',
  stageLabel: 'Tahmin rotası',
  completeTitle: 'Tahmin rotası tamam!',
  completeText: 'Bölme işlemini yapmadan önce sayıları yuvarlayıp yaklaşık sonucu doğru seçtin.',
  botCompleteText: 'Bölme tahmini tamam! Önce sayıyı yaklaştırıp sonra yaklaşık bölümü buldun.',
  panelCompleteText: 'Yaklaşık bölüm görevleri tamam.',
  score: 50,
  atoms: DIVISION_ESTIMATE_4_ATOMS,
  createTasks: createDivisionEstimate4Tasks,
  testIds: {
    stage: 'division-estimate-4-stage',
    controlPanel: 'division-estimate-4-control-panel',
    choice: 'division-estimate-4-choice',
    feedback: 'division-estimate-4-feedback',
    complete: 'division-estimate-4-complete',
    restart: 'division-estimate-4-restart',
  },
};

export default function DivisionEstimate4App() {
  return <Grade4OperationMissionApp config={config} />;
}
