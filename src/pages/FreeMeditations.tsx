import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Search, Filter } from 'lucide-react';
import { MeditationCard } from '../components/MeditationCard';

const MOCK_MEDITATIONS = [
  {
    id: '1',
    title: 'Cosmic Grounding',
    duration: '10 min',
    category: 'Foundational',
    isDaily: true,
  },
  {
    id: '2',
    title: 'Nebula Relaxation',
    duration: '15 min',
    category: 'Sleep',
  },
  {
    id: '3',
    title: 'Solar Energy Breath',
    duration: '5 min',
    category: 'Energy',
  },
  {
    id: '4',
    title: 'Stellar Abundance',
    duration: '20 min',
    category: 'Manifestation',
  },
  {
    id: '5',
    title: 'Void Silence',
    duration: '12 min',
    category: 'Deep Zen',
  },
  {
    id: '6',
    title: 'Galactic Gratitude',
    duration: '8 min',
    category: 'Gratitude',
  },
];

const FreeMeditations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(MOCK_MEDITATIONS.map((m) => m.category))];

  const filteredMeditations = MOCK_MEDITATIONS.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const dailyMeditation = MOCK_MEDITATIONS.find((m) => m.isDaily);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto pb-20"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block mb-6 p-4 rounded-full bg-[var(--cosmic-accent)]/10"
        >
          <Sparkles size={48} className="text-[var(--cosmic-accent)]" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Cosmic Meditations
        </h1>
        <p className="text-[var(--cosmic-text-muted)] text-lg md:text-xl max-w-2xl mx-auto font-light">
          Free guided journeys through the manifesting universe
        </p>
      </div>

      {/* Featured Daily */}
      {dailyMeditation && (
        <div className="mb-16">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-white/20" />
            Daily Feature
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
             <div className="relative z-10">
                <span className="px-3 py-1 bg-[var(--cosmic-accent)] text-black text-[10px] font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                  Featured Meditation
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">{dailyMeditation.title}</h3>
                <p className="text-[var(--cosmic-text-muted)] mb-8 max-w-md">
                  A cosmic grounding practice to align your energy with the center of the galaxy. Perfect for starting your manifestation session.
                </p>
                <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-[var(--cosmic-accent)] transition-all">
                  Play Now
                </button>
             </div>
             <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/40">
                <Sparkles size={100} className="text-white/10 absolute animate-pulse" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Gift className="text-white" />
                  </div>
                  <span className="text-white/40 text-sm">Visualizer Active</span>
                </div>
             </div>
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--cosmic-primary)]/10 blur-[100px] -z-0" />
          </div>
        </div>
      )}

      {/* Gallery Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--cosmic-accent)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeditations.map((med) => (
            <MeditationCard
              key={med.id}
              title={med.title}
              duration={med.duration}
              category={med.category}
              isDaily={med.isDaily}
              onPlay={() => console.log('Play', med.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FreeMeditations;
