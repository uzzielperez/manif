import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Plus, 
  Edit2, 
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle 
} from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  email: string;
  social_handle: string;
  platform: string;
  coupon_code: string;
  discount_type: string;
  discount_amount: number;
  commission_rate: number;
  is_active: boolean;
  stats?: {
    clicks: number;
    conversions: number;
    revenue: number;
    commission_owed: number;
  };
}

const InfluencerDashboard: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState({
    name: '',
    email: '',
    social_handle: '',
    platform: 'instagram',
    coupon_code: '',
    discount_type: 'percentage',
    discount_amount: 10,
    commission_rate: 30
  });

  useEffect(() => {
    // TODO: Load influencers from API
    // For now, using dummy data
    setInfluencers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        social_handle: '@sarah_manifests',
        platform: 'instagram',
        coupon_code: 'SARAH25',
        discount_type: 'percentage',
        discount_amount: 25,
        commission_rate: 30,
        is_active: true,
        stats: {
          clicks: 156,
          conversions: 12,
          revenue: 228,
          commission_owed: 68.40
        }
      },
      {
        id: '2',
        name: 'Alex Mindset',
        email: 'alex@example.com',
        social_handle: '@alex_mindset',
        platform: 'tiktok',
        coupon_code: 'ALEX15',
        discount_type: 'percentage',
        discount_amount: 15,
        commission_rate: 25,
        is_active: true,
        stats: {
          clicks: 89,
          conversions: 7,
          revenue: 133,
          commission_owed: 33.25
        }
      }
    ]);
  }, []);

  const generateCouponCode = (name: string) => {
    const cleaned = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    return cleaned.substring(0, 6) + '25';
  };

  const copyReferralLink = (couponCode: string) => {
    const link = `${window.location.origin}/program?ref=${couponCode.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const exportToCSV = () => {
    const csvData = influencers.map(inf => ({
      Name: inf.name,
      Email: inf.email,
      Handle: inf.social_handle,
      Platform: inf.platform,
      CouponCode: inf.coupon_code,
      Discount: `${inf.discount_amount}${inf.discount_type === 'percentage' ? '%' : '€'}`,
      Commission: `${inf.commission_rate}%`,
      Clicks: inf.stats?.clicks || 0,
      Conversions: inf.stats?.conversions || 0,
      Revenue: `€${inf.stats?.revenue || 0}`,
      CommissionOwed: `€${inf.stats?.commission_owed || 0}`
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `influencer-performance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddInfluencer = () => {
    // Auto-generate coupon code if not provided
    if (!newInfluencer.coupon_code) {
      setNewInfluencer(prev => ({
        ...prev,
        coupon_code: generateCouponCode(prev.name)
      }));
    }
    
    // TODO: Save to API
    console.log('Adding influencer:', newInfluencer);
    setShowAddForm(false);
    // Reset form
    setNewInfluencer({
      name: '',
      email: '',
      social_handle: '',
      platform: 'instagram',
      coupon_code: '',
      discount_type: 'percentage',
      discount_amount: 10,
      commission_rate: 30
    });
  };

  const totalStats = influencers.reduce((acc, inf) => ({
    clicks: acc.clicks + (inf.stats?.clicks || 0),
    conversions: acc.conversions + (inf.stats?.conversions || 0),
    revenue: acc.revenue + (inf.stats?.revenue || 0),
    commission_owed: acc.commission_owed + (inf.stats?.commission_owed || 0)
  }), { clicks: 0, conversions: 0, revenue: 0, commission_owed: 0 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto pb-10 text-white"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Influencer Dashboard</h1>
            <p className="text-white/70">Manage your influencer partnerships and track performance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Influencer
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-400" size={24} />
              <span className="text-white/70">Total Influencers</span>
            </div>
            <p className="text-3xl font-bold">{influencers.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <span className="text-white/70">Total Clicks</span>
            </div>
            <p className="text-3xl font-bold">{totalStats.clicks}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-purple-400" size={24} />
              <span className="text-white/70">Conversions</span>
            </div>
            <p className="text-3xl font-bold">{totalStats.conversions}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-yellow-400" size={24} />
              <span className="text-white/70">Commission Owed</span>
            </div>
            <p className="text-3xl font-bold">€{totalStats.commission_owed.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Influencer Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/5 rounded-xl p-6 mb-6"
          >
            <h3 className="text-xl font-semibold mb-4">Add New Influencer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newInfluencer.name}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <input
                type="email"
                placeholder="Email"
                value={newInfluencer.email}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, email: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <input
                type="text"
                placeholder="@social_handle"
                value={newInfluencer.social_handle}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, social_handle: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <select
                value={newInfluencer.platform}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, platform: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="text"
                placeholder="Coupon Code"
                value={newInfluencer.coupon_code}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, coupon_code: e.target.value.toUpperCase() }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Discount Amount"
                  value={newInfluencer.discount_amount}
                  onChange={(e) => setNewInfluencer(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
                <select
                  value={newInfluencer.discount_type}
                  onChange={(e) => setNewInfluencer(prev => ({ ...prev, discount_type: e.target.value }))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">€</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInfluencer}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Add Influencer
              </button>
            </div>
          </motion.div>
        )}

        {/* Influencer List */}
        <div className="space-y-4">
          {influencers.map((influencer) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{influencer.name}</h3>
                  <p className="text-white/70">{influencer.social_handle} • {influencer.platform}</p>
                  <p className="text-white/50 text-sm">{influencer.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyReferralLink(influencer.coupon_code)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy Referral Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-white/50 text-sm">Coupon Code</p>
                  <p className="font-mono font-semibold">{influencer.coupon_code}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Discount</p>
                  <p className="font-semibold">
                    {influencer.discount_amount}{influencer.discount_type === 'percentage' ? '%' : '€'}
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Clicks</p>
                  <p className="font-semibold">{influencer.stats?.clicks || 0}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Conversions</p>
                  <p className="font-semibold">{influencer.stats?.conversions || 0}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Revenue</p>
                  <p className="font-semibold">€{influencer.stats?.revenue || 0}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Commission</p>
                  <p className="font-semibold text-green-400">€{influencer.stats?.commission_owed || 0}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm">
                  Referral Link: <span className="font-mono text-indigo-300">
                    {window.location.origin}/program?ref={influencer.coupon_code.toLowerCase()}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InfluencerDashboard;


