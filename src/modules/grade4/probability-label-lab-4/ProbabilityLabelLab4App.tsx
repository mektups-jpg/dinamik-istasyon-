import { Grade4DecisionStationApp, type StationModuleConfig } from '../shared/Grade4DecisionStationApp';
import { createProbabilityLabel4Tasks, PROBABILITY_LABEL_ATOMS } from '../network-optimization-terminal-4/networkOptimization4Tasks';

const config: StationModuleConfig = {
  moduleId: 'probability-label-lab-4',
  title: 'Olasılık Etiketleri',
  eyebrow: 'İlkokul 4. Sınıf / Olasılık',
  stageLabel: 'Olasılık kutusu',
  completeTitle: 'Etiketler doğru!',
  completeText: 'İmkânsız, kesin ve olabilir olaylarını ayrı ayrı tanıdın.',
  botCompleteText: 'Olasılık etiketleri hazır! İmkânsız, kesin ve olabilir ayrımını yakaladın.',
  panelCompleteText: 'Olasılık etiketleri tamam.',
  score: 100,
  iconKind: 'probability',
  atoms: PROBABILITY_LABEL_ATOMS,
  createTasks: createProbabilityLabel4Tasks,
  testIds: {
    stage: 'probability-label-lab-4-stage',
    controlPanel: 'probability-label-lab-4-control-panel',
    choice: 'probability-label-lab-4-choice',
    feedback: 'probability-label-lab-4-feedback',
    complete: 'probability-label-lab-4-complete',
    restart: 'probability-label-lab-4-restart',
  },
};

export default function ProbabilityLabelLab4App() {
  return <Grade4DecisionStationApp config={config} />;
}
