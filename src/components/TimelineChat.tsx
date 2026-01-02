import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';

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

export const TimelineChat: React.FC<TimelineChatProps> = ({ 
  onSendMessage, 
  isLoading, 
  onReset 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I am your Cosmic Timeline Guide. Describe a goal or a decision you are facing, and I will visualize the possible paths and cross-roads for you.',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      await onSendMessage(input);
      // Assistant response is handled by the parent and reflected in the graph
      // We'll add a simple confirmation message here
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
    <div className="flex flex-col h-full bg-[var(--cosmic-glass)] backdrop-blur-xl border border-[var(--cosmic-glass-border)] rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-[var(--cosmic-glass-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[var(--cosmic-accent)]" size={20} />
          <h3 className="font-semibold text-white">Timeline Guide</h3>
        </div>
        <button 
          onClick={onReset}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          title="Reset Timeline"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user'
                    ? 'bg-[var(--cosmic-primary)] text-white rounded-tr-none shadow-[0_0_10px_rgba(var(--cosmic-primary),0.3)]'
                    : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10'
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2 text-white/60">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs">Manifesting timeline...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--cosmic-glass-border)] bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your path..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--cosmic-accent)] focus:ring-1 focus:ring-[var(--cosmic-accent)]/30 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--cosmic-accent)] hover:text-white disabled:text-white/20 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

