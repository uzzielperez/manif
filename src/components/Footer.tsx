import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 text-white/50 text-sm text-center relative z-10">
      <p className="flex items-center justify-center">
        Made with <Heart size={14} className="mx-1 text-pink-400" /> for your highest self
      </p>
      <p className="mt-1">© {new Date().getFullYear()} Manifesto</p>
    </footer>
  );
};

export default Footer;