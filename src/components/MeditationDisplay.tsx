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
}

const MeditationDisplay: React.FC<MeditationDisplayProps> = ({ text, onInitiateTextDownload, onInitiateAudioDownload, isAudioAvailable }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { meditation } = useMeditationStore();
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<{type: string, filename: string} | null>(null);

  const cleanedText = cleanupText(text);
  const sentences = cleanedText.split('. ').filter(Boolean).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [sentences.length]);

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