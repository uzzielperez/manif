import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Mic2, Moon, Sun, Gift, Copy, CheckCircle, Award, Star } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { 
  getOrCreateUserReferralCode, 
  addDownloadCredits, 
  HAS_APPLIED_REFERRAL_KEY,
  getDownloadCredits // Import for displaying current credits
} from '../utils/paymentUtils';

const APPLIED_REFERRAL_CODE_FROM_KEY = 'appliedReferralCodeFrom';
const EARNED_CREDITS_PREFIX = 'earnedCreditsForReferrer_';

const Settings: React.FC = () => {
  const { 
    musicVolume, 
    voiceVolume,
    musicEnabled,
    voiceEnabled,
    theme,
    setMusicVolume,
    setVoiceVolume,
    toggleMusic,
    toggleVoice,
    setTheme
  } = useSettingsStore();

  const [userReferralCode, setUserReferralCode] = useState('');
  const [enteredReferralCode, setEnteredReferralCode] = useState('');
  const [referralStatusMessage, setReferralStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [hasAppliedBefore, setHasAppliedBefore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [earnedReferralCredits, setEarnedReferralCredits] = useState(0);
  const [currentTotalCredits, setCurrentTotalCredits] = useState(0);

  useEffect(() => {
    const code = getOrCreateUserReferralCode();
    setUserReferralCode(code);
    setHasAppliedBefore(localStorage.getItem(HAS_APPLIED_REFERRAL_KEY) === 'true');
    
    // Load earned credits for this user (as a referrer)
    const earnedKey = EARNED_CREDITS_PREFIX + code;
    setEarnedReferralCredits(parseInt(localStorage.getItem(earnedKey) || '0', 10));

    // Load current total credits for display
    setCurrentTotalCredits(getDownloadCredits());
  }, []);

  const refreshCreditsDisplay = () => {
    setCurrentTotalCredits(getDownloadCredits());
    const code = userReferralCode || getOrCreateUserReferralCode(); // ensure userReferralCode is set
    if (code) { // only try to update earned if userReferralCode is available
        const earnedKey = EARNED_CREDITS_PREFIX + code;
        setEarnedReferralCredits(parseInt(localStorage.getItem(earnedKey) || '0', 10));
    }
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(userReferralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy referral code: ', err);
      setReferralStatusMessage({ type: 'error', message: 'Failed to copy code.' });
    });
  };

  const handleApplyReferralCode = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralStatusMessage(null);

    if (hasAppliedBefore) {
      setReferralStatusMessage({ type: 'error', message: 'You have already applied a referral code.' });
      return;
    }

    const trimmedCode = enteredReferralCode.trim().toUpperCase();
    if (!trimmedCode) {
      setReferralStatusMessage({ type: 'error', message: 'Please enter a referral code.' });
      return;
    }
    
    if (!trimmedCode.startsWith('MANIFEST-')) {
        setReferralStatusMessage({ type: 'error', message: 'Invalid referral code format.' });
        return;
    }

    if (trimmedCode === userReferralCode) {
      setReferralStatusMessage({ type: 'error', message: 'You cannot apply your own referral code.' });
      return;
    }

    console.log("Referral code applied by user:", trimmedCode);
    addDownloadCredits(2); // Grant 2 credits to the user applying the code
    localStorage.setItem(HAS_APPLIED_REFERRAL_KEY, 'true');
    localStorage.setItem(APPLIED_REFERRAL_CODE_FROM_KEY, trimmedCode); // Store who referred this user
    setHasAppliedBefore(true);
    setReferralStatusMessage({ type: 'success', message: 'Referral code applied! You received 2 free download credits.' });
    setEnteredReferralCode('');
    refreshCreditsDisplay();
  };

  const handleClaimEarnedReferralCredits = () => {
    if (earnedReferralCredits > 0) {
      addDownloadCredits(earnedReferralCredits);
      const earnedKey = EARNED_CREDITS_PREFIX + userReferralCode;
      localStorage.setItem(earnedKey, '0'); // Reset earned counter for this referrer
      setReferralStatusMessage({ type: 'success', message: `Successfully claimed ${earnedReferralCredits} referral credits!` });
      refreshCreditsDisplay();
    } else {
      setReferralStatusMessage({ type: 'error', message: 'No referral credits to claim.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-10"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Column 1: Existing Settings */}
          <div className="space-y-8">
            {/* Music Settings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Music className="text-white mr-3" size={24} />
                    <h3 className="text-xl text-white">Background Music</h3>
                </div>
                <button onClick={toggleMusic} className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${musicEnabled ? 'bg-indigo-400 justify-end' : 'bg-gray-600 justify-start'}`}><span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300" /></button>
                </div>
                <div className="flex items-center gap-4">
                <VolumeX className="text-white/70" size={18} /><input type="range" min="0" max="100" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="w-full accent-indigo-400 cursor-pointer" disabled={!musicEnabled} /><Volume2 className="text-white/70" size={18} />
                </div>
            </div>
            {/* Voice Settings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Mic2 className="text-white mr-3" size={24} /><h3 className="text-xl text-white">Voice Narration</h3>
                </div>
                <button onClick={toggleVoice} className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${voiceEnabled ? 'bg-indigo-400 justify-end' : 'bg-gray-600 justify-start'}`}><span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300" /></button>
                </div>
                <div className="flex items-center gap-4">
                <VolumeX className="text-white/70" size={18} /><input type="range" min="0" max="100" value={voiceVolume} onChange={(e) => setVoiceVolume(Number(e.target.value))} className="w-full accent-indigo-400 cursor-pointer" disabled={!voiceEnabled} /><Volume2 className="text-white/70" size={18} />
                </div>
            </div>
            {/* Theme Settings */}
            <div className="space-y-4">
                <div className="flex items-center">
                {theme === 'dark' ? <Moon className="text-white mr-3" size={24} /> : <Sun className="text-white mr-3" size={24} />}
                <h3 className="text-xl text-white">Theme</h3>
                </div>
                <div className="flex items-center gap-4">
                <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-white/20 text-white/70'}`}>Dark</button>
                <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-indigo-500 text-white' : 'bg-white/20 text-white/70'}`}>Light</button>
                <button onClick={() => setTheme('gold')} className={`px-4 py-2 rounded-lg ${theme === 'gold' ? 'bg-gold-accent text-dark-bg' : 'bg-white/20 text-white/70'}`}>Gold</button>
                </div>
            </div>
          </div>

          {/* Column 2: Referral Program */}
          <div className="space-y-8 border-t md:border-t-0 md:border-l border-white/20 pt-8 md:pt-0 md:pl-10">
            <div className="flex items-center">
              <Gift className="text-white mr-3" size={28} />
              <h2 className="text-2xl font-semibold text-white">Referral Program</h2>
            </div>
            
            <p className="text-sm text-white/70">
                Your current download credits: <span className="font-bold text-indigo-300">{currentTotalCredits}</span>
            </p>

            <div>
              <h3 className="text-lg text-white mb-2">Your Referral Code</h3>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                <span className="text-indigo-300 font-mono text-lg flex-grow break-all">{userReferralCode}</span>
                <button onClick={handleCopyReferralCode} className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors shadow-sm" title="Copy Code">
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1">Share this code. Friends get 2 credits. You get 1 credit when they claim a purchased pack!</p>
            </div>

            <div>
              <h3 className="text-lg text-white mb-2">Apply Friend's Code</h3>
              <form onSubmit={handleApplyReferralCode} className="space-y-3">
                <input type="text" value={enteredReferralCode} onChange={(e) => setEnteredReferralCode(e.target.value)} placeholder="Enter friend's code (e.g., MANIFEST-ABC123)" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 outline-none text-white placeholder:text-white/50" disabled={hasAppliedBefore} />
                <button type="submit" disabled={hasAppliedBefore || !enteredReferralCode.trim()} className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {hasAppliedBefore ? 'Referral Code Already Applied' : 'Apply Code & Get 2 Credits'}
                </button>
              </form>
            </div>
            
            {earnedReferralCredits > 0 && (
                <div className="mt-6 p-4 bg-green-800/30 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Award size={20} className="text-green-300 mr-2"/>
                        <h3 className="text-lg font-semibold text-green-200">Your Referral Rewards</h3>
                    </div>
                    <p className="text-sm text-green-200 mb-3">You have earned <span className="font-bold">{earnedReferralCredits}</span> credit(s) from your referrals!</p>
                    <button onClick={handleClaimEarnedReferralCredits} className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-colors">
                        Claim {earnedReferralCredits} Credit(s)
                    </button>
                </div>
            )}

            {referralStatusMessage && (
              <p className={`mt-3 text-sm ${referralStatusMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {referralStatusMessage.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;