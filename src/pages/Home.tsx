import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PromptForm from '../components/PromptForm';
import MeditationDisplay from '../components/MeditationDisplay';
import AudioControls from '../components/AudioControls';
import LoadingState from '../components/LoadingState';
import { useMeditationStore } from '../store/meditationStore';

const Home: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { meditation, hasMeditation } = useMeditationStore();

  const handleGenerateMeditation = async (prompt: string) => {
    setIsGenerating(true);
    // In a real implementation, we would call the actual API
    // For now we'll simulate a delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {isGenerating ? (
        <LoadingState />
      ) : hasMeditation ? (
        <div className="space-y-8">
          <MeditationDisplay text={meditation?.text || ''} />
          <AudioControls audioUrl={meditation?.audioUrl} />
        </div>
      ) : (
        <PromptForm onSubmit={handleGenerateMeditation} />
      )}
    </motion.div>
  );
};

export default Home;