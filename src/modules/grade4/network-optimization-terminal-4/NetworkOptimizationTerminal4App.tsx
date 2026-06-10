import { Grade4DecisionStationApp, type StationModuleConfig } from '../shared/Grade4DecisionStationApp';
import { createNetworkOptimizationTasks, NETWORK_OPTIMIZATION_ATOMS } from './networkOptimization4Tasks';

const config: StationModuleConfig = {
  moduleId: 'network-optimization-terminal-4',
  title: 'Ölçü, Olasılık ve Veri İstasyonu',
  eyebrow: 'İlkokul 4. Sınıf / Ölçü, Olasılık ve Veri',
  stageLabel: 'Ölçü ve veri istasyonu',
  completeTitle: 'İstasyon hazır!',
  completeText: 'Ölçü dönüşümü, olasılık ve grafik okuma görevlerini bitirdin.',
  botCompleteText: 'İstasyon hazır! Ölçü dönüşümü, olasılık ve grafik okuma görevlerini doğru yaptın.',
  panelCompleteText: 'Ölçü, olasılık ve grafik kararları tamam.',
  score: 190,
  iconKind: 'network',
  atoms: NETWORK_OPTIMIZATION_ATOMS,
  createTasks: createNetworkOptimizationTasks,
  testIds: {
    stage: 'network-optimization-terminal-4-stage',
    controlPanel: 'network-optimization-terminal-4-control-panel',
    choice: 'network-optimization-terminal-4-choice',
    feedback: 'network-optimization-terminal-4-feedback',
    complete: 'network-optimization-terminal-4-complete',
    restart: 'network-optimization-terminal-4-restart',
  },
};

export default function NetworkOptimizationTerminal4App() {
  return <Grade4DecisionStationApp config={config} />;
}
