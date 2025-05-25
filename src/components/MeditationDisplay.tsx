import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download, Volume2, Music, X } from 'lucide-react';
import { cleanupText } from '../utils/textUtils';
import { useMeditationStore } from '../store/meditationStore';

interface MeditationDisplayProps {
  text: string;
}

const MeditationDisplay: React.FC<MeditationDisplayProps> = ({ text }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadType, setDownloadType] = useState<'text' | 'audio'>('text');
  const { meditation } = useMeditationStore();
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<{type: string, filename: string} | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  // Check if user is a subscriber (placeholder for future implementation)
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Clean up the text before processing
  const cleanedText = cleanupText(text);
  const sentences = cleanedText.split('. ').filter(Boolean).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < sentences.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [sentences.length]);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.active');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentIndex]);

  // Check session status
  const checkSessionStatus = async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5001/api/payment/checkout-status/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error checking session status:', error);
      return false;
    }
  };

  // Handle successful payment callback
  useEffect(() => {
    // Add a forced download check for users who've just completed payment
    const checkForPaymentReturn = () => {
      console.log("Checking for payment return...");
      
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const hasSuccessParam = urlParams.get('success') === 'true';
      const hasRedirectStatus = urlParams.get('redirect_status') === 'succeeded';
      
      // Check if the URL contains success indicators
      const urlContainsSuccess = 
        window.location.href.includes('success') || 
        window.location.href.includes('succeeded') ||
        hasSuccessParam ||
        hasRedirectStatus;
      
      console.log("URL contains success indicators:", urlContainsSuccess);
      
      // Check localStorage for payment status
      const paymentJustCompleted = localStorage.getItem('payment_completed') === 'true';
      
      if (urlContainsSuccess || paymentJustCompleted) {
        console.log("Payment success detected!");
        
        // Set payment completed flag
        localStorage.setItem('payment_completed', 'true');
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Handle the download based on the stored download type
        const storedDownloadType = localStorage.getItem('downloadType') || 'text';
        console.log("Download type:", storedDownloadType);
        
        // Trigger appropriate download
        if (storedDownloadType === 'text') {
          console.log("Triggering text download");
          handleTextDownload();
        } else if (storedDownloadType === 'audio' && meditation?.audioUrl) {
          console.log("Triggering audio download");
          handleAudioDownloadProcess();
        } else {
          console.log("No valid download type found");
          alert("Payment successful! Please click the download button again to download your content.");
        }
        
        // Clear the payment flag after processing
        setTimeout(() => {
          localStorage.removeItem('payment_completed');
        }, 5000);
      }
    };
    
    // Check immediately on component mount
    checkForPaymentReturn();
    
  }, [meditation]);
  
  // Validate coupon code
  const validateCoupon = (code: string): boolean => {
    // For now, we only accept "Magic25M" as a valid coupon
    return code.trim() === 'Magic25M';
  };
  
  // Handle coupon submission
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCoupon(couponCode)) {
      setCouponError('');
      localStorage.setItem('has_valid_coupon', 'true');
      setShowCouponInput(false);
      alert('Coupon applied successfully! You can now download for free.');
      
      // Trigger download directly with the type that was chosen
      if (downloadType === 'text') {
        handleTextDownload();
      } else if (downloadType === 'audio' && meditation?.audioUrl) {
        handleAudioDownloadProcess();
      }
    } else {
      setCouponError('Invalid coupon code. Please try again.');
    }
  };
  
  // Check if user has free access
  const hasFreeAccess = (): boolean => {
    // Check for valid coupon in localStorage or if user is subscribed
    return localStorage.getItem('has_valid_coupon') === 'true' || isSubscribed;
  };

  const createCheckoutSession = async (contentType: 'text' | 'audio') => {
    // Store the download type for after payment is complete
    localStorage.setItem('downloadType', contentType);
    
    // Check if user has free access first
    if (hasFreeAccess()) {
      console.log('User has free access. Skipping payment.');
      if (contentType === 'text') {
        handleTextDownload();
      } else if (contentType === 'audio' && meditation?.audioUrl) {
        handleAudioDownloadProcess();
      }
      return;
    }
    
    // If not free access, show coupon input option first
    setShowCouponInput(true);
  };

  const proceedToPayment = () => {
    setIsLoading(true);
    setShowCouponInput(false);
    
    try {
      // Use the production Stripe Checkout URL
      const checkoutUrl = "https://buy.stripe.com/28E8wR508gzA47Tdm4cfK01";
      console.log('Redirecting to Stripe Checkout page:', checkoutUrl);
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('There was an error setting up the payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloadType('text');
    createCheckoutSession('text');
  };

  const handleDownloadAudio = async () => {
    if (!meditation?.audioUrl) {
      alert('No audio available to download');
      return;
    }
    
    setDownloadType('audio');
    createCheckoutSession('audio');
  };

  const handleTextDownload = () => {
    try {
      // Create a download link and trigger it
      const element = document.createElement('a');
      const file = new Blob([cleanedText], {type: 'text/plain'});
      const url = URL.createObjectURL(file);
      element.href = url;
      const filename = `meditation-${Date.now()}.txt`;
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      // Show success message
      setDownloadSuccess({
        type: 'text',
        filename: filename
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading meditation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAudioDownloadProcess = async () => {
    if (!meditation?.audioUrl) {
      alert('No audio available to download');
      return;
    }

    try {
      setIsDownloadingAudio(true);
      
      // Create a clean filename based on timestamp
      const filename = `meditation-${meditation.id || Date.now()}.mp3`;
      
      // Fetch the audio data
      const response = await fetch(meditation.audioUrl);
      if (!response.ok) {
        throw new Error('Failed to download audio data');
      }
      
      const audioBlob = await response.blob();
      
      // Create a direct download link
      const url = window.URL.createObjectURL(audioBlob);
      const element = document.createElement('a');
      element.href = url;
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(element);
      
      // Show success message
      setDownloadSuccess({
        type: 'audio',
        filename: filename
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Error downloading audio file:', error);
      alert('Error downloading audio file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Meditation</h2>
        
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            onClick={handleDownloadAudio}
            disabled={isDownloadingAudio || !meditation?.audioUrl || isLoading}
            title={meditation?.audioUrl ? "Download audio as MP3" : "No audio available"}
          >
            <Music size={20} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleDownload}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-50"
            title="Download meditation text"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Coupon input popup */}
      {showCouponInput && (
        <div className="mb-6 p-4 bg-indigo-800/30 backdrop-blur-md rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-white">Premium Content</h3>
            <button 
              onClick={() => setShowCouponInput(false)} 
              className="text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-white/80 text-sm mb-4">
            This is premium content available with subscription or one-time purchase.
          </p>
          
          <form onSubmit={handleCouponSubmit} className="mb-3">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-300 text-xs mt-1">{couponError}</p>
            )}
          </form>
          
          <div className="flex justify-between">
            <button 
              onClick={proceedToPayment}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg w-full"
            >
              Continue to Payment ($4.99)
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="mb-4 p-3 bg-green-900/20 text-green-300 rounded-lg text-sm">
          <p>
            {downloadSuccess.type === 'audio' 
              ? '🎵 MP3 audio file downloaded successfully' 
              : '📄 Text file downloaded successfully'}
          </p>
          <p className="mt-1">
            Saved to your browser's Downloads folder: <code className="bg-black/30 px-2 py-1 rounded">{downloadSuccess.filename}</code>
          </p>
        </div>
      )}

      {isDownloadingAudio && (
        <div className="mb-4 p-3 flex items-center bg-indigo-900/20 text-indigo-300 rounded-lg">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-sm">Downloading audio file...</span>
        </div>
      )}
      
      {isLoading && (
        <div className="mb-4 p-3 flex items-center bg-indigo-900/20 text-indigo-300 rounded-lg">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-sm">Preparing payment...</span>
        </div>
      )}

      <div 
        ref={containerRef}
        className="text-white/90 text-lg leading-relaxed max-h-[300px] overflow-y-auto pr-4 space-y-6"
      >
        {sentences.map((sentence, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.5,
              scale: index === currentIndex ? 1.02 : 1
            }}
            className={`transition-all duration-500 ${index === currentIndex ? 'active' : ''}`}
          >
            {sentence}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default MeditationDisplay;