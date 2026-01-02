import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 text-white/50 text-sm text-center relative z-10 flex flex-col gap-4">
      <div className="flex items-center justify-center gap-6 mb-2">
        <Link to="/blog" className="flex items-center gap-2 hover:text-white transition-colors">
          <BookOpen size={16} />
          <span>Manifestation Blog</span>
        </Link>
        <Link to="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
        <a 
          href="https://www.buymeacoffee.com/manifesto" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[var(--cosmic-accent)] text-black px-3 py-1 rounded-full text-xs font-bold hover:scale-105 transition-transform"
        >
          ☕ Buy Me Coffee
        </a>
      </div>
      <p className="flex items-center justify-center">
        Made with <Heart size={14} className="mx-1 text-pink-400" /> for your highest self
      </p>
      <p className="mt-1">© {new Date().getFullYear()} Manifesto</p>
    </footer>
  );
};

export default Footer;