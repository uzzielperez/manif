import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lock } from 'lucide-react';

interface AudioControlsProps {
  audioUrl?: string;
  hasPaid?: boolean;
  onRequestPaywall?: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUrl, hasPaid, onRequestPaywall }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasHitPaywall, setHasHitPaywall] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // If user hasn't paid and reaches 50% of the audio, pause and show paywall
      if (!hasPaid && audio.currentTime >= (audio.duration * 0.5)) {
        audio.pause();
        setHasHitPaywall(true);
        if (onRequestPaywall) {
          onRequestPaywall();
        }
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioUrl, hasPaid, onRequestPaywall]);

  // Reset paywall state when payment status changes
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
          
          {/* Free preview info */}
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

          {/* Paywall message when user hits the limit */}
          {hasHitPaywall && !hasPaid && (
            <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-400/30 rounded-lg text-center">
              <Lock size={24} className="mx-auto text-indigo-300 mb-2" />
              <div className="text-indigo-200 font-medium mb-1">Preview Complete</div>
              <div className="text-white/70 text-sm">
                Unlock the full meditation to continue listening and download your audio
              </div>
            </div>
          )}

          {/* Full access message */}
          {hasPaid && (
            <div className="mt-3 text-center">
              <div className="text-green-300 text-sm">
                ✅ Full access unlocked - Enjoy your complete meditation
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AudioControls;