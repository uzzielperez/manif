import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-20 px-4"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--cosmic-text-muted)] hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <article className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.2em] mb-4">
            <span className="bg-[var(--cosmic-accent)]/10 px-2 py-1 rounded">Philosophy</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> Jan 2, 2026</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            What It Means to Manifest: A Guide to Cosmic Alignment
          </h1>

          <div className="flex items-center justify-between border-y border-white/10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--cosmic-primary)] to-[var(--cosmic-accent)]" />
              <div>
                <p className="text-sm font-bold text-white">The Cosmic Team</p>
                <p className="text-xs text-[var(--cosmic-text-muted)]">Guides & Visionaries</p>
              </div>
            </div>
            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <div className="prose prose-invert max-w-none text-lg leading-relaxed space-y-8 text-white/80">
          <p className="text-xl text-white font-medium italic border-l-4 border-[var(--cosmic-accent)] pl-6 py-2 bg-white/5 rounded-r-xl">
            "Manifestation is not just wishing for what you want; it is aligning your entire being with the frequency of the reality you wish to inhabit."
          </p>

          <p>
            The term "manifestation" has become a buzzword in recent years, often reduced to simple "positive thinking." However, at its core, manifesting is a profound psychological and spiritual practice that involves bridging the gap between intention and reality.
          </p>

          <h2 className="text-3xl font-bold text-white pt-4">1. The Principle of Resonance</h2>
          <p>
            Everything in the universe, from the stars above to the cells in your body, is in a state of constant vibration. Resonance occurs when two systems vibrate at the same frequency. When we manifest, we are intentionally adjusting our mental, emotional, and physical "vibration" to resonate with our goals.
          </p>

          <h2 className="text-3xl font-bold text-white pt-4">2. The Role of the Subconscious</h2>
          <p>
            Our subconscious mind acts like a cosmic GPS. If you program it with doubt and scarcity, it will find paths that lead to those outcomes. Through tools like **guided meditation** and **visual timelines**, we can reprogram the subconscious to recognize and seize opportunities that align with our deepest desires.
          </p>

          <div className="bg-gradient-to-r from-[var(--cosmic-primary)]/20 to-transparent p-8 rounded-2xl border-l-2 border-[var(--cosmic-primary)] my-12">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-[var(--cosmic-primary)]" />
              Practical Tip
            </h3>
            <p>
              Start by visualizing your goals not as distant dreams, but as **existing nodes** on your current timeline. Use our interactive timeline tool to map out the steps required to bridge your current reality to that node.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white pt-4">3. Action as an Amplifier</h2>
          <p>
            Manifestation is not a substitute for action; it is a catalyst for *inspired* action. When you are aligned, the steps you take feel less like a struggle and more like a natural progression of your current path. The universe meets you halfway, but you must take the first step.
          </p>

          <p>
            As you explore this platform, remember that every meditation you complete and every path you visualize is a message to your subconscious: "I am ready for this reality."
          </p>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[var(--cosmic-text-muted)]">Ready to start your journey?</p>
          <div className="flex gap-4">
            <Link to="/generate" className="px-6 py-2.5 bg-[var(--cosmic-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all">
              Create Meditation
            </Link>
            <Link to="/timelines" className="px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
              Map Timeline
            </Link>
          </div>
        </footer>
      </article>
    </motion.div>
  );
};

export default Blog;

