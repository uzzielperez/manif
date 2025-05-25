import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PromptForm from '../components/PromptForm';
import MeditationDisplay from '../components/MeditationDisplay';
import AudioControls from '../components/AudioControls';
import LoadingState from '../components/LoadingState';
import { useMeditationStore } from '../store/meditationStore';
import { useUIStore } from '../store/uiStore';
import {
  isMeditationUnlocked,
  getDownloadCredits,
  unlockMeditation,
  useDownloadCredit
} from '../utils/paymentUtils';
import { downloadTextFileUtility, downloadAudioFileUtility } from '../utils/downloadUtils';

const Home: React.FC = () => {
  const [isGeneratingInitialMeditation, setIsGeneratingInitialMeditation] = useState(false);
  const { meditation, hasMeditation } = useMeditationStore();
  const { openPaywallModal } = useUIStore();

  const [currentDisplayMeditationUnlocked, setCurrentDisplayMeditationUnlocked] = useState(false);

  useEffect(() => {
    let localCredits = getDownloadCredits(); // Get initial credits
    if (meditation?.id) {
      setCurrentDisplayMeditationUnlocked(isMeditationUnlocked(meditation.id) || localCredits > 0);
    } else {
      setCurrentDisplayMeditationUnlocked(false);
    }

    const handleStorageChange = () => {
      // Re-check credits and unlock status when localStorage changes
      localCredits = getDownloadCredits();
      if (meditation?.id) {
        setCurrentDisplayMeditationUnlocked(isMeditationUnlocked(meditation.id) || localCredits > 0);
      } else {
        setCurrentDisplayMeditationUnlocked(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [meditation]); // Re-run when meditation object changes

  const handleInitialMeditationGenerated = () => {
    setIsGeneratingInitialMeditation(false);
  };

  const performDownloadLogic = (type: 'text' | 'audio') => {
    if (!meditation) return;

    const actualDownload = () => {
      if (type === 'text') {
        downloadTextFileUtility(meditation.text, meditation.prompt);
      } else if (type === 'audio' && meditation.audioUrl) {
        downloadAudioFileUtility(meditation.audioUrl, meditation.prompt);
      }
    };

    if (isMeditationUnlocked(meditation.id)) {
      actualDownload();
    } else if (getDownloadCredits() > 0) {
      if (useDownloadCredit()) {
        unlockMeditation(meditation.id);
        setCurrentDisplayMeditationUnlocked(true);
        alert('Download credit used!');
        actualDownload();
      } else {
        // This case (credits > 0 but useDownloadCredit fails) should be rare.
        openPaywallForDownload(type);
      }
    } else {
      openPaywallForDownload(type);
    }
  };

  const openPaywallForDownload = (type: 'text' | 'audio') => {
    if (!meditation) return;
    openPaywallModal({
      meditationId: meditation.id,
      meditationPrompt: meditation.prompt,
      meditationDuration: meditation.duration,
      downloadType: type,
      audioUrl: meditation.audioUrl,
      onUnlockSuccess: () => {
        // After modal says success, re-check and perform download
        setCurrentDisplayMeditationUnlocked(isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0);
        if (isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0) {
            if(!isMeditationUnlocked(meditation.id) && getDownloadCredits() > 0) { // If it was unlocked by credit from modal
                if(useDownloadCredit()) { // consume credit
                    unlockMeditation(meditation.id); // ensure it's marked as unlocked
                } else { /* Edge case: credit used in modal but not reflected? alert? */ }
            }
            performDownloadLogic(type); // Re-trigger download logic which will now find it unlocked or use another credit
        } else {
            alert("Unlock seemed to succeed, but access is still denied. Please check your credits or try again.");
        }
      },
    });
  };

  const handleInitiateTextDownloadForDisplay = () => performDownloadLogic('text');
  const handleInitiateAudioDownloadForDisplay = () => performDownloadLogic('audio');
  
  const requestPaywallForAudioControlsHome = () => {
    if (meditation && !(isMeditationUnlocked(meditation.id) || getDownloadCredits() > 0)) {
      openPaywallModal({
        meditationId: meditation.id,
        meditationPrompt: meditation.prompt,
        meditationDuration: meditation.duration,
        downloadType: 'audio', 
        audioUrl: meditation.audioUrl,
        onUnlockSuccess: () => {
          setCurrentDisplayMeditationUnlocked(true);
          console.log('Audio unlocked via paywall from Home for AudioControls');
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-10"
    >
      {isGeneratingInitialMeditation ? (
        <LoadingState />
      ) : hasMeditation && meditation ? (
        <div className="space-y-8">
          <MeditationDisplay 
            text={meditation.text || ''} 
            isAudioAvailable={!!meditation.audioUrl}
            onInitiateTextDownload={handleInitiateTextDownloadForDisplay}
            onInitiateAudioDownload={handleInitiateAudioDownloadForDisplay}
          />
          {meditation.audioUrl && (
            <AudioControls 
              audioUrl={meditation.audioUrl} 
              hasPaid={currentDisplayMeditationUnlocked} 
              onRequestPaywall={requestPaywallForAudioControlsHome}
            />
          )}
        </div>
      ) : (
        <PromptForm onSubmit={handleInitialMeditationGenerated} /> 
      )}
    </motion.div>
  );
};

export default Home;