import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, DollarSign, Award,
  BarChart3, ShieldCheck, ArrowUpRight, LogOut,
} from 'lucide-react';

const SESSION_KEY = 'manifest_influencer_session';

interface InfluencerSession {
  influencer: { id: string; name: string; code: string; commissionRate: number; payoutMethod: string };
  token: string;
  expiresAt: number;
}

const InfluencerDashboard: React.FC = () => {
  const [authCode, setAuthCode] = useState('');
  const [dashboardPassword, setDashboardPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [influencer, setInfluencer] = useState<InfluencerSession['influencer'] | null>(null);
  const [stats, setStats] = useState({
    unlocks: 142,
    payments: 12,
    revenue: 299.88,
    commission: 74.97,
  });

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const session: InfluencerSession = JSON.parse(raw);
      if (session.expiresAt && session.expiresAt > Date.now() && session.influencer) {
        setInfluencer(session.influencer);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/influencer-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: authCode.trim(), password: dashboardPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid partner code or password');
        return;
      }
      if (data.success && data.influencer) {
        const session: InfluencerSession = {
          influencer: data.influencer,
          token: data.token || '',
          expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setInfluencer(data.influencer);
        setDashboardPassword('');
      } else {
        setLoginError('Invalid partner code or password');
      }
    } catch {
      setLoginError('Could not reach server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setInfluencer(null);
    setAuthCode('');
    setDashboardPassword('');
    setLoginError(null);
  };

  if (!influencer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-12 max-w-md w-full backdrop-blur-2xl text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-[var(--cosmic-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--cosmic-primary)]/20">
            <ShieldCheck className="text-[var(--cosmic-primary)]" size={32} />
          </div>
          <h1 className="text-3xl font-light text-white mb-4 tracking-tight">Partner Portal</h1>
          <p className="text-[var(--cosmic-text-muted)] mb-6 font-light leading-relaxed text-sm">
            Your <strong>referral code</strong> (e.g. FLOW20) is for links and checkout. Use your <strong>dashboard password</strong> here—only you have it.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={authCode}
              onChange={(e) => { setAuthCode(e.target.value); setLoginError(null); }}
              placeholder="Partner code (e.g. FLOW20)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-light text-center focus:outline-none focus:border-[var(--cosmic-accent)] transition-all"
              autoComplete="username"
            />
            <input
              type="password"
              value={dashboardPassword}
              onChange={(e) => { setDashboardPassword(e.target.value); setLoginError(null); }}
              placeholder="Dashboard password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-light text-center focus:outline-none focus:border-[var(--cosmic-accent)] transition-all"
              autoComplete="current-password"
            />
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-[var(--cosmic-accent)] transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Access Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto pb-20 px-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-[var(--cosmic-accent)]/20 border border-[var(--cosmic-accent)]/30 rounded-full">
              <span className="text-[10px] font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.3em]">Verified Partner</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-2 tracking-tight">
            Partner <span className="font-medium italic">Impact</span>
          </h1>
          <p className="text-[var(--cosmic-text-muted)] text-lg">Welcome back, {influencer.name}. Tracking code: **{influencer.code}**</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-2xl px-8 py-4 backdrop-blur-md">
          <div className="text-right">
            <p className="text-[10px] text-[var(--cosmic-text-muted)] uppercase tracking-widest font-bold">Commission Rate</p>
            <p className="text-xl font-bold text-white">{(influencer.commissionRate * 100)}%</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <Award className="text-[var(--cosmic-accent)]" size={24} />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Total Unlocks', value: stats.unlocks, icon: Users, color: 'text-blue-400' },
          { label: 'Paid Conversions', value: stats.payments, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Attributed Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: BarChart3, color: 'text-purple-400' },
          { label: 'Your Earnings', value: `$${stats.commission.toFixed(2)}`, icon: DollarSign, color: 'text-[var(--cosmic-accent)]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 backdrop-blur-2xl shadow-2xl group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <ArrowUpRight className="text-white/10 group-hover:text-white/30 transition-all" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-light text-white mb-1">{stat.value}</span>
              <span className="text-xs text-[var(--cosmic-text-muted)] uppercase tracking-widest font-bold">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-10 backdrop-blur-2xl">
          <h3 className="text-2xl font-medium text-white mb-10">Historical Performance</h3>
          <div className="h-[300px] flex items-end gap-3 px-2">
            {[45, 60, 30, 80, 55, 95, 70, 85, 90, 60, 75, 88].map((h, i) => (
              <div key={i} className="flex-grow rounded-t-xl bg-white/5 hover:bg-[var(--cosmic-primary)]/40 transition-all relative group h-full">
                <div 
                  className="absolute bottom-0 left-0 right-0 rounded-t-xl bg-[var(--cosmic-primary)]/20 transition-all" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-2 text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
            <span>Last 12 Months</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-10 backdrop-blur-2xl">
          <h3 className="text-2xl font-medium text-white mb-8">Next Payout</h3>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-[var(--cosmic-text-muted)] uppercase tracking-widest font-bold mb-2">Pending Balance</p>
              <p className="text-3xl font-bold text-white">$124.50</p>
            </div>
            <p className="text-sm text-[var(--cosmic-text-muted)] font-light leading-relaxed">
              Payouts are processed automatically when your balance reaches **$50.00**.
            </p>
            <button className="w-full py-4 bg-white/5 rounded-2xl text-xs font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest border border-white/10">
              Payout Settings
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfluencerDashboard;
