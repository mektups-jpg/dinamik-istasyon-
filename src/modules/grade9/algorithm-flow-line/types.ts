export type FlowBlockId =
  | 'add-students'
  | 'divide-teams'
  | 'seal-teams'
  | 'multiply-books'
  | 'subtract-budget'
  | 'seal-money'
  | 'add-scores'
  | 'divide-average'
  | 'compare-threshold'
  | 'student-ticket'
  | 'teacher-ticket'
  | 'add-cost'
  | 'budget-decision'
  | 'guess-result'
  | 'skip-model'
  | 'mix-units';

export interface FlowBlock {
  id: FlowBlockId;
  label: string;
  shortLabel: string;
  detail: string;
  tone: 'cyan' | 'green' | 'purple' | 'pink' | 'amber';
}

export type FlowBlockCopy = Partial<Pick<FlowBlock, 'label' | 'shortLabel' | 'detail'>>;

export interface FlowMission {
  id: string;
  title: string;
  atomId: string;
  story: string;
  question: string;
  target: FlowBlockId[];
  available: FlowBlockId[];
  success: string;
  error: string;
  resultLabel: string;
  hint: string;
  blockOverrides?: Partial<Record<FlowBlockId, FlowBlockCopy>>;
}

export interface FlowBuild {
  slots: (FlowBlockId | null)[];
}
