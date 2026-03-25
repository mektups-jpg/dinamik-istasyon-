import { create } from 'zustand';

interface GameState {
  score: number;
  soundEnabled: boolean;
  addScore: (points: number) => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  soundEnabled: true,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
