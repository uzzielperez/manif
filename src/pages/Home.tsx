import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Clock, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: 1,
      title: 'AI Meditation Engine',
      subtitle: 'Forge personalized audio journeys through your subconscious desires.',
      icon: Sparkles,
      onClick: () => navigate('/generate'),
      color: 'var(--cosmic-primary)',
    },
    {
      id: 2,
      title: 'Curated Gallery',
      subtitle: 'Experience our collection of timeless, free-to-access guided sessions.',
      icon: Gift,
      onClick: () => navigate('/free-meditations'),
      color: 'var(--cosmic-accent)',
    },
    {
      id: 3,
      title: 'Timeline Architect',
      subtitle: 'Visualize your future milestones and chart the path to your highest self.',
      icon: Clock,
      onClick: () => navigate('/timelines'),
      color: 'var(--cosmic-primary)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24"
    >
      <div className="text-center mb-20 md:mb-32">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          <h1 className="text-5xl md:text-8xl font-light text-white mb-6 tracking-tight">
            Manifesto
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--cosmic-primary)] to-transparent mx-auto mb-8" />
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[var(--cosmic-text-muted)] text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
        >
          An elevated platform for conscious creation and inner transformation.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paths.map((path, index) => {
          const Icon = path.icon;
          return (
            <motion.div
              key={path.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <button
                onClick={path.onClick}
                className="relative w-full h-full text-left p-10 rounded-[2rem] bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:bg-white/[0.03] hover:border-[var(--cosmic-primary)]/40"
              >
                {/* Subtle background glow */}
                <div 
                  className="absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: path.color }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:border-[var(--cosmic-primary)]/50 group-hover:scale-110 transition-all duration-500"
                    style={{ color: path.color }}
                  >
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  
                  <h2 className="text-2xl font-medium text-white mb-4 tracking-tight group-hover:text-[var(--cosmic-primary)] transition-colors">
                    {path.title}
                  </h2>
                  
                  <p className="text-[var(--cosmic-text-muted)] text-lg font-light leading-relaxed mb-10 flex-grow">
                    {path.subtitle}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium tracking-widest uppercase">Explore</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Aesthetic flourish */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="mt-32 text-center"
      >
        <p className="text-[var(--cosmic-text-muted)] text-xs uppercase tracking-[0.5em] font-light">
          Your journey to center begins here
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Home;
