import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Download, Volume2 } from 'lucide-react';
import { MeditationVisualizer, VisualizerType } from './MeditationVisualizer';

interface MeditationSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meditation: {
    id: string;
    title: string;
    audioUrl: string;
    category: string;
  } | null;
  voiceUrl?: string;
}

export const MeditationSessionModal: React.FC<MeditationSessionModalProps> = ({
  isOpen,
  onClose,
  meditation,
  voiceUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setAudioDuration] = useState(0);

  useEffect(() => {
    if (isOpen && meditation) {
      const audioSrc = voiceUrl || meditation.audioUrl;
      const newAudio = new Audio(audioSrc);
      
      newAudio.onloadedmetadata = () => {
        setAudioDuration(newAudio.duration);
      };

      newAudio.ontimeupdate = () => {
        setProgress(newAudio.currentTime);
      };

      newAudio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      setAudio(newAudio);
      newAudio.play().then(() => setIsPlaying(true)).catch(console.error);

      return () => {
        newAudio.pause();
        newAudio.src = '';
        setAudio(null);
      };
    }
  }, [isOpen, meditation, voiceUrl]);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (audio) {
      audio.pause();
    }
    onClose();
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const visualizerType: VisualizerType = meditation?.id === '7' 
    ? 'loving-kindness' 
    : ['Energy', 'Manifestation', 'Foundational'].includes(meditation?.category || '') 
      ? 'aura' 
      : 'chakra';

  return (
    <AnimatePresence>
      {isOpen && meditation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          <MeditationVisualizer type={visualizerType} />

          {/* Overlay Controls */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="max-w-xl text-left">
                <motion.span 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[var(--cosmic-accent)] text-xs uppercase tracking-[0.4em] font-bold block mb-2"
                >
                  Active Session • {meditation.category}
                </motion.span>
                <motion.h2 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-light text-white tracking-tight"
                >
                  {meditation.title}
                </motion.h2>
              </div>
              <button 
                onClick={handleClose}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="max-w-2xl mx-auto w-full space-y-8 bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 mb-10">
              <div className="space-y-4">
                <div className="flex justify-between text-white/40 text-xs tracking-widest uppercase font-medium px-1">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute h-full bg-[var(--cosmic-primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress / duration) * 100}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-12">
                <button className="text-white/40 hover:text-white transition-all">
                  <Volume2 size={24} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-2xl shadow-white/10"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <a 
                  href={voiceUrl || meditation.audioUrl}
                  download
                  className="text-white/40 hover:text-white transition-all"
                >
                  <Download size={24} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
