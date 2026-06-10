import { Grade4OperationMissionApp, type OperationMissionConfig } from '../shared/Grade4OperationMissionApp';
import { createDivisionDetective4Tasks, DIVISION_DETECTIVE_4_ATOMS } from './divisionDetective4Tasks';

const config: OperationMissionConfig = {
  moduleId: 'division-detective-4',
  title: 'Bölme Dedektifi',
  eyebrow: 'İlkokul 4. Sınıf / Kalanlı ve Kalansız Bölme',
  stageLabel: 'Kalan dedektif masası',
  completeTitle: 'Bölme izi çözüldü!',
  completeText: 'Kalansız bölmede kalan olmadığını, kalanlı bölmede kalanın bölen sayıdan küçük kaldığını doğru ayırdın.',
  botCompleteText: 'Bölme dedektifi tamam! Bölüm ve kalan izlerini doğru okudun.',
  panelCompleteText: 'Bölüm ve kalan kontrolü tamam.',
  score: 70,
  atoms: DIVISION_DETECTIVE_4_ATOMS,
  createTasks: createDivisionDetective4Tasks,
  testIds: {
    stage: 'division-detective-4-stage',
    controlPanel: 'division-detective-4-control-panel',
    choice: 'division-detective-4-choice',
    feedback: 'division-detective-4-feedback',
    complete: 'division-detective-4-complete',
    restart: 'division-detective-4-restart',
  },
};

export default function DivisionDetective4App() {
  return <Grade4OperationMissionApp config={config} />;
}
