import { Grade4DecisionStationApp, type StationModuleConfig } from '../shared/Grade4DecisionStationApp';
import { createMeasureConversion4Tasks, MEASURE_CONVERSION_ATOMS } from '../network-optimization-terminal-4/networkOptimization4Tasks';

const config: StationModuleConfig = {
  moduleId: 'unit-converter-4',
  title: 'Ölçü Dönüşüm Makinesi',
  eyebrow: 'İlkokul 4. Sınıf / Ölçü Dönüşümü',
  stageLabel: 'Dönüşüm makinesi',
  completeTitle: 'Ölçüler dönüştü!',
  completeText: 'Milimetre, santimetre, metre, ton, kilogram ve gram dönüşümlerini doğru kurdun.',
  botCompleteText: 'Ölçü makinesi hazır! Birimleri kendi ailesi içinde doğru dönüştürdün.',
  panelCompleteText: 'Ölçü dönüşümleri tamam.',
  score: 120,
  iconKind: 'ruler',
  atoms: MEASURE_CONVERSION_ATOMS,
  createTasks: createMeasureConversion4Tasks,
  testIds: {
    stage: 'unit-converter-4-stage',
    controlPanel: 'unit-converter-4-control-panel',
    choice: 'unit-converter-4-choice',
    feedback: 'unit-converter-4-feedback',
    complete: 'unit-converter-4-complete',
    restart: 'unit-converter-4-restart',
  },
};

export default function UnitConverter4App() {
  return <Grade4DecisionStationApp config={config} />;
}
