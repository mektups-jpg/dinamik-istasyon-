import { Grade4DecisionStationApp, type StationModuleConfig } from '../shared/Grade4DecisionStationApp';
import { createTwoGroupBarChart4Tasks, TWO_GROUP_BAR_CHART_ATOMS } from '../network-optimization-terminal-4/networkOptimization4Tasks';

const config: StationModuleConfig = {
  moduleId: 'two-group-bar-chart-4',
  title: 'İki Sınıf Grafiği',
  eyebrow: 'İlkokul 4. Sınıf / Veri ve Grafik',
  stageLabel: 'Grafik okuma masası',
  completeTitle: 'Grafik okundu!',
  completeText: 'İki veri grubunu aynı sütun grafiğinde karşılaştırıp karar verdin.',
  botCompleteText: 'Grafik okuma tamam! İki sınıfın sütunlarını karşılaştırıp doğru karar verdin.',
  panelCompleteText: 'İki gruplu grafik kararları tamam.',
  score: 90,
  iconKind: 'chart',
  atoms: TWO_GROUP_BAR_CHART_ATOMS,
  createTasks: createTwoGroupBarChart4Tasks,
  testIds: {
    stage: 'two-group-bar-chart-4-stage',
    controlPanel: 'two-group-bar-chart-4-control-panel',
    choice: 'two-group-bar-chart-4-choice',
    feedback: 'two-group-bar-chart-4-feedback',
    complete: 'two-group-bar-chart-4-complete',
    restart: 'two-group-bar-chart-4-restart',
  },
};

export default function TwoGroupBarChart4App() {
  return <Grade4DecisionStationApp config={config} />;
}
