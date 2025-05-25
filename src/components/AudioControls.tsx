import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AudioControlsProps {
  audioUrl?: string;
  hasPaid?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUrl, hasPaid }) => {
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
            key={audioUrl}
            controls
            src={audioUrl}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
            style={{ outline: 'none', background: 'transparent' }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </motion.div>
  );
};

export default AudioControls;