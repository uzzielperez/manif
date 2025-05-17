import React from 'react';
import { motion } from 'framer-motion';
import { useMeditationStore } from '../store/meditationStore';
import { Clock, Heart } from 'lucide-react';

const History: React.FC = () => {
  const { history } = useMeditationStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-6">Your Meditation History</h1>
        
        {history.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/70 text-lg">You haven't created any meditations yet.</p>
            <p className="text-white/50 mt-2">Generate your first meditation to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 hover:bg-white/10 transition-all rounded-xl p-4 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white font-medium truncate max-w-[250px] sm:max-w-md">
                    {item.prompt}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-white/60 text-sm flex items-center">
                      <Clock size={14} className="mr-1" /> {item.date}
                    </span>
                    <span className="text-white/60 text-sm flex items-center">
                      {item.duration} minutes
                    </span>
                  </div>
                </div>
                <button className="text-pink-300 hover:text-pink-200 transition-colors">
                  <Heart size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History;