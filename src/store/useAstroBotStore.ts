import { create } from 'zustand';
import { BotMessageType, BotMessage } from '../components/ui/AstroBot';

interface AstroBotState {
  message: BotMessage | null;
  showMessage: (text: string, type?: BotMessageType) => void;
  clearMessage: () => void;
}

let messageSequence = 0;

export const useAstroBotStore = create<AstroBotState>((set) => ({
  message: null,
  showMessage: (text, type = 'info') => set({ message: { id: ++messageSequence, text, type } }),
  clearMessage: () => set({ message: null }),
}));
