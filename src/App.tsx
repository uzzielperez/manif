import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import FreeMeditations from './pages/FreeMeditations';
import Timelines from './pages/Timelines';
import Program from './pages/Program';
import Settings from './pages/Settings';
import PaymentSuccess from './pages/PaymentSuccess';
import GoalTemplate from './pages/GoalTemplate';
import InfluencerDashboard from './pages/InfluencerDashboard';
import Footer from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import GlobalPaywallModal from './components/GlobalPaywallModal';
import { PaymentProvider } from './context/PaymentContext';
import { useSettingsStore } from '../settingsStore';
import { HomeIcon, ListCollapse, SettingsIcon } from 'lucide-react';

function App() {
  const theme = useSettingsStore((state) => state.theme);

  const themeClasses = {
    dark: 'from-indigo-950 via-purple-900 to-violet-800',
    light: 'from-gray-100 via-gray-200 to-gray-300',
    gold: 'from-dark-bg via-black to-dark-bg',
  };

  return (
    <PaymentProvider>
      <Router>
        <div className={`min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br ${themeClasses[theme]}`}>
          <BackgroundAnimation />
          <GlobalPaywallModal />
          <Navbar />
          <main className="flex-grow flex items-center justify-center p-4 relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/free-meditations" element={<FreeMeditations />} />
                <Route path="/timelines" element={<Timelines />} />
                <Route path="/program" element={<Program />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/goal-template" element={<GoalTemplate />} />
                <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </PaymentProvider>
  );
}

export default App;