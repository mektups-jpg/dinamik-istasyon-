import { create } from 'zustand';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

interface AtomState {
  masteredAtoms: string[];
  masteredModules: string[];
  uid: string | null;
  displayName: string;
  role: 'student' | 'guest';
  
  unlockAtom: (atomId: string) => void;
  unlockModule: (moduleId: string) => void;
  isMastered: (atomId: string) => boolean;
  
  setFirestoreSync: (atoms: string[], modules: string[], uid: string | null, name: string, role: string) => void;
}

export const useAtomStore = create<AtomState>((set, get) => ({
  masteredAtoms: [],
  masteredModules: [],
  uid: null,
  displayName: '',
  role: 'guest',

  unlockAtom: async (atomId) => {
    const state = get();
    if (!state.masteredAtoms.includes(atomId)) {
      const newAtoms = [...state.masteredAtoms, atomId];
      set({ masteredAtoms: newAtoms });
      
      if (state.uid) {
        try {
          await updateDoc(doc(db, 'users', state.uid), {
            masteredAtoms: newAtoms,
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to sync atom:", err);
        }
      }
    }
  },
  
  unlockModule: async (moduleId) => {
    const state = get();
    if (!state.masteredModules.includes(moduleId)) {
      const newModules = [...state.masteredModules, moduleId];
      set({ masteredModules: newModules });
      
      if (state.uid) {
        try {
          await updateDoc(doc(db, 'users', state.uid), {
            masteredModules: newModules,
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to sync module:", err);
        }
      }
    }
  },
  
  isMastered: (atomId) => get().masteredAtoms.includes(atomId),
  
  setFirestoreSync: (atoms, modules, uid, name, role) => 
    set({ masteredAtoms: atoms, masteredModules: modules, uid, displayName: name, role: role as any })
}));
