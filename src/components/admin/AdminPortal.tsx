import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketingDashboard from './MarketingDashboard';

const ADMIN_PASSWORD_KEY = 'manifest_admin_authenticated';
const ADMIN_SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const authData = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        const now = Date.now();
        if (now - timestamp < ADMIN_SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(ADMIN_PASSWORD_KEY);
        }
      } catch (e) {
        localStorage.removeItem(ADMIN_PASSWORD_KEY);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check password against environment variable or hardcoded admin password
    // In production, this should be a secure hash comparison
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'manifest-admin-2024';
    
    if (password === adminPassword) {
      // Store authentication with timestamp
      localStorage.setItem(ADMIN_PASSWORD_KEY, JSON.stringify({
        timestamp: Date.now(),
      }));
      setIsAuthenticated(true);
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-purple-300 text-sm">Enter admin password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin Password"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
              >
                Access Admin Portal
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-purple-300 hover:text-purple-200 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
        >
          Logout
        </button>
      </div>
      <MarketingDashboard />
    </div>
  );
}
