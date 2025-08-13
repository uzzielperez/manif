import { create } from 'zustand';

interface SettingsState {
  musicVolume: number;
  voiceVolume: number;
  musicEnabled: boolean;
  voiceEnabled: boolean;
  theme: 'dark' | 'light' | 'gold';
  
  setMusicVolume: (volume: number) => void;
  setVoiceVolume: (volume: number) => void;
  toggleMusic: () => void;
  toggleVoice: () => void;
  setTheme: (theme: 'dark' | 'light' | 'gold') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  musicVolume: 50,
  voiceVolume: 80,
  musicEnabled: true,
  voiceEnabled: true,
  theme: 'dark',
  
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setVoiceVolume: (volume) => set({ voiceVolume: volume }),
  
  toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),
  toggleVoice: () => set(state => ({ voiceEnabled: !state.voiceEnabled })),
  
  setTheme: (theme) => set({ theme })
}));