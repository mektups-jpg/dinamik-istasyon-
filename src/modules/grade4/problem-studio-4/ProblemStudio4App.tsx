import { Grade4OperationMissionApp, type OperationMissionConfig } from '../shared/Grade4OperationMissionApp';
import { createProblemStudio4Tasks, PROBLEM_STUDIO_4_ATOMS } from './problemStudio4Tasks';

const config: OperationMissionConfig = {
  moduleId: 'problem-studio-4',
  title: 'Problem Kur ve Çöz Atölyesi',
  eyebrow: 'İlkokul 4. Sınıf / Problem Çözme',
  stageLabel: 'Hikaye işlem stüdyosu',
  completeTitle: 'Problem stüdyosu hazır!',
  completeText: 'İşlem sırasını kullandın, hikayeyi çözdün ve işleme uygun problem tasarladın.',
  botCompleteText: 'Problem atölyesi tamam! Cümleyi işleme, işlemi de doğru hikayeye çevirdin.',
  panelCompleteText: 'Problem çözme ve kurma görevleri tamam.',
  score: 80,
  atoms: PROBLEM_STUDIO_4_ATOMS,
  createTasks: createProblemStudio4Tasks,
  testIds: {
    stage: 'problem-studio-4-stage',
    controlPanel: 'problem-studio-4-control-panel',
    choice: 'problem-studio-4-choice',
    feedback: 'problem-studio-4-feedback',
    complete: 'problem-studio-4-complete',
    restart: 'problem-studio-4-restart',
  },
};

export default function ProblemStudio4App() {
  return <Grade4OperationMissionApp config={config} />;
}
