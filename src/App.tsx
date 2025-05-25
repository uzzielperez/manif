import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import GlobalPaywallModal from './components/GlobalPaywallModal';
import { HomeIcon, ListCollapse, SettingsIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800">
        <BackgroundAnimation />
        <GlobalPaywallModal />
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4 relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;