import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore, PaywallContext } from '../store/uiStore';
import { 
  isMeditationUnlocked, 
  unlockMeditation, 
  getDownloadCredits, 
  addDownloadCredits, 
  useDownloadCredit, 
  getPriceByDuration 
} from '../utils/paymentUtils';

// Simulated payment processing function (replace with actual Stripe logic if needed on client)
const processStripePaymentClientSide = async (amount: number): Promise<boolean> => {
  console.log(`Simulating client-side processing for Stripe payment of $${amount}`);
  // In a real scenario, this would involve Stripe.js or a redirect.
  // For now, we assume redirection to Stripe happens and this modal handles post-payment.
  // We will rely on user clicking "I've paid" or a webhook for server-side validation in a full setup.
  return new Promise(resolve => setTimeout(() => resolve(true), 1500));
};

const GlobalPaywallModal: React.FC = () => {
  const {
    isPaywallModalOpen,
    paywallContext,
    couponCodeInModal,
    couponErrorInModal,
    isProcessingPaymentInModal,
    closePaywallModal,
    setCouponCodeInModal,
    setCouponErrorInModal,
    setIsProcessingPaymentInModal,
  } = useUIStore();

  // Local state for download credits display, synced from localStorage via util
  const [displayCredits, setDisplayCredits] = React.useState(getDownloadCredits());

  useEffect(() => {
    if (isPaywallModalOpen) {
      setDisplayCredits(getDownloadCredits());
    }
  }, [isPaywallModalOpen]);

  if (!isPaywallModalOpen || !paywallContext) {
    return null;
  }

  const { meditationId, meditationDuration, downloadType, onUnlockSuccess } = paywallContext;
  const currentPrice = getPriceByDuration(meditationDuration);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInModal.trim() === 'Magic25M') {
      if (meditationId) {
        unlockMeditation(meditationId);
      }
      setCouponErrorInModal('');
      alert('Coupon applied! Your content is unlocked.');
      onUnlockSuccess(); // Trigger the original download/action
      closePaywallModal();
    } else {
      setCouponErrorInModal('Invalid coupon code.');
    }
  };

  const handleClaimCredits = (amount: number) => {
    addDownloadCredits(amount);
    setDisplayCredits(getDownloadCredits()); // Update display
    alert(`You have claimed ${amount} meditation downloads!`);
    // If a meditation was pending, and now they have credits, unlock it.
    if (meditationId && getDownloadCredits() > 0) {
      if (useDownloadCredit()) {
        unlockMeditation(meditationId);
        setDisplayCredits(getDownloadCredits()); // Update display again after use
        alert('Credits used! Your content is unlocked.');
        onUnlockSuccess();
        closePaywallModal();
        return;
      }
    }
    // If no specific meditation was pending or credits not used, just update and close or stay for another action.
  };

  // This function is a placeholder for what would happen after a Stripe redirect for SINGLE meditation purchase.
  // In a real app, you'd verify payment with Stripe (e.g. using a session ID from URL params).
  const handleSimulatedPostStripePayment = async () => {
    setIsProcessingPaymentInModal(true);
    const paymentSuccessful = await processStripePaymentClientSide(currentPrice);
    setIsProcessingPaymentInModal(false);

    if (paymentSuccessful) {
      if (meditationId) {
        unlockMeditation(meditationId);
      }
      alert('Payment successful! Your content is unlocked.');
      onUnlockSuccess();
      closePaywallModal();
    } else {
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-2xl"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Unlock Meditation</h3>
        <p className="text-sm text-gray-500 mb-4">
          To access {downloadType === 'audio' ? 'audio & text' : 'text'}, please unlock with a coupon, credits, or purchase.
        </p>
        
        {/* Coupon Form */}
        <form onSubmit={handleCouponSubmit} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCodeInModal}
              onChange={(e) => setCouponCodeInModal(e.target.value)}
              placeholder="Enter coupon code (e.g., Magic25M)"
              className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              Apply
            </button>
          </div>
          {couponErrorInModal && (
            <p className="text-red-500 text-xs mt-1">{couponErrorInModal}</p>
          )}
        </form>

        <hr className="my-4"/>

        {/* Purchase Options */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Purchase Options</p>
          <a
            href="https://buy.stripe.com/28E8wR508gzA47Tdm4cfK01" // Single meditation
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => localStorage.setItem('stripe_pending_unlock_id', meditationId || 'unknown')} // Mark which ID is pending for post-redirect
            className="block w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-center text-sm shadow-sm transition-colors"
          >
            Unlock Single Meditation (~${currentPrice.toFixed(2)})
          </a>
          {/* For a real app, after redirecting to Stripe and back, you'd check URL params 
              and the 'stripe_pending_unlock_id' to finalize this specific meditation's unlock. 
              The button below simulates this for now. */}
          <button
            onClick={handleSimulatedPostStripePayment} 
            disabled={isProcessingPaymentInModal}
            className="mt-1 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-teal-700 border border-teal-600 rounded-lg text-xs"
          >
            {isProcessingPaymentInModal ? 'Processing...' : '(If you just paid for single, click to complete unlock)'}
          </button>

          <a
            href="https://buy.stripe.com/3csdUTcZH6fidmofYY" // 20 Downloads pack
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-center text-sm shadow-sm transition-colors mt-3"
          >
            €9.99 for 20 Downloads
          </a>
          <a
            href="#" // Placeholder for 50 downloads pack
            onClick={(e) => { e.preventDefault(); alert('50 download pack link not configured yet.'); }}
            className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center text-sm shadow-sm transition-colors opacity-70 cursor-not-allowed"
          >
            €20 for 50 Downloads (Coming Soon)
          </a>
        </div>
        
        <hr className="my-4"/>

        {/* Claim Credits Section */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Claim Purchased Credits</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleClaimCredits(20)}
              className="flex-1 py-2 px-2 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg text-xs border border-green-300"
            >
              Claim 20 Credits
            </button>
            <button
              onClick={() => handleClaimCredits(50)}
              disabled // No link for 50 pack yet
              className="flex-1 py-2 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg text-xs border border-blue-300 opacity-70 cursor-not-allowed"
            >
              Claim 50 Credits
            </button>
          </div>
        </div>

        {displayCredits > 0 && (
          <div className="mb-3 text-center text-green-700 text-sm bg-green-50 p-2 rounded-md">
            You have <b>{displayCredits}</b> download credits remaining.
          </div>
        )}

        <button
          onClick={() => {
            closePaywallModal();
            setCouponCodeInModal('');
            setCouponErrorInModal('');
          }}
          className="w-full mt-3 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default GlobalPaywallModal; 