import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BarChart3, Shield, Zap, TrendingUp, Heart, 
  Rocket, Globe, Target, Terminal, Briefcase, Plus 
} from 'lucide-react';

const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'directives' | 'projections'>('fleet');

  const stats = [
    { label: 'Fleet Members', value: '24', icon: Users, color: 'text-blue-400' },
    { label: 'Stardate Alignment', value: '87%', icon: Zap, color: 'text-amber-400' },
    { label: 'Warp meditations', value: '142', icon: Heart, color: 'text-rose-400' },
    { label: 'Manifestation Score', value: '9.2', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const directives = [
    { id: 1, title: 'Prime Directive: Clarity', status: 'Completed', priority: 'High', description: 'Ensure all crew members have identified their primary yearly manifestation target.' },
    { id: 2, title: 'Nebula Protocol: Team Cohesion', status: 'In Progress', priority: 'Critical', description: 'Weekly group meditation sessions to harmonize team vibrations.' },
    { id: 3, title: 'Quantum Growth', status: 'Upcoming', priority: 'Medium', description: 'Expansion into new market sectors using collective intentionality.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto pb-20 px-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--cosmic-accent)] rounded-lg">
              <Rocket size={20} className="text-black" />
            </div>
            <span className="text-[10px] font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.4em]">
              Starfleet Command
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-2 tracking-tight">
            Enterprise <span className="font-medium italic">Dashboard</span>
          </h1>
          <p className="text-[var(--cosmic-text-muted)] text-lg">Managing the collective destiny of **Nexus Tech**</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <Plus size={18} />
            <span className="font-medium">Invite Crew</span>
          </button>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex items-center gap-3 bg-[var(--cosmic-primary)]/10 border border-[var(--cosmic-primary)]/20 rounded-2xl px-6 py-3">
            <Shield className="text-[var(--cosmic-primary)]" size={20} />
            <span className="text-white text-sm font-bold">Fleet Admiral</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-light text-white mb-1">{stat.value}</span>
              <span className="text-xs text-[var(--cosmic-text-muted)] uppercase tracking-widest font-bold">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 mb-12 border-b border-white/10 pb-4">
        {[
          { id: 'fleet', label: 'Fleet Status', icon: Globe },
          { id: 'directives', label: 'Mission Directives', icon: Target },
          { id: 'projections', label: 'Timeline Projections', icon: Terminal },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 py-2 px-1 transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-sm font-medium uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[var(--cosmic-primary)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {activeTab === 'fleet' && (
          <>
            <div className="lg:col-span-8 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-10 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-medium text-white">Vibration Alignment Trend</h3>
                <div className="flex gap-2">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((t) => (
                    <button key={t} className="px-3 py-1 text-[10px] font-bold text-white/40 hover:text-white transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-[350px] flex items-end gap-3 px-2">
                {[65, 80, 72, 95, 88, 92, 78, 85, 90, 82, 86, 94].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className={`flex-grow rounded-t-xl relative group transition-all duration-500 hover:scale-x-110 ${i === 8 ? 'bg-[var(--cosmic-accent)] shadow-[0_0_20px_rgba(var(--cosmic-accent),0.3)]' : 'bg-white/5 hover:bg-white/20'}`}
                  >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                        {h}% SYNC
                     </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-6 px-2 text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
                <span>Stardate 2026.01</span>
                <span>Stardate 2026.12</span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-8 backdrop-blur-2xl">
                <h3 className="text-xl font-medium text-white mb-8">Active Crew</h3>
                <div className="space-y-8">
                  {[
                    { name: 'Sarah J.', role: 'Counselor', score: 98 },
                    { name: 'Mike L.', role: 'Engineering', score: 85 },
                    { name: 'Alex K.', role: 'Navigation', score: 92 },
                    { name: 'Elena R.', role: 'Tactical', score: 87 },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/40 group-hover:border-[var(--cosmic-primary)] transition-all">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{member.name}</p>
                          <p className="text-[10px] text-[var(--cosmic-text-muted)] uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--cosmic-accent)]">{member.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 py-4 bg-white/5 rounded-2xl text-xs font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                  View Roster
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'directives' && (
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {directives.map((directive, i) => (
              <motion.div
                key={directive.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-10 backdrop-blur-2xl relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    directive.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-[var(--cosmic-accent)]/20 text-[var(--cosmic-accent)]'
                  }`}>
                    {directive.priority}
                  </div>
                  <span className="text-[10px] text-white/20 font-bold">{directive.status}</span>
                </div>
                <h4 className="text-2xl font-medium text-white mb-4 tracking-tight">{directive.title}</h4>
                <p className="text-[var(--cosmic-text-muted)] font-light leading-relaxed mb-8">
                  {directive.description}
                </p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: directive.status === 'Completed' ? '100%' : '65%' }}
                    className="h-full bg-[var(--cosmic-primary)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'projections' && (
          <div className="lg:col-span-12 bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-[2.5rem] p-12 backdrop-blur-2xl text-center">
             <div className="w-20 h-20 bg-[var(--cosmic-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--cosmic-primary)]/20">
                <Briefcase className="text-[var(--cosmic-primary)]" />
             </div>
             <h3 className="text-3xl font-light text-white mb-4">Quantum Timeline Projection</h3>
             <p className="text-[var(--cosmic-text-muted)] max-w-xl mx-auto mb-10 leading-relaxed font-light">
               Advanced temporal modeling of your startup's growth trajectories. Upgrade to **Commander Tier** to unlock fleet-wide probability mapping.
             </p>
             <button className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-[var(--cosmic-accent)] transition-all">
               Upgrade Fleet
             </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnterpriseDashboard;
