import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download, Volume2, Music, X } from 'lucide-react';
import { cleanupText } from '../utils/textUtils';
import { useMeditationStore } from '../store/meditationStore';

interface MeditationDisplayProps {
  text: string;
  onInitiateTextDownload: () => void;
  onInitiateAudioDownload: () => void;
  isAudioAvailable: boolean;
  audioCurrentTime?: number;
  audioDuration?: number;
  isAudioPlaying?: boolean;
}

const MeditationDisplay: React.FC<MeditationDisplayProps> = ({ 
  text, 
  onInitiateTextDownload, 
  onInitiateAudioDownload, 
  isAudioAvailable,
  audioCurrentTime = 0,
  audioDuration = 0,
  isAudioPlaying = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { meditation } = useMeditationStore();
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<{type: string, filename: string} | null>(null);
  const [sentenceTimings, setSentenceTimings] = useState<number[]>([]);

  const cleanedText = cleanupText(text);
  const sentences = cleanedText.split('. ').filter(Boolean).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate sentence timings based on character count and speaking rate
  useEffect(() => {
    if (sentences.length === 0 || audioDuration === 0) return;

    const totalCharacters = sentences.reduce((sum, sentence) => sum + sentence.length, 0);
    const avgSpeakingRate = totalCharacters / audioDuration; // characters per second
    
    let currentTime = 0;
    const timings = sentences.map(sentence => {
      const sentenceTime = currentTime;
      // Add small buffer between sentences (0.5 seconds)
      currentTime += (sentence.length / avgSpeakingRate) + 0.5;
      return sentenceTime;
    });
    
    setSentenceTimings(timings);
  }, [sentences, audioDuration]);

  // Sync text with audio playback
  useEffect(() => {
    if (!isAudioPlaying || sentenceTimings.length === 0) return;

    // Find the current sentence based on audio time
    let newIndex = 0;
    for (let i = sentenceTimings.length - 1; i >= 0; i--) {
      if (audioCurrentTime >= sentenceTimings[i]) {
        newIndex = i;
        break;
      }
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [audioCurrentTime, sentenceTimings, isAudioPlaying]);

  // Fallback to timer-based progression when audio is not playing
  useEffect(() => {
    if (isAudioPlaying || sentenceTimings.length > 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < sentences.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [sentences.length, isAudioPlaying, sentenceTimings.length]);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.active');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentIndex]);

  const handleDownload = () => {
    onInitiateTextDownload();
  };

  const handleDownloadAudio = async () => {
    onInitiateAudioDownload();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Meditation</h2>
        
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            onClick={handleDownloadAudio}
            disabled={!isAudioAvailable}
            title={isAudioAvailable ? "Download audio as MP3" : "No audio available"}
          >
            <Music size={20} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Share (coming soon)" disabled>
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-50"
            title="Download meditation text"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mb-4 p-3 bg-green-900/20 text-green-300 rounded-lg text-sm">
          <p>
            {downloadSuccess.type === 'audio' 
              ? '🎵 MP3 audio file downloaded successfully' 
              : '📄 Text file downloaded successfully'}
          </p>
          <p className="mt-1">
            Saved to your browser's Downloads folder: <code className="bg-black/30 px-2 py-1 rounded">{downloadSuccess.filename}</code>
          </p>
        </div>
      )}
      
      {isAudioPlaying && sentenceTimings.length > 0 && (
        <div className="mb-4 p-2 bg-indigo-900/20 text-indigo-300 rounded-lg text-xs text-center">
          🎧 Text synchronized with audio playback
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="text-white/90 text-lg leading-relaxed max-h-[300px] overflow-y-auto pr-4 space-y-6"
      >
        {sentences.map((sentence, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.5,
              scale: index === currentIndex ? 1.02 : 1
            }}
            className={`transition-all duration-500 ${index === currentIndex ? 'active' : ''}`}
          >
            {sentence}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default MeditationDisplay;