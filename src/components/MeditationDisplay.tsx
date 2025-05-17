import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { cleanupText } from '../utils/textUtils';

interface MeditationDisplayProps {
  text: string;
}

const MeditationDisplay: React.FC<MeditationDisplayProps> = ({ text }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
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
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors">
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