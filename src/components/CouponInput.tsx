import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, X } from 'lucide-react';

interface CouponInputProps {
  onCouponChange: (coupon: string) => void;
  initialCoupon?: string;
}

const CouponInput: React.FC<CouponInputProps> = ({ onCouponChange, initialCoupon = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(initialCoupon);

  const handleApplyCoupon = () => {
    onCouponChange(couponCode.trim());
    if (couponCode.trim()) {
      setIsOpen(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    onCouponChange('');
  };

  return (
    <div className="mt-4">
      {!isOpen && !couponCode ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <Percent size={16} />
          Have a coupon code?
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-green-400" />
            <span className="text-sm font-medium">Coupon Code</span>
          </div>
          
          {couponCode ? (
            <div className={`flex items-center justify-between rounded-lg p-3 ${
              couponCode.toUpperCase() === 'MAGIC25M' 
                ? 'bg-yellow-500/20 border border-yellow-500/30' 
                : 'bg-green-500/20 border border-green-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm ${
                  couponCode.toUpperCase() === 'MAGIC25M' 
                    ? 'text-yellow-300' 
                    : 'text-green-300'
                }`}>
                  {couponCode}
                </span>
                {couponCode.toUpperCase() === 'MAGIC25M' && (
                  <span className="text-yellow-300 text-xs font-semibold bg-yellow-500/20 px-2 py-1 rounded">
                    FREE ACCESS ✨
                  </span>
                )}
              </div>
              <button
                onClick={handleRemoveCoupon}
                className={`transition-colors ${
                  couponCode.toUpperCase() === 'MAGIC25M'
                    ? 'text-yellow-300 hover:text-yellow-200'
                    : 'text-green-300 hover:text-green-200'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code (e.g., MAGIC25M)"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-white/20 disabled:text-white/50 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Apply
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CouponInput;
