import { Grade4OperationMissionApp, type OperationMissionConfig } from '../shared/Grade4OperationMissionApp';
import { createLongMultiplicationFactory4Tasks, LONG_MULTIPLICATION_FACTORY_4_ATOMS } from './longMultiplicationFactory4Tasks';

const config: OperationMissionConfig = {
  moduleId: 'long-multiplication-factory-4',
  title: 'Uzun Çarpma Fabrikası',
  eyebrow: 'İlkokul 4. Sınıf / Uzun Çarpma',
  stageLabel: 'Çarpma üretim bandı',
  completeTitle: 'Çarpma bandı çalıştı!',
  completeText: 'Birler sonucunu, onlar sonucunu ve toplam sonucu doğru buldun.',
  botCompleteText: 'Uzun çarpma fabrikası tamam! Birler ve onlar sonuçlarını doğru topladın.',
  panelCompleteText: 'Uzun çarpma adımları tamam.',
  score: 70,
  atoms: LONG_MULTIPLICATION_FACTORY_4_ATOMS,
  createTasks: createLongMultiplicationFactory4Tasks,
  testIds: {
    stage: 'long-multiplication-factory-4-stage',
    controlPanel: 'long-multiplication-factory-4-control-panel',
    choice: 'long-multiplication-factory-4-choice',
    feedback: 'long-multiplication-factory-4-feedback',
    complete: 'long-multiplication-factory-4-complete',
    restart: 'long-multiplication-factory-4-restart',
  },
};

export default function LongMultiplicationFactory4App() {
  return <Grade4OperationMissionApp config={config} />;
}
