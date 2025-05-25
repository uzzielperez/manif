import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AudioControlsProps {
  audioUrl?: string;
  hasPaid?: boolean;
  onRequestPaywall?: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUrl, hasPaid, onRequestPaywall }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (!hasPaid && audio.currentTime > (audio.duration / 2)) {
        audio.currentTime = audio.duration / 2;
        audio.pause();
        if (onRequestPaywall) onRequestPaywall();
      }
    };
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioUrl, hasPaid, onRequestPaywall]);

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
          <span className="text-sm">No audio available yet. Click the speaker button in the meditation form to generate audio.</span>
        </div>
      )}

      {audioUrl && !hasPaid && (
        <div className="bg-indigo-900/20 text-indigo-200 p-3 mb-4 rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium">Please complete your purchase to play the audio.</span>
        </div>
      )}

      {audioUrl && hasPaid && (
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
            <div className="mt-2 text-indigo-200 text-xs text-center">
              Free preview: Listen to the first {Math.floor(duration/2)} seconds. Unlock the full meditation to continue.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AudioControls;