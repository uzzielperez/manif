import React from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Shield, Zap, TrendingUp, Heart } from 'lucide-react';

const EnterpriseDashboard: React.FC = () => {
  const stats = [
    { label: 'Team Members', value: '24', icon: Users, color: 'text-blue-400' },
    { label: 'Avg Alignment', value: '87%', icon: Zap, color: 'text-amber-400' },
    { label: 'Weekly Meditations', value: '142', icon: Heart, color: 'text-rose-400' },
    { label: 'Manifestation Score', value: '9.2', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto pb-20 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-[var(--cosmic-accent)] text-black text-[10px] font-bold rounded uppercase tracking-wider">
              Startup Package
            </span>
            <h1 className="text-3xl font-bold text-white">Founder Dashboard</h1>
          </div>
          <p className="text-[var(--cosmic-text-muted)]">Monitoring team wellness and cosmic alignment for **Nexus Tech**</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Shield className="text-[var(--cosmic-accent)]" size={18} />
            <span className="text-white text-sm font-medium">Enterprise Admin</span>
          </div>
          <button className="bg-[var(--cosmic-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[var(--cosmic-primary)]/20">
            Invite Team
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-2xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs text-white/40 font-medium">+12% vs last month</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-sm text-[var(--cosmic-text-muted)]">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-[var(--cosmic-accent)]" size={20} />
              Alignment Trends
            </h3>
            <div className="flex gap-2">
              {['W', 'M', 'Q', 'Y'].map((t) => (
                <button key={t} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${t === 'M' ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] flex items-end gap-2 px-4">
            {[40, 60, 45, 80, 55, 90, 70, 85, 95, 60, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className={`flex-grow rounded-t-lg relative group ${i % 3 === 0 ? 'bg-[var(--cosmic-primary)]' : 'bg-white/10'}`}
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h}%
                 </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] text-white/20 uppercase font-bold tracking-widest">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Sidebar Alignment List */}
        <div className="lg:col-span-1 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white mb-6">Team Alignment</h3>
          <div className="space-y-6">
            {[
              { name: 'Sarah J.', role: 'Engineering', score: 94 },
              { name: 'Mike L.', role: 'Product', score: 88 },
              { name: 'Alex K.', role: 'Design', score: 91 },
              { name: 'Elena R.', role: 'Operations', score: 82 },
              { name: 'Tom D.', role: 'Engineering', score: 76 },
            ].map((member, i) => (
              <div key={member.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/40 uppercase">
                    {member.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{member.name}</span>
                    <span className="text-[10px] text-[var(--cosmic-text-muted)] uppercase tracking-wider">{member.role}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-[var(--cosmic-accent)]">{member.score}%</span>
                  <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-[var(--cosmic-accent)]" style={{ width: `${member.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/5 transition-all">
            View All Reports
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnterpriseDashboard;

