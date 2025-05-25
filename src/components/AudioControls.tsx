import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

interface AudioControlsProps {
  audioUrl?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUrl }) => {
  const { musicVolume, voiceVolume, musicEnabled, voiceEnabled } = useSettingsStore();
  const [activeTab, setActiveTab] = React.useState<'meditation' | 'music'>('meditation');

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
    >
      <div className="flex border-b border-white/10 mb-4">
        <button
          className={`py-2 px-4 flex items-center ${
            activeTab === 'meditation' 
              ? 'text-white border-b-2 border-indigo-400' 
              : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setActiveTab('meditation')}
        >
          <Volume2 size={16} className="mr-2" />
          Voice
        </button>
        <button
          className={`py-2 px-4 flex items-center ${
            activeTab === 'music' 
              ? 'text-white border-b-2 border-indigo-400' 
              : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setActiveTab('music')}
        >
          <Music size={16} className="mr-2" />
          Music
        </button>
      </div>

      {!audioUrl && (
        <div className="bg-yellow-900/20 text-yellow-300 p-3 mb-4 rounded-lg flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="text-sm">No audio available yet. Click the speaker button in the meditation form to generate audio.</span>
        </div>
      )}

      {audioUrl && (
        <div className="w-full flex flex-col items-center mt-4">
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