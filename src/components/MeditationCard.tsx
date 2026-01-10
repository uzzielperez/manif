import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Headphones, ArrowUpRight, Mic } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface Voice {
  name: string;
  url: string;
}

interface MeditationCardProps {
  meditationId: string;
  title: string;
  duration: string;
  category: string;
  imageUrl?: string;
  isDaily?: boolean;
  voices?: Voice[];
  onPlay: (voice?: Voice) => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  duration,
  category,
  imageUrl,
  isDaily,
  voices,
  onPlay,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | undefined>(voices?.[0]);

  const handlePlay = () => {
    onPlay(selectedVoice);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 bg-[var(--cosmic-glass)] backdrop-blur-xl ${
        isDaily 
          ? 'border-[var(--cosmic-accent)]/40 shadow-2xl shadow-[var(--cosmic-accent)]/5' 
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      <div className="p-10">
        <div className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--cosmic-accent)] font-bold">
              {category}
            </span>
            <h3 className="text-2xl font-medium text-white group-hover:text-[var(--cosmic-primary)] transition-colors tracking-tight">
              {title}
            </h3>
          </div>
          {isDaily ? (
            <div className="bg-[var(--cosmic-accent)] text-black p-1.5 rounded-full" title="Daily Cosmic Meditation">
              <Star size={14} fill="currentColor" />
            </div>
          ) : (
            <div className="text-white/20 group-hover:text-white/40 transition-colors">
              <ArrowUpRight size={20} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-white/40 text-xs font-light tracking-widest uppercase mb-12">
          <div className="flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones size={14} strokeWidth={1.5} />
            <span>Studio</span>
          </div>
        </div>

        {/* Voice Selector Dropdown */}
        {voices && voices.length > 1 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Mic size={12} className="text-[var(--cosmic-accent)]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Choose Voice</span>
            </div>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
                if (voice) {
                  trackEvent('meditation_voice_selected', {
                    meditation_id: meditationId,
                    meditation_title: title,
                    voice: voice.name,
                  });
                }
              }}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--cosmic-accent)] hover:bg-white/10 transition-all cursor-pointer"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name} className="bg-black">
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handlePlay}
          className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 font-bold border border-white/10 hover:border-white"
        >
          <Play size={18} fill="currentColor" />
          <span>Listen Now</span>
        </button>
      </div>

      {/* Subtle decorative background element */}
      <div 
        className="absolute -right-10 -bottom-10 w-32 h-32 bg-[var(--cosmic-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--cosmic-primary)]/10 transition-all duration-700"
      />
    </motion.div>
  );
};
