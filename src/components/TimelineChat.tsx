import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, RotateCcw, Lock } from 'lucide-react';
import { getTimelineUsageCount, incrementTimelineUsage } from '../utils/paymentUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface TimelineChatProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onReset: () => void;
}

const MAX_FREE_USES = 3;

export const TimelineChat: React.FC<TimelineChatProps> = ({ 
  onSendMessage, 
  isLoading, 
  onReset 
}) => {
  const [input, setInput] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I am your Cosmic Timeline Guide. Describe a goal or a decision you are facing, and I will visualize the possible paths and cross-roads for you.',
    },
  ]);

  useEffect(() => {
    setUsageCount(getTimelineUsageCount());
  }, []);

  const isLocked = usageCount >= MAX_FREE_USES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLocked) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      await onSendMessage(input);
      const newCount = incrementTimelineUsage();
      setUsageCount(newCount);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I have updated your timeline based on your input. You can see the new paths and nodes in the visualization.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error while manifesting your timeline. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--cosmic-glass)] backdrop-blur-3xl border border-[var(--cosmic-glass-border)] rounded-[2rem] overflow-hidden shadow-2xl relative">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[var(--cosmic-accent)]/10 rounded-lg">
            <Sparkles className="text-[var(--cosmic-accent)]" size={18} />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Temporal Architect</h3>
            <p className="text-[10px] text-[var(--cosmic-text-muted)] uppercase tracking-widest font-bold">AI Pathfinding</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/20 hover:text-white"
          title="Reset Timeline"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-sm font-light leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-white text-black shadow-xl rounded-tr-none'
                    : 'bg-white/5 text-white/80 rounded-tl-none border border-white/10'
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-3 text-white/40">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs uppercase tracking-widest font-bold">Analyzing...</span>
            </div>
          </div>
        )}

        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-[var(--cosmic-glass)] backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-[var(--cosmic-primary)]/10 rounded-full flex items-center justify-center mb-6 border border-[var(--cosmic-primary)]/20 shadow-[0_0_30px_rgba(var(--cosmic-primary),0.2)]">
               <Lock className="text-[var(--cosmic-primary)]" size={24} />
            </div>
            <h4 className="text-xl font-medium text-white mb-2 text-center">Temporal Limit Reached</h4>
            <p className="text-[var(--cosmic-text-muted)] text-sm text-center font-light mb-8 leading-relaxed">
              You have used your 3 free timeline manifestations. Upgrade to **Stellar Path** to continue charting your destiny.
            </p>
            <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-[var(--cosmic-accent)] transition-all shadow-xl shadow-white/5">
              Upgrade Access
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('timelineUsageCount', '0');
                setUsageCount(0);
              }}
              className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Reset usage (Demo only)
            </button>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLocked ? "Access Locked" : "Describe your next milestone..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white font-light placeholder:text-white/20 focus:outline-none focus:border-[var(--cosmic-accent)]/40 transition-all"
            disabled={isLoading || isLocked}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isLocked}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white/40 hover:text-white disabled:opacity-0 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
           <span>Free Tier</span>
           <span>{usageCount} / {MAX_FREE_USES} Uses</span>
        </div>
      </form>
    </div>
  );
};
