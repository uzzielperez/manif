import React, { useState, useEffect } from 'react';
import { Users, Plus, Key, Check } from 'lucide-react';

interface InfluencerRow {
  id: string;
  name: string;
  code: string;
  commissionRate: number;
  payoutMethod: string;
  createdAt: string;
  hasPassword: boolean;
}

const adminPassword = () => process.env.REACT_APP_ADMIN_PASSWORD || 'manifest-admin-2024';

export default function InfluencerManagement() {
  const [influencers, setInfluencers] = useState<InfluencerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [commissionRate, setCommissionRate] = useState('25');
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [setPasswordFor, setSetPasswordFor] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/.netlify/functions/admin-influencers', {
        headers: { Authorization: `Bearer ${adminPassword()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setInfluencers(data.influencers || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load influencers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const rate = Math.min(100, Math.max(0, Number(commissionRate))) / 100;
      const res = await fetch('/.netlify/functions/admin-influencers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword()}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          commissionRate: rate,
          payoutMethod,
          password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setSuccess('Influencer added. Share code: ' + (data.influencer?.code || code.trim().toUpperCase()));
      setName('');
      setCode('');
      setCommissionRate('25');
      setPassword('');
      fetchInfluencers();
    } catch (e: any) {
      setError(e.message || 'Failed to add');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setPasswordFor || !newPassword.trim()) return;
    setPasswordSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/.netlify/functions/admin-influencers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword()}`,
        },
        body: JSON.stringify({ influencerId: setPasswordFor, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to set password');
      setSuccess('Password updated.');
      setSetPasswordFor(null);
      setNewPassword('');
      fetchInfluencers();
    } catch (e: any) {
      setError(e.message || 'Failed to set password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Users className="text-purple-400" size={28} />
        <h2 className="text-2xl font-bold text-white">Influencers</h2>
      </div>
      <p className="text-slate-400 text-sm">
        Add partners and set their dashboard password. Data is stored in your database only—never in the repo.
      </p>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{success}</div>
      )}

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={18} />
          Add influencer
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            required
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Code (e.g. FLOW20)"
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 uppercase"
            required
          />
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="Commission %"
              className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-24"
            />
            <span className="text-slate-400 text-sm">%</span>
          </div>
          <select
            value={payoutMethod}
            onChange={(e) => setPayoutMethod(e.target.value as 'stripe' | 'paypal')}
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
          </select>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dashboard password (private)"
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 md:col-span-2"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium disabled:opacity-50 md:col-span-2"
          >
            {submitting ? 'Adding…' : 'Add influencer'}
          </button>
        </form>
      </div>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Existing influencers</h3>
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : influencers.length === 0 ? (
          <p className="text-slate-400">None yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {influencers.map((inf) => (
              <li
                key={inf.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div>
                  <span className="font-medium text-white">{inf.name}</span>
                  <span className="text-slate-400 ml-2">({inf.code})</span>
                  <span className="text-slate-500 text-sm ml-2">
                    {(inf.commissionRate * 100).toFixed(0)}% · {inf.payoutMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {inf.hasPassword ? (
                    <span className="text-green-500/80 text-xs flex items-center gap-1">
                      <Check size={12} /> Password set
                    </span>
                  ) : (
                    <span className="text-amber-500/80 text-xs">No password</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSetPasswordFor(setPasswordFor === inf.id ? null : inf.id);
                      setNewPassword('');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm"
                  >
                    <Key size={14} />
                    {setPasswordFor === inf.id ? 'Cancel' : 'Set password'}
                  </button>
                </div>
                {setPasswordFor === inf.id && (
                  <form onSubmit={handleSetPassword} className="flex gap-2 w-full mt-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New dashboard password"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={passwordSubmitting}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm disabled:opacity-50"
                    >
                      {passwordSubmitting ? 'Saving…' : 'Save'}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
