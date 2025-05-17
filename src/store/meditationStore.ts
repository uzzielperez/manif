import { create } from 'zustand';

export interface Meditation {
  id: string;
  prompt: string;
  text: string;
  audioUrl?: string;
  date: string;
  duration: number;
}

interface MeditationState {
  meditation: Meditation | null;
  history: Meditation[];
  hasMeditation: boolean;
  setMeditation: (meditation: Meditation) => void;
  saveMeditation: (meditation: Meditation) => void;
  clearMeditation: () => void;
}

export const useMeditationStore = create<MeditationState>((set, get) => ({
  meditation: null,
  history: [],
  hasMeditation: false,
  
  setMeditation: (meditation) => {
    set({ 
      meditation,
      hasMeditation: true
    });
  },
  
  saveMeditation: (meditation) => {
    set(state => ({
      history: [meditation, ...state.history]
    }));
  },
  
  clearMeditation: () => {
    set({
      meditation: null,
      hasMeditation: false
    });
  }
}));