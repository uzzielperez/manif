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
    name: 'Midnight Ethereal',
    colors: {
      background: '#05050a', // Almost black
      primary: '#c0a080',    // Muted gold/champagne
      secondary: '#1a1a2e',  // Very deep navy
      accent: '#d4af37',     // Metallic gold
      text: '#f8f8f8',       // Off-white
      textMuted: '#94a3b8',  // Slate
      glass: 'rgba(10, 10, 20, 0.4)',
      glassBorder: 'rgba(192, 160, 128, 0.2)',
    },
    particles: {
      count: 100,
      colors: ['#ffffff', '#c0a080', '#5c5c5c'],
      minSize: 0.3,
      maxSize: 1.2,
      minSpeed: 0.02,
      maxSpeed: 0.08,
    },
  },
  'nebula-glow': {
    id: 'nebula-glow',
    name: 'Royal Velvet',
    colors: {
      background: '#0a050f', // Deepest plum
      primary: '#9b6b9b',    // Muted amethyst
      secondary: '#2e1a3e',  // Deep violet
      accent: '#e0aaff',     // Soft lavender
      text: '#faf5ff',       // Soft white
      textMuted: '#b794f4',  // Muted purple
      glass: 'rgba(15, 5, 25, 0.4)',
      glassBorder: 'rgba(155, 107, 155, 0.2)',
    },
    particles: {
      count: 120,
      colors: ['#ffffff', '#e0aaff', '#9b6b9b'],
      minSize: 0.4,
      maxSize: 1.5,
      minSpeed: 0.03,
      maxSpeed: 0.1,
    },
  },
  'stellar-dawn': {
    id: 'stellar-dawn',
    name: 'Celestial Dawn',
    colors: {
      background: '#0f0c05', // Deep copper/charcoal
      primary: '#d49a6a',    // Muted bronze
      secondary: '#3e2c1a',  // Deep mahogany
      accent: '#ffcc33',     // Warm gold
      text: '#fffaf0',       // Ivory
      textMuted: '#d4d4d8',  // Zinc
      glass: 'rgba(20, 15, 5, 0.4)',
      glassBorder: 'rgba(212, 154, 106, 0.2)',
    },
    particles: {
      count: 80,
      colors: ['#ffffff', '#ffcc33', '#d49a6a'],
      minSize: 0.5,
      maxSize: 1.4,
      minSpeed: 0.02,
      maxSpeed: 0.07,
    },
  },
};
