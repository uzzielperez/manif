import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lock, DollarSign } from 'lucide-react';

interface AudioControlsProps {
  audioUrl?: string;
  hasPaid?: boolean;
  onRequestPaywall?: () => void;
  onAudioTimeUpdate?: (currentTime: number, duration: number, isPlaying: boolean) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ 
  audioUrl, 
  hasPaid, 
  onRequestPaywall,
  onAudioTimeUpdate 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasHitPaywall, setHasHitPaywall] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      // Notify parent about duration
      if (onAudioTimeUpdate) {
        onAudioTimeUpdate(0, audio.duration, false);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Notify parent about time update
      if (onAudioTimeUpdate) {
        onAudioTimeUpdate(audio.currentTime, audio.duration, !audio.paused);
      }
      
      if (!hasPaid && audio.currentTime >= (audio.duration * 0.5)) {
        audio.pause();
        setHasHitPaywall(true);
        if (onRequestPaywall) {
          onRequestPaywall();
        }
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      if (onAudioTimeUpdate) {
        onAudioTimeUpdate(audio.currentTime, audio.duration, true);
      }
    };

    const onPause = () => {
      setIsPlaying(false);
      if (onAudioTimeUpdate) {
        onAudioTimeUpdate(audio.currentTime, audio.duration, false);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (onAudioTimeUpdate) {
        onAudioTimeUpdate(audio.currentTime, audio.duration, false);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl, hasPaid, onRequestPaywall, onAudioTimeUpdate]);

  useEffect(() => {
    if (hasPaid) {
      setHasHitPaywall(false);
    }
  }, [hasPaid]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
    >
      {!audioUrl && (
        <div className="bg-yellow-900/20 text-yellow-300 p-3 mb-4 rounded-lg flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="text-sm">No audio available yet. Generate your meditation to get audio.</span>
        </div>
      )}

      {audioUrl && (
        <div className="w-full flex flex-col items-center">
          <audio
            ref={audioRef}
            key={audioUrl}
            controls
            src={audioUrl}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
            style={{ outline: 'none', background: 'transparent' }}
          >
            Your browser does not support the audio element.
          </audio>
          
          {!hasPaid && duration > 0 && (
            <div className="mt-3 text-center">
              <div className="text-indigo-200 text-sm">
                🎧 Free Preview: {formatTime(duration * 0.5)} / {formatTime(duration)}
              </div>
              <div className="text-white/60 text-xs mt-1">
                Unlock full meditation to hear the complete experience
              </div>
            </div>
          )}

          {hasHitPaywall && !hasPaid && (
            <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-400/30 rounded-lg text-center">
              <Lock size={24} className="mx-auto text-indigo-300 mb-2" />
              <div className="text-indigo-200 font-medium mb-1">Preview Complete</div>
              <div className="text-white/70 text-sm mb-3">
                Unlock the full meditation to continue listening and download your audio
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRequestPaywall}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center mx-auto"
              >
                <DollarSign size={14} className="mr-1" />
                Unlock Full Meditation
              </motion.button>
            </div>
          )}

          {hasPaid && (
            <div className="mt-3 text-center">
              <div className="text-green-300 text-sm">
                ✅ Full access unlocked - Enjoy your complete meditation
              </div>
              {isPlaying && (
                <div className="text-indigo-200 text-xs mt-1">
                  📖 Text synchronized with audio
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AudioControls;