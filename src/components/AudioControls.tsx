import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, AlertTriangle } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useSettingsStore } from '../store/settingsStore';

interface AudioControlsProps {
  audioUrl?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUrl }) => {
  const { isPlaying, currentTime, duration, isLoading, error, togglePlayPause, seek, reset } = useAudioPlayer({ audioUrl });
  const { musicVolume, voiceVolume, musicEnabled, voiceEnabled } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'meditation' | 'music'>('meditation');

  // Format seconds into MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    console.log("AudioControls received audioUrl:", audioUrl);
  }, [audioUrl]);

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

      {error && (
        <div className="bg-red-900/20 text-red-300 p-3 mb-4 rounded-lg flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!audioUrl && (
        <div className="bg-yellow-900/20 text-yellow-300 p-3 mb-4 rounded-lg flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="text-sm">No audio available yet. Click the speaker button in the meditation form to generate audio.</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-white/70">Loading audio...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-400"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex justify-center items-center gap-4">
            <button 
              className="text-white/70 hover:text-white p-2"
              onClick={reset}
              disabled={!audioUrl || isLoading}
            >
              <SkipBack size={20} />
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              disabled={!audioUrl || isLoading}
              className={`${!audioUrl || isLoading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'} text-white p-4 rounded-full shadow-lg shadow-indigo-900/30`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
            
            <button 
              className="text-white/70 hover:text-white p-2"
              disabled={!audioUrl || isLoading}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Volume2 size={16} className="text-white/70" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={activeTab === 'meditation' ? voiceVolume : musicVolume} 
              className="w-full accent-indigo-400 cursor-pointer"
              disabled={activeTab === 'meditation' ? !voiceEnabled : !musicEnabled}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AudioControls;