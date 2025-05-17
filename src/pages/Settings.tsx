import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Mic2, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

const Settings: React.FC = () => {
  const { 
    musicVolume, 
    voiceVolume,
    musicEnabled,
    voiceEnabled,
    theme,
    setMusicVolume,
    setVoiceVolume,
    toggleMusic,
    toggleVoice,
    setTheme
  } = useSettingsStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-6">Settings</h1>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Music className="text-white mr-3" size={24} />
                <h3 className="text-xl text-white">Background Music</h3>
              </div>
              <button 
                onClick={toggleMusic}
                className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
                  musicEnabled ? 'bg-indigo-400 justify-end' : 'bg-gray-600 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <VolumeX className="text-white/70" size={18} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={musicVolume} 
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
                disabled={!musicEnabled}
              />
              <Volume2 className="text-white/70" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic2 className="text-white mr-3" size={24} />
                <h3 className="text-xl text-white">Voice Narration</h3>
              </div>
              <button 
                onClick={toggleVoice}
                className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
                  voiceEnabled ? 'bg-indigo-400 justify-end' : 'bg-gray-600 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <VolumeX className="text-white/70" size={18} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={voiceVolume} 
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
                disabled={!voiceEnabled}
              />
              <Volume2 className="text-white/70" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              {theme === 'dark' ? 
                <Moon className="text-white mr-3" size={24} /> : 
                <Sun className="text-white mr-3" size={24} />
              }
              <h3 className="text-xl text-white">Theme</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme('dark')} 
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-white/20 text-white/70'
                }`}
              >
                Dark
              </button>
              <button 
                onClick={() => setTheme('light')} 
                className={`px-4 py-2 rounded-lg ${
                  theme === 'light' ? 'bg-indigo-500 text-white' : 'bg-white/20 text-white/70'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;