import { create } from 'zustand';

interface AtomState {
  masteredAtoms: string[];
  masteredModules: string[];
  unlockAtom: (atomId: string) => void;
  unlockModule: (moduleId: string) => void;
  isMastered: (atomId: string) => boolean;
}

export const useAtomStore = create<AtomState>((set, get) => ({
  masteredAtoms: [],
  masteredModules: [],
  unlockAtom: (atomId) => set((state) => {
    if (!state.masteredAtoms.includes(atomId)) {
      return { masteredAtoms: [...state.masteredAtoms, atomId] };
    }
    return state;
  }),
  unlockModule: (moduleId) => set((state) => {
    if (!state.masteredModules.includes(moduleId)) {
      return { masteredModules: [...state.masteredModules, moduleId] };
    }
    return state;
  }),
  isMastered: (atomId) => get().masteredAtoms.includes(atomId),
}));
