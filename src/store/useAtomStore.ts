import { create } from 'zustand';

interface AtomState {
  masteredAtoms: string[];
  unlockAtom: (atomId: string) => void;
  isMastered: (atomId: string) => boolean;
}

export const useAtomStore = create<AtomState>((set, get) => ({
  masteredAtoms: [],
  unlockAtom: (atomId) => set((state) => {
    if (!state.masteredAtoms.includes(atomId)) {
      return { masteredAtoms: [...state.masteredAtoms, atomId] };
    }
    return state;
  }),
  isMastered: (atomId) => get().masteredAtoms.includes(atomId),
}));
