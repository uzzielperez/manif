import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

const FreeMeditations: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-10"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block mb-6"
        >
          <Gift size={64} className="text-emerald-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Free Meditations
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
          Explore our collection of free guided meditations
        </p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20"
      >
        <div className="text-center py-12">
          <Sparkles size={48} className="text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            Free meditations collection is coming soon!
          </p>
          <p className="text-white/40 text-sm mt-2">
            Check back soon for our curated selection of free guided meditations.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FreeMeditations;

