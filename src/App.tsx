import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import FreeMeditations from './pages/FreeMeditations';
import Timelines from './pages/Timelines';
import Program from './pages/Program';
import Settings from './pages/Settings';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import InfluencerDashboard from './pages/InfluencerDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import GoalTemplate from './pages/GoalTemplate';
import AdminPortal from './components/admin/AdminPortal';
import Footer from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import GlobalPaywallModal from './components/GlobalPaywallModal';
import { PaymentProvider } from './context/PaymentContext';
import { useUIStore } from './store/uiStore';
import { COSMIC_THEMES } from './styles/themes/cosmic';

function App() {
  const cosmicThemeId = useUIStore((state) => state.cosmicTheme);
  const theme = useMemo(() => COSMIC_THEMES[cosmicThemeId], [cosmicThemeId]);

  return (
    <PaymentProvider>
      <Router>
        <div 
          className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text
          }}
        >
          {/* Inject dynamic CSS variables for children to use */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --cosmic-primary: ${theme.colors.primary};
              --cosmic-secondary: ${theme.colors.secondary};
              --cosmic-accent: ${theme.colors.accent};
              --cosmic-text: ${theme.colors.text};
              --cosmic-text-muted: ${theme.colors.textMuted};
              --cosmic-glass: ${theme.colors.glass};
              --cosmic-glass-border: ${theme.colors.glassBorder};
            }
          `}} />

          <BackgroundAnimation />
          <GlobalPaywallModal />
          <Navbar />
          
          <main className="flex-grow flex items-center justify-center p-4 pt-32 md:pt-40 relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/free-meditations" element={<FreeMeditations />} />
                <Route path="/timelines" element={<Timelines />} />
                <Route path="/program" element={<Program />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/enterprise" element={<EnterpriseDashboard />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/goal-template" element={<GoalTemplate />} />
                <Route path="/admin" element={<AdminPortal />} />
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
