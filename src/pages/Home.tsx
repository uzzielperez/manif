import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const gems = [
    {
      id: 1,
      title: 'Generate your own Meditations',
      subtitle: 'Create your dream',
      icon: Sparkles,
      // Premium purple-pink-violet gradient
      gradient: 'from-violet-600 via-purple-600 via-fuchsia-600 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      innerGlow: 'rgba(236, 72, 153, 0.4)',
      onClick: () => navigate('/generate'),
    },
    {
      id: 2,
      title: 'Some free meditations',
      subtitle: 'Explore our collection',
      icon: Gift,
      // Premium emerald-teal-cyan gradient
      gradient: 'from-emerald-600 via-teal-500 via-cyan-500 to-sky-500',
      glowColor: 'rgba(16, 185, 129, 0.6)',
      innerGlow: 'rgba(6, 182, 212, 0.4)',
      onClick: () => navigate('/free-meditations'),
    },
    {
      id: 3,
      title: 'Timelines',
      subtitle: 'Track your journey',
      icon: Clock,
      // Premium amber-orange-rose gradient
      gradient: 'from-amber-500 via-orange-500 via-rose-500 to-pink-500',
      glowColor: 'rgba(245, 158, 11, 0.6)',
      innerGlow: 'rgba(251, 113, 133, 0.4)',
      onClick: () => navigate('/timelines'),
      disabled: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto pb-10"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Manifesto
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Choose your path to inner peace and manifestation
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4">
        {gems.map((gem, index) => {
          const Icon = gem.icon;
          return (
            <motion.div
              key={gem.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                stiffness: 150,
                damping: 12,
              }}
              whileHover={!gem.disabled ? { scale: 1.08, y: -12 } : {}}
              whileTap={!gem.disabled ? { scale: 0.96 } : {}}
              className="relative"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl opacity-60"
                style={{
                  background: `radial-gradient(circle, ${gem.glowColor}, transparent 70%)`,
                }}
                animate={{
                  opacity: gem.disabled ? 0.3 : [0.5, 0.7, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <motion.button
                onClick={gem.onClick}
                disabled={gem.disabled}
                className={`relative w-full aspect-square rounded-full overflow-hidden ${
                  gem.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{
                  filter: gem.disabled ? 'grayscale(0.3)' : 'none',
                }}
              >
                {/* Main gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gem.gradient} rounded-full`}
                />
                
                {/* Animated inner glow */}
                {!gem.disabled && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${gem.innerGlow}, transparent 60%)`,
                    }}
                    animate={{
                      x: [0, 20, 0],
                      y: [0, 20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
                
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-sm" />
                
                {/* Inner content container */}
                <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center p-8 z-10">
                  {/* Top highlight reflection */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-sm" />
                  
                  {/* Icon with enhanced glow */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="mb-6 relative"
                  >
                    <div 
                      className="absolute inset-0 blur-xl"
                      style={{
                        background: gem.innerGlow,
                        opacity: 0.6,
                      }}
                    />
                    <Icon
                      size={72}
                      className={`relative text-white drop-shadow-2xl ${
                        gem.disabled ? 'opacity-50' : ''
                      }`}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center drop-shadow-lg">
                    {gem.title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base text-center font-medium drop-shadow-md">
                    {gem.subtitle}
                  </p>
                  
                  {gem.disabled && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 px-5 py-1.5 bg-white/25 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/30 shadow-lg"
                    >
                      Coming Soon
                    </motion.div>
                  )}
                </div>
                
                {/* Premium shimmer effect */}
                {!gem.disabled && (
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)`,
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 200%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
                
                {/* Animated border glow */}
                {!gem.disabled && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `0 0 30px ${gem.glowColor}, inset 0 0 20px ${gem.innerGlow}`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 30px ${gem.glowColor}, inset 0 0 20px ${gem.innerGlow}`,
                        `0 0 50px ${gem.glowColor}, inset 0 0 30px ${gem.innerGlow}`,
                        `0 0 30px ${gem.glowColor}, inset 0 0 20px ${gem.innerGlow}`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.button>
              
              {/* Bottom shadow for depth */}
              <div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-50"
                style={{
                  background: gem.glowColor,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Home;
