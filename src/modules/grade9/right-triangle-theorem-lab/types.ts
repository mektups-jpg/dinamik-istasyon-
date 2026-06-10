export type TheoremMode = 'tales' | 'euclid' | 'pythagoras';

export type TheoremToolId =
  | 'tales-slice-2-5'
  | 'tales-slice-3-5'
  | 'tales-slice-4-5'
  | 'tales-part-whole'
  | 'tales-cross-product'
  | 'euclid-height-square'
  | 'euclid-segment-product'
  | 'euclid-leg-square'
  | 'euclid-sum-segments'
  | 'pythagoras-leg-a'
  | 'pythagoras-leg-b'
  | 'pythagoras-hypotenuse'
  | 'pythagoras-sum-equation'
  | 'pythagoras-product-equation';

export interface TheoremTool {
  id: TheoremToolId;
  label: string;
  detail: string;
}

export interface TheoremMission {
  id: string;
  title: string;
  atomId: string;
  mode: TheoremMode;
  prompt: string;
  targetTools: TheoremToolId[];
  tools: TheoremTool[];
  resultLabel: string;
  success: string;
  error: string;
  hint: string;
}

export interface TheoremBuild {
  selectedTools: TheoremToolId[];
}
