interface BackgroundMusic {
  id: string;
  name: string;
  description: string;
  url: string;
}

export const availableBackgroundMusic: BackgroundMusic[] = [
  {
    id: 'calm-water',
    name: 'Calm Waters',
    description: 'Gentle flowing water sounds with soft piano',
    url: 'https://audio.jukehost.co.uk/3IvpXJNwx7gB1ZSxVtgVSl45HS6C3Xai'
  },
  {
    id: 'forest-birds',
    name: 'Forest Ambience',
    description: 'Peaceful forest sounds with distant birds',
    url: 'https://audio.jukehost.co.uk/7qQJaORM9SRzKkZx5xB14WOvg4NQVgTl'
  },
  {
    id: 'deep-meditation',
    name: 'Deep Meditation',
    description: 'Low frequency binaural beats for deep meditation',
    url: 'https://audio.jukehost.co.uk/7mQo3uZkPGYQCeV4FYJJpQ0IgLpevw88'
  },
  {
    id: 'tibetan-bowls',
    name: 'Tibetan Singing Bowls',
    description: 'Harmonic resonance of traditional singing bowls',
    url: 'https://audio.jukehost.co.uk/3N0NVXyj5GEYY6DCi0gIbWCxZDGQb5VL'
  }
];

export const getRandomBackgroundMusic = (): BackgroundMusic => {
  const randomIndex = Math.floor(Math.random() * availableBackgroundMusic.length);
  return availableBackgroundMusic[randomIndex];
};