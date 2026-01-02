import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Headphones } from 'lucide-react';

interface MeditationCardProps {
  title: string;
  duration: string;
  category: string;
  imageUrl?: string;
  isDaily?: boolean;
  onPlay: () => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  duration,
  category,
  imageUrl,
  isDaily,
  onPlay,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDaily 
          ? 'border-[var(--cosmic-accent)] bg-gradient-to-br from-[var(--cosmic-accent)]/20 to-transparent' 
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-[var(--cosmic-accent)] font-bold">
              {category}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-[var(--cosmic-accent)] transition-colors">
              {title}
            </h3>
          </div>
          {isDaily && (
            <div className="bg-[var(--cosmic-accent)] text-black p-1 rounded-full" title="Daily Cosmic Meditation">
              <Star size={14} fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Headphones size={14} />
            <span>Guided</span>
          </div>
        </div>

        <button
          onClick={onPlay}
          className="w-full py-3 bg-white/10 group-hover:bg-[var(--cosmic-primary)] text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium"
        >
          <Play size={18} fill="currentColor" />
          <span>Listen Now</span>
        </button>
      </div>

      {/* Decorative background element */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 bg-[var(--cosmic-primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--cosmic-primary)]/20 transition-all"
      />
    </motion.div>
  );
};

