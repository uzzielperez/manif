import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download, Volume2 } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { cleanupText } from '../utils/textUtils';
import { useMeditationStore } from '../store/meditationStore';

interface MeditationDisplayProps {
  text: string;
}

const MeditationDisplay: React.FC<MeditationDisplayProps> = ({ text }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { meditation } = useMeditationStore();
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  
  // Clean up the text before processing
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
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment and download
    setIsPaymentModalOpen(false);
    // Implement download functionality here
    const element = document.createElement('a');
    const file = new Blob([cleanedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `meditation-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveAudioToServer = async () => {
    if (!meditation?.audioUrl) {
      alert('No audio available to save');
      return;
    }

    try {
      setIsSavingAudio(true);
      // Extract the base64 content from the data URL
      const base64Audio = meditation.audioUrl.split(',')[1];
      
      // Send to server to save as a file
      const response = await fetch('http://localhost:5001/api/meditations/save-audio-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          filename: `meditation-${meditation.id}`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save audio file');
      }
      
      const data = await response.json();
      setAudioFilePath(data.filePath);
      alert(`Audio saved to: ${data.filePath}\nYou can access it directly from the terminal.`);
    } catch (err: any) {
      console.error('Error saving audio file:', err);
      alert('Error saving audio file: ' + err.message);
    } finally {
      setIsSavingAudio(false);
    }
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
            onClick={handleSaveAudioToServer}
            disabled={isSavingAudio || !meditation?.audioUrl}
            title={meditation?.audioUrl ? "Save audio file to server" : "No audio available"}
          >
            <Save size={20} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {audioFilePath && (
        <div className="mb-4 p-3 bg-green-900/20 text-green-300 rounded-lg text-sm">
          <p>Audio saved to: {audioFilePath}</p>
          <p className="mt-1">Access from terminal: <code className="bg-black/30 px-2 py-1 rounded">afplay {audioFilePath}</code></p>
        </div>
      )}

      {isSavingAudio && (
        <div className="mb-4 p-3 flex items-center bg-indigo-900/20 text-indigo-300 rounded-lg">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-sm">Saving audio file to server...</span>
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
};

export default MeditationDisplay;