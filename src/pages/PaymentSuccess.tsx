import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Mail } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

interface PaymentStatus {
  success: boolean;
  status: string;
  downloadUrl?: string;
  error?: string;
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadReady, setDownloadReady] = useState(false);
  const { setHasAccess } = usePayment();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPaymentAndGenerateGuide = async () => {
      if (!sessionId) {
        setPaymentStatus({ success: false, status: 'error', error: 'No session ID provided' });
        setLoading(false);
        return;
      }

      try {
        // First, verify the payment status
        const statusResponse = await fetch(`/.netlify/functions/payment/checkout-status/${sessionId}`);
        const statusData = await statusResponse.json();

        if (statusData.success) {
          setPaymentStatus({ success: true, status: 'paid' });
          // Grant access to premium features
          setHasAccess(true);
          
          // Generate the downloadable guide
          const guideResponse = await fetch('/.netlify/functions/download/generate-guide', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          });

          if (guideResponse.ok) {
            const guideData = await guideResponse.json();
            setPaymentStatus(prev => ({ 
              ...prev!, 
              downloadUrl: guideData.downloadUrl 
            }));
            setDownloadReady(true);
          }
        } else {
          setPaymentStatus({ 
            success: false, 
            status: statusData.status, 
            error: 'Payment not completed' 
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus({ 
          success: false, 
          status: 'error', 
          error: 'Failed to verify payment' 
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndGenerateGuide();
  }, [sessionId]);

  const handleDirectDownload = () => {
    if (sessionId) {
      window.open(`/.netlify/functions/download/manifestation-guide/${sessionId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      >
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Verifying your payment...</p>
        </div>
      </motion.div>
    );
  }

  if (!paymentStatus?.success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">Payment Issue</h1>
            <p className="text-white/80 mb-6">
              {paymentStatus?.error || 'There was an issue with your payment. Please try again.'}
            </p>
            <Link
              to="/program"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Programs
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center text-white"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-white/80 mb-8">
              Welcome to the Manifestation AI Blueprint family! 🎉
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <div>
                    <h3 className="font-semibold">Download Your Starter Guide</h3>
                    <p className="text-white/70 text-sm">Get your comprehensive manifestation guide with step-by-step instructions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <div>
                    <h3 className="font-semibold">Use Our AI Meditation Tool</h3>
                    <p className="text-white/70 text-sm">Visit our home page to create personalized manifestation meditations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <div>
                    <h3 className="font-semibold">Start Your Practice</h3>
                    <p className="text-white/70 text-sm">Begin your daily manifestation routine following the guide</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {downloadReady && paymentStatus.downloadUrl ? (
                <motion.a
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  href={paymentStatus.downloadUrl}
                  download
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <Download size={20} />
                  Download Your Manifestation Guide
                </motion.a>
              ) : (
                <button
                  onClick={handleDirectDownload}
                  disabled={!sessionId}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:hover:transform-none"
                >
                  <Download size={20} />
                  Download Your Manifestation Guide
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Create AI Meditation
                </Link>
                <Link
                  to="/goal-template"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Set Your Goals
                </Link>
                <Link
                  to="/program"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  View All Programs
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-white/70 mb-2">
                <Mail size={16} />
                <span className="text-sm">Share Your Success Story</span>
              </div>
              <p className="text-sm text-white/60">
                When you manifest your desires, email us at{' '}
                <a href="mailto:uzzielperez25@gmail.com" className="text-indigo-300 hover:text-indigo-200 underline">
                  uzzielperez25@gmail.com
                </a>
                <br />
                Your story could inspire others on their journey!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
