import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, Settings as SettingsIcon, Target, Sparkles, Clock, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { hasAccess } = usePayment();

  const baseNavItems = [
    { title: 'Home', path: '/', icon: <Home size={18} /> },
    { title: 'Meditations', path: '/free-meditations', icon: <Sparkles size={18} /> },
    { title: 'Timelines', path: '/timelines', icon: <Clock size={18} /> },
    { title: 'Blog', path: '/blog', icon: <Sparkles size={18} /> },
    { title: 'Enterprise', path: '/enterprise', icon: <Building2 size={18} /> },
    { title: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  const premiumNavItems = [
    { title: 'Goals', path: '/goal-template', icon: <Target size={18} /> },
  ];

  const navItems = hasAccess 
    ? [...baseNavItems.slice(0, 3), ...premiumNavItems, ...baseNavItems.slice(3)]
    : baseNavItems;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <Logo />
            <motion.div 
              className="absolute inset-0 bg-[var(--cosmic-primary)] blur-lg opacity-0 group-hover:opacity-20 transition-opacity"
            />
          </div>
          <span className="ml-4 text-2xl font-light tracking-widest text-white uppercase">Manifesto</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={location.pathname === item.path ? 'text-[var(--cosmic-accent)]' : ''}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                </span>
                {item.title}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white/70 p-2 rounded-xl hover:bg-white/5 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="bg-[var(--cosmic-glass)] backdrop-blur-2xl border border-[var(--cosmic-glass-border)] rounded-3xl p-4 shadow-2xl">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-4 rounded-2xl mb-2 transition-all ${
                    location.pathname === item.path
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`mr-4 ${location.pathname === item.path ? 'text-[var(--cosmic-accent)]' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-lg font-light">{item.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
