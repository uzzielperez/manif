import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

const Timelines: React.FC = () => {
  const sampleTimeline: TimelineEvent[] = [
    {
      id: 1,
      date: 'Week 1',
      title: 'Set Your Intention',
      description: 'Define what you want to manifest and create your first personalized meditation.',
      status: 'completed',
    },
    {
      id: 2,
      date: 'Week 2',
      title: 'Daily Practice Begins',
      description: 'Establish a consistent meditation routine with guided sessions tailored to your goals.',
      status: 'completed',
    },
    {
      id: 3,
      date: 'Week 3',
      title: 'Deepening Your Practice',
      description: 'Explore advanced techniques and longer meditation sessions to strengthen your manifestation.',
      status: 'current',
    },
    {
      id: 4,
      date: 'Week 4',
      title: 'Integration & Reflection',
      description: 'Reflect on your progress and integrate your manifestations into daily life.',
      status: 'upcoming',
    },
    {
      id: 5,
      date: 'Month 2',
      title: 'Advanced Manifestation',
      description: 'Take your practice to the next level with specialized meditations for specific areas of life.',
      status: 'upcoming',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-emerald-400" size={24} />;
      case 'current':
        return <Clock className="text-amber-400" size={24} />;
      default:
        return <Circle className="text-white/30" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-400 bg-emerald-400/10';
      case 'current':
        return 'border-amber-400 bg-amber-400/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

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
          <Clock size={64} className="text-amber-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Your Manifestation Timeline
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
          Track your journey and see your progress unfold
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-amber-400 to-white/20" />

        <div className="space-y-8">
          {sampleTimeline.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 z-10">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${getStatusColor(event.status)} transition-all duration-300`}
                />
                {event.status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-amber-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>

              {/* Event card */}
              <motion.div
                whileHover={{ scale: 1.02, x: 10 }}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 ${getStatusColor(event.status)} shadow-xl transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(event.status)}
                    <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                      {event.date}
                    </span>
                  </div>
                  {event.status === 'current' && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-400/30"
                    >
                      Current
                    </motion.span>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                  {event.description}
                </p>

                {event.status === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium"
                  >
                    <CheckCircle2 size={16} />
                    <span>Completed</span>
                  </motion.div>
                )}

                {event.status === 'upcoming' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 text-white/40 text-sm"
                  >
                    <ArrowRight size={16} />
                    <span>Coming soon</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 backdrop-blur-lg rounded-2xl p-6 border border-amber-400/30 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Your Progress</h3>
            <p className="text-white/70">
              You've completed <span className="text-emerald-400 font-semibold">2 milestones</span> and are currently working on{' '}
              <span className="text-amber-400 font-semibold">1 active goal</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">40%</div>
            <div className="text-sm text-white/60">Complete</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ delay: 0.8, duration: 1 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Timelines;

