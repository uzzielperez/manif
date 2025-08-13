import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, Settings as SettingsIcon, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { hasAccess } = usePayment();

  const baseNavItems = [
    { title: 'Home', path: '/', icon: <Home size={18} /> },
    { title: 'Program', path: '/program', icon: <Briefcase size={18} /> },
    { title: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  const premiumNavItems = [
    { title: 'Goals', path: '/goal-template', icon: <Target size={18} /> },
  ];

  const navItems = hasAccess 
    ? [...baseNavItems.slice(0, 2), ...premiumNavItems, ...baseNavItems.slice(2)]
    : baseNavItems;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative z-20 py-4 px-6 md:px-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo />
          <span className="ml-3 text-xl font-semibold tracking-tight text-white">Manifesto</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="mt-4 py-2 bg-white/10 backdrop-blur-lg rounded-xl">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 ${
                    location.pathname === item.path
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
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