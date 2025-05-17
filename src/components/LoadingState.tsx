import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  const loadingSteps = [
    "Connecting to your intention...",
    "Generating personalized affirmations...",
    "Creating your manifestation journey...",
    "Infusing with positive energy..."
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
        className="w-16 h-16 mb-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />

      <h2 className="text-2xl text-white font-medium mb-6">Creating Your Meditation</h2>
      
      <div className="w-full max-w-md space-y-6">
        {loadingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5 }}
            className="flex items-center"
          >
            <div className="relative mr-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#6366f1", "#a855f7", "#6366f1"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: index * 0.2
                }}
                className="w-3 h-3 rounded-full bg-indigo-500"
              />
            </div>
            <span className="text-white/80">{step}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingState;