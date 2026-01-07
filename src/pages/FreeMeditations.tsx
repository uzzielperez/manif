import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Search, Play } from 'lucide-react';
import { MeditationCard } from '../components/MeditationCard';

const MOCK_MEDITATIONS = [
  {
    id: '1',
    title: 'Cosmic Grounding',
    duration: '5 min',
    category: 'Foundational',
    isDaily: true,
    audioUrl: '/audio/free-meditations/1-cosmic-grounding.mp3',
    description: 'Connect with the earth while channeling cosmic energy for stability and presence.',
  },
  {
    id: '2',
    title: 'Nebula Relaxation',
    duration: '5 min',
    category: 'Sleep',
    audioUrl: '/audio/free-meditations/2-nebula-relaxation.mp3',
    description: 'Float through colorful nebulas as you release tension and prepare for deep rest.',
  },
  {
    id: '3',
    title: 'Solar Energy Breath',
    duration: '5 min',
    category: 'Energy',
    audioUrl: '/audio/free-meditations/3-solar-energy-breath.mp3',
    description: 'Harness the power of solar energy through breathwork to invigorate body and mind.',
  },
  {
    id: '4',
    title: 'Stellar Abundance',
    duration: '5 min',
    category: 'Manifestation',
    audioUrl: '/audio/free-meditations/4-stellar-abundance.mp3',
    description: 'Align with the infinite abundance of the universe to manifest your desires.',
  },
  {
    id: '5',
    title: 'Void Silence',
    duration: '5 min',
    category: 'Deep Zen',
    audioUrl: '/audio/free-meditations/5-void-silence.mp3',
    description: 'Experience the profound peace of the cosmic void in deep meditation.',
  },
  {
    id: '6',
    title: 'Galactic Gratitude',
    duration: '5 min',
    category: 'Gratitude',
    audioUrl: '/audio/free-meditations/6-galactic-gratitude.mp3',
    description: 'Expand your heart with cosmic gratitude for all that exists.',
  },
  {
    id: '7',
    title: 'Loving Kindness Meditation',
    duration: '5 min',
    category: 'Compassion',
    audioUrl: '/audio/free-meditations/7-loving-kindness-meditation-jameson-v2.mp3',
    description: 'Send waves of loving kindness to yourself, others, and the entire cosmos.',
    voices: [
      { name: 'Jameson', url: '/audio/free-meditations/7-loving-kindness-meditation-jameson-v2.mp3' },
      { name: 'Sarah', url: '/audio/free-meditations/7-loving-kindness-meditation-sarah.mp3' },
      { name: 'Uzi', url: '/audio/free-meditations/7-loving-kindness-meditation-uzi.mp3' },
    ],
  },
];

const FreeMeditations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['All', ...new Set(MOCK_MEDITATIONS.map((m) => m.category))];

  const filteredMeditations = MOCK_MEDITATIONS.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const dailyMeditation = MOCK_MEDITATIONS.find((m) => m.isDaily);

  const handlePlay = (meditation: typeof MOCK_MEDITATIONS[0]) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // If clicking the same meditation, just stop
    if (playingId === meditation.id) {
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    // Play new audio
    const audio = new Audio(meditation.audioUrl);
    audio.play();
    setCurrentAudio(audio);
    setPlayingId(meditation.id);

    // Reset when done
    audio.onended = () => {
      setPlayingId(null);
      setCurrentAudio(null);
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl md:text-7xl font-light text-white mb-6 tracking-tight"
          >
            Cosmic <span className="font-medium italic">Meditations</span>
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--cosmic-text-muted)] text-xl font-light leading-relaxed"
          >
            A curated sanctuary of free guided journeys to align your energy with the universe.
          </motion.p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find your practice..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-light placeholder:text-white/20 focus:outline-none focus:border-[var(--cosmic-primary)]/40 transition-all"
          />
        </div>
      </div>

      {/* Featured Daily */}
      {dailyMeditation && (
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[var(--cosmic-glass)] rounded-[2.5rem] border border-[var(--cosmic-glass-border)] overflow-hidden backdrop-blur-2xl shadow-2xl">
             <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--cosmic-accent)] animate-pulse" />
                  <span className="text-xs font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.3em]">
                    Daily Offering
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
                  {dailyMeditation.title}
                </h3>
                
                <p className="text-[var(--cosmic-text-muted)] text-lg font-light leading-relaxed mb-10 max-w-lg">
                  Rebalance your internal frequency with this foundational practice designed for deep cosmic alignment.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => dailyMeditation && handlePlay(dailyMeditation)}
                    className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-[var(--cosmic-accent)] transition-all flex items-center gap-3 shadow-lg shadow-white/5"
                  >
                    <Play size={20} fill="currentColor" />
                    {playingId === dailyMeditation?.id ? 'Stop' : 'Start Session'}
                  </button>
                  <a 
                    href={dailyMeditation?.audioUrl} 
                    download 
                    className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-all inline-block text-center"
                  >
                    Download
                  </a>
                </div>
             </div>
             
             <div className="lg:col-span-5 relative min-h-[300px] bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center border-l border-white/10">
                <div className="absolute inset-0 overflow-hidden">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.2, 1],
                       rotate: [0, 90, 180, 270, 360]
                     }}
                     transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                     className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--cosmic-primary)]/10 blur-[100px] rounded-full" 
                   />
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-md">
                    <Sparkles className="text-white/40" size={32} />
                  </div>
                  <span className="text-white/20 text-xs uppercase tracking-[0.4em] font-light">
                    Sonic Visualizer Active
                  </span>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Gallery Section */}
      <div className="space-y-12">
        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeditations.map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <MeditationCard
                title={med.title}
                duration={med.duration}
                category={med.category}
                isDaily={med.isDaily}
                onPlay={() => handlePlay(med)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FreeMeditations;
