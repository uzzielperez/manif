import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Download, Music, DollarSign } from 'lucide-react';
import { useMeditationStore, Meditation } from '../store/meditationStore';
import { useUIStore } from '../store/uiStore';
import { cleanupText } from '../utils/textUtils';
import { 
  isMeditationUnlocked, 
  unlockMeditation, 
  getDownloadCredits, 
  useDownloadCredit, 
  getPriceByDuration 
} from '../utils/paymentUtils';
import { downloadTextFileUtility, downloadAudioFileUtility } from '../utils/downloadUtils';
import AudioControls from './AudioControls';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
}

// Define Eleven Labs voice options
const ELEVEN_LABS_VOICES = [
  { id: "B69tnztZ1gRYSVTCL8Cv", name: "Uzi" },
  { id: "mgu2yPwXYhibgnytBnpW", name: "Lauren" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "John Doe Deep" },
  { id: "ZQe5CZNOzWyzPSCn5a3c", name: "Jameson - Guided Meditation" },
  { id: "3BU6uFpHysSBHbYVkPX1", name: "Professor Bill" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Soothing" },
  { id: "uagKcbxPLaJH7iYADCbR", name: "Alison" }
];

// Manifestation prompts
const MANIFESTATION_PROMPTS = [
  "I want to manifest abundance and success in my career...",
  "I am attracting deep, meaningful relationships...",
  "I am manifesting perfect health and vitality...",
  "I am creating financial freedom and prosperity...",
  "I am attracting opportunities for growth and learning...",
  "I am manifesting inner peace and emotional balance...",
  "I am creating a life filled with joy and purpose...",
  "I am attracting positive change and transformation..."
];

// RotatingPrompt component for animated placeholder
const RotatingPrompt: React.FC<{ onPromptChange: (prompt: string) => void }> = ({ onPromptChange }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentPromptText = MANIFESTATION_PROMPTS[currentPromptIndex];
    
    if (!isDeleting && currentIndex < currentPromptText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + currentPromptText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === currentPromptText.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false);
      const nextPromptIndex = (currentPromptIndex + 1) % MANIFESTATION_PROMPTS.length;
      setCurrentPromptIndex(nextPromptIndex);
      onPromptChange(MANIFESTATION_PROMPTS[nextPromptIndex]);
    }
  }, [currentIndex, isDeleting, currentPromptIndex, onPromptChange]);

  return (
    <span className="text-white/40">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// TypewriterText component for animated text
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <p className="text-white/40 text-sm max-w-lg mx-auto font-light italic">
      {displayText}
      <span className="animate-pulse">|</span>
    </p>
  );
};

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { setMeditation, meditation } = useMeditationStore();
  const { openPaywallModal } = useUIStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES[0].id);
  const [meditationLength, setMeditationLength] = useState("5");
  const [status, setStatus] = useState<string>('');
  const [isInitiatingDownload, setIsInitiatingDownload] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(MANIFESTATION_PROMPTS[0]);
  
  const currentMeditationIsUnlocked = meditation?.id ? isMeditationUnlocked(meditation.id) : false;
  const userHasCredits = getDownloadCredits() > 0;
  const canAccessCurrentMeditation = currentMeditationIsUnlocked || userHasCredits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsGenerating(true);
      setStatus('Generating meditation text...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); // Increased to 50 seconds
      try {
        const textResponse = await fetch('/.netlify/functions/meditations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: 'gemma2-9b-it' }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!textResponse.ok) {
          const errorText = await textResponse.text();
          throw new Error(`Failed to generate meditation text: ${errorText}`);
        }
        const meditationData = await textResponse.json();
        setStatus('Generating audio...');
        const cleanedTextForAudio = cleanupText(meditationData.content);
        const audioResponse = await fetch('/.netlify/functions/meditations/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanedTextForAudio,
            voiceId: selectedVoice,
            duration: parseInt(meditationLength)
          }),
          signal: controller.signal
        });
        if (!audioResponse.ok) {
          const errorText = await audioResponse.text();
          throw new Error(`Failed to generate audio: ${errorText}`);
        }
        const audioBuffer = await audioResponse.arrayBuffer();
        if (audioBuffer.byteLength === 0) {
          throw new Error('Audio buffer is empty');
        }
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newMeditation: Meditation = {
          id: meditationData.id,
          prompt,
          text: meditationData.content,
          audioUrl: audioUrl,
          date: new Date().toLocaleDateString(),
          duration: meditationData.duration || parseInt(meditationLength)
        };
        setMeditation(newMeditation);
        onSubmit(prompt);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('Error details:', err);
        if (err.name === 'AbortError') {
          alert('Request timed out. Please try again.');
        } else {
          alert('Error generating meditation: ' + err.message);
        }
      } finally {
        setIsGenerating(false);
        setStatus('');
      }
    }
  };

  const initiateDownload = (type: 'text' | 'audio') => {
    if (!meditation) return;
    
    const performDownload = () => {
      setIsInitiatingDownload(true);
      if (type === 'text') {
        downloadTextFileUtility(meditation.text, meditation.prompt);
      } else if (type === 'audio' && meditation.audioUrl) {
        downloadAudioFileUtility(meditation.audioUrl, meditation.prompt);
      }
      setIsInitiatingDownload(false);
    };

    if (isMeditationUnlocked(meditation.id)) {
      performDownload();
    } else if (getDownloadCredits() > 0) {
      if (useDownloadCredit()) {
        unlockMeditation(meditation.id);
        alert('Download credit used!');
        performDownload();
      } else {
        openPaywallModal({
          meditationId: meditation.id,
          meditationPrompt: meditation.prompt,
          meditationDuration: meditation.duration,
          downloadType: type,
          audioUrl: meditation.audioUrl,
          onUnlockSuccess: () => {
            if (isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0) {
                if(!isMeditationUnlocked(meditation.id) && getDownloadCredits() > 0) {
                    useDownloadCredit();
                    unlockMeditation(meditation.id);
                }
                performDownload();
            } else {
                 alert("Unlock seemed to succeed, but access is still denied. Please try again or contact support.")
            }
          }
        });
      }
    } else {
      openPaywallModal({
        meditationId: meditation.id,
        meditationPrompt: meditation.prompt,
        meditationDuration: meditation.duration,
        downloadType: type,
        audioUrl: meditation.audioUrl,
        onUnlockSuccess: () => {
            if (isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0) {
                if(!isMeditationUnlocked(meditation.id) && getDownloadCredits() > 0) {
                    useDownloadCredit();
                    unlockMeditation(meditation.id);
                }
                performDownload();
            } else {
                 alert("Unlock seemed to succeed, but access is still denied. Please try again or contact support.")
            }
        }
      });
    }
  };

  const handleTextDownloadClick = () => initiateDownload('text');
  const handleAudioDownloadClick = () => initiateDownload('audio');

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const requestPaywallForAudioControls = () => {
    if (meditation && !canAccessCurrentMeditation) {
      openPaywallModal({
        meditationId: meditation.id,
        meditationPrompt: meditation.prompt,
        meditationDuration: meditation.duration,
        downloadType: 'audio',
        audioUrl: meditation.audioUrl,
        onUnlockSuccess: () => {
          console.log('Audio unlocked via paywall for AudioControls');
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Sparkles className="text-indigo-300" size={32} />
          </motion.div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Manifestation Meditation</h1>
        <TypewriterText text="Drawing from Stanford Neuroscientist Dr. James Doty's pioneering research, manifestation is the art of consciously programming your subconscious mind through focused intention and mindful practice." />
        <p className="text-white/70 max-w-lg mx-auto mt-4">
          Enter what you'd like to manifest in your life, and we'll create a personalized guided meditation to help you attract it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`relative transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={currentPlaceholder}
            className="w-full h-32 px-5 py-4 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 outline-none text-white resize-none placeholder:text-white/40 transition-colors"
            required
          />
          
          {!isActive && !prompt && (
            <div className="absolute top-4 left-5 pointer-events-none">
              <RotatingPrompt onPromptChange={setCurrentPlaceholder} />
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 text-white/50 text-sm">
            {prompt.length} / 200
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/3">
            <label className="block text-white/70 mb-2 text-sm">Meditation Length</label>
            <select 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none"
              value={meditationLength}
              onChange={(e) => setMeditationLength(e.target.value)}
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
          
          <div className="w-full sm:w-2/3">
            <label className="block text-white/70 mb-2 text-sm">Voice</label>
            <select 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {ELEVEN_LABS_VOICES.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isGenerating || isInitiatingDownload}
            className={`flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-900/30 flex items-center justify-center ${(isGenerating || isInitiatingDownload) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? status || 'Generating...' : 'Generate Meditation & Audio'}
            <ArrowRight className="ml-2" size={18} />
          </motion.button>

          {meditation?.text && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleTextDownloadClick}
              disabled={isGenerating || isInitiatingDownload}
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-green-900/30 flex items-center justify-center"
              title={`Download Text (Price: $${getPriceByDuration(meditation.duration).toFixed(2)})`}
            >
              <Download size={18} />
              <DollarSign size={14} className="ml-1" />
            </motion.button>
          )}
          
          {meditation?.audioUrl && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAudioDownloadClick}
              disabled={isGenerating || isInitiatingDownload}
              className={`py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center ${isInitiatingDownload ? 'opacity-70 cursor-not-allowed' : ''}`}
              title={`Download MP3 (Price: $${getPriceByDuration(meditation.duration).toFixed(2)})`}
            >
              <Music size={18} />
              <DollarSign size={14} className="ml-1" />
              {isInitiatingDownload && <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            </motion.button>
          )}
        </div>
      </form>

      {isGenerating && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-3"></div>
            <p className="text-white/80 text-sm">{status || 'Processing...'}</p>
          </div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: status === 'Generating audio...' ? "60%" : "30%" }}
              transition={{ duration: 1 }}
              className="h-full bg-indigo-400"
            />
          </div>
        </div>
      )}

      {meditation?.text && meditation.audioUrl && (
        <AudioControls 
          audioUrl={meditation.audioUrl} 
          hasPaid={isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0} 
          onRequestPaywall={requestPaywallForAudioControls}
          onAudioTimeUpdate={() => {}} // No text sync needed in PromptForm
        />
      )}
    </motion.div>
  );
};

export default PromptForm;