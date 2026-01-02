export type CosmicThemeId = 'deep-space' | 'nebula-glow' | 'stellar-dawn';

export interface CosmicTheme {
  id: CosmicThemeId;
  name: string;
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    glass: string;
    glassBorder: string;
  };
  particles: {
    count: number;
    colors: string[];
    minSize: number;
    maxSize: number;
    minSpeed: number;
    maxSpeed: number;
  };
}

export const COSMIC_THEMES: Record<CosmicThemeId, CosmicTheme> = {
  'deep-space': {
    id: 'deep-space',
    name: 'Deep Space',
    colors: {
      background: '#020617', // slate-950
      primary: '#3b82f6',    // blue-500
      secondary: '#1e40af',  // blue-800
      accent: '#60a5fa',     // blue-400
      text: '#f8fafc',       // slate-50
      textMuted: '#94a3b8',  // slate-400
      glass: 'rgba(15, 23, 42, 0.7)',
      glassBorder: 'rgba(59, 130, 246, 0.3)',
    },
    particles: {
      count: 150,
      colors: ['#ffffff', '#bfdbfe', '#3b82f6'],
      minSize: 0.5,
      maxSize: 1.5,
      minSpeed: 0.05,
      maxSpeed: 0.15,
    },
  },
  'nebula-glow': {
    id: 'nebula-glow',
    name: 'Nebula Glow',
    colors: {
      background: '#0f0714', // custom deep purple
      primary: '#d946ef',    // fuchsia-500
      secondary: '#701a75',  // fuchsia-900
      accent: '#f0abfc',     // fuchsia-300
      text: '#fdf4ff',       // fuchsia-50
      textMuted: '#d8b4fe',  // purple-300
      glass: 'rgba(24, 12, 36, 0.7)',
      glassBorder: 'rgba(217, 70, 239, 0.3)',
    },
    particles: {
      count: 200,
      colors: ['#ffffff', '#f5d0fe', '#d946ef', '#a855f7'],
      minSize: 0.5,
      maxSize: 2.0,
      minSpeed: 0.08,
      maxSpeed: 0.2,
    },
  },
  'stellar-dawn': {
    id: 'stellar-dawn',
    name: 'Stellar Dawn',
    colors: {
      background: '#0c0a09', // stone-950
      primary: '#f59e0b',    // amber-500
      secondary: '#78350f',  // amber-900
      accent: '#fbbf24',     // amber-400
      text: '#fffbeb',       // amber-50
      textMuted: '#d6d3d1',  // stone-300
      glass: 'rgba(28, 25, 23, 0.7)',
      glassBorder: 'rgba(245, 158, 11, 0.3)',
    },
    particles: {
      count: 120,
      colors: ['#ffffff', '#fef3c7', '#f59e0b', '#ea580c'],
      minSize: 0.8,
      maxSize: 1.8,
      minSpeed: 0.04,
      maxSpeed: 0.12,
    },
  },
};

