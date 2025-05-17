import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Download, Music, DollarSign } from 'lucide-react';
import { useMeditationStore } from '../store/meditationStore';
import { cleanupText } from '../utils/textUtils';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
}

// Define Eleven Labs voice options
const ELEVEN_LABS_VOICES = [
  { id: "29vD33N1CtxCmqQRPOHJ", name: "Rachel - Calm" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Soothing" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam - Gentle" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam - Clear" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli - Peaceful" }
];

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { setMeditation, meditation } = useMeditationStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES[0].id);
  const [meditationLength, setMeditationLength] = useState("5");
  const [status, setStatus] = useState<string>('');
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentForAudio, setPaymentForAudio] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      try {
        setIsGenerating(true);
        setStatus('Generating meditation text...');
        
        // Step 1: Generate meditation text
        console.log('Sending request to generate meditation...');
        const textResponse = await fetch('http://localhost:5001/api/meditations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: 'allam-2-7b' }) // Using Anthropic Allam 2 7B model
        });
        
        if (!textResponse.ok) {
          const errorText = await textResponse.text();
          console.error('API Error:', textResponse.status, errorText);
          throw new Error('Failed to generate meditation text');
        }
        
        const meditationData = await textResponse.json();
        console.log('Received meditation:', meditationData);
        
        // Step 2: Generate audio from the meditation text
        setStatus('Generating audio...');
        console.log('Generating audio for meditation...');
        
        const cleanedText = cleanupText(meditationData.content);
        
        const audioResponse = await fetch('http://localhost:5001/api/meditations/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanedText,
            voiceId: selectedVoice,
            duration: parseInt(meditationLength)
          })
        });
        
        if (!audioResponse.ok) {
          const errorText = await audioResponse.text();
          console.error('Audio API Error:', audioResponse.status, errorText);
          throw new Error('Failed to generate audio');
        }
        
        const audioData = await audioResponse.json();
        console.log('Audio generated successfully:', audioData);
        
        // Step 3: Set the complete meditation with text and audio
        setMeditation({
          id: meditationData.id,
          prompt,
          text: meditationData.content,
          audioUrl: audioData.audioUrl,
          date: new Date().toLocaleDateString(),
          duration: meditationData.duration || parseInt(meditationLength)
        });
        
        onSubmit(prompt);
      } catch (err: any) {
        console.error('Error details:', err);
        alert('Error: ' + err.message);
      } finally {
        setIsGenerating(false);
        setStatus('');
      }
    }
  };

  const getPriceByDuration = (duration: number): number => {
    if (duration <= 5) return 2.99;
    if (duration <= 10) return 4.99;
    return 4.99; // Default to higher price if duration is longer
  };

  const processPayment = async (amount: number): Promise<boolean> => {
    // This is a mock payment processing function
    // In a real app, you would integrate with a payment processor like Stripe
    setIsProcessingPayment(true);
    
    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, always succeed
    setIsProcessingPayment(false);
    return true;
  };

  const handleDownload = async () => {
    if (!meditation?.text) return;
    
    const price = getPriceByDuration(meditation.duration || parseInt(meditationLength));
    setPaymentAmount(price);
    setPaymentForAudio(false);
    setShowPaymentModal(true);
  };

  const handleAudioDownload = async () => {
    if (!meditation?.text || !meditation?.audioUrl) return;
    
    const price = getPriceByDuration(meditation.duration || parseInt(meditationLength));
    setPaymentAmount(price);
    setPaymentForAudio(true);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    const paymentSuccessful = await processPayment(paymentAmount);
    
    if (paymentSuccessful) {
      setShowPaymentModal(false);
      
      // Proceed with download based on type
      if (paymentForAudio) {
        downloadAudioFile();
      } else {
        downloadTextFile();
      }
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  const downloadTextFile = async () => {
    if (!meditation?.text) return;
    
    try {
      // Clean up the text before downloading
      const cleanedText = cleanupText(meditation.text);
      
      // Client-side download
      const element = document.createElement('a');
      const file = new Blob([cleanedText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `meditation-${new Date().getTime()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Error downloading meditation: ' + err.message);
    }
  };

  const downloadAudioFile = async () => {
    if (!meditation?.text || !meditation?.audioUrl) return;
    
    try {
      setIsDownloadingAudio(true);
      
      // Get clean filename from the meditation prompt
      const baseFilename = prompt.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 30);
      
      const filename = baseFilename || `meditation-${new Date().getTime()}`;
      
      // Extract the base64 data from the data URL
      const base64Data = meditation.audioUrl.split(',')[1];
      
      // Call the server endpoint to save the audio file
      const response = await fetch('http://localhost:5001/api/meditations/save-audio-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Data,
          filename: filename
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save audio file');
      }
      
      const result = await response.json();
      
      // Create download link for the saved file
      const downloadUrl = `http://localhost:5001/audio/${result.filename}`;
      
      // Create and trigger download link
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = result.filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
    } catch (err: any) {
      console.error('Audio download error:', err);
      alert('Error downloading audio: ' + err.message);
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Sparkles className="text-indigo-300" size={32} />
          </motion.div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Manifestation Meditation</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          Enter what you'd like to manifest in your life, and we'll create a personalized guided meditation to help you attract it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`relative transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="I want to manifest abundance and success in my career..."
            className="w-full h-32 px-5 py-4 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 outline-none text-white resize-none placeholder:text-white/40 transition-colors"
            required
          />
          
          <div className="absolute bottom-4 right-4 text-white/50 text-sm">
            {prompt.length} / 200
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/3">
            <label className="block text-white/70 mb-2 text-sm">Meditation Length</label>
            <select 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none"
              value={meditationLength}
              onChange={(e) => setMeditationLength(e.target.value)}
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
          
          <div className="w-full sm:w-2/3">
            <label className="block text-white/70 mb-2 text-sm">Voice (Eleven Labs)</label>
            <select 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {ELEVEN_LABS_VOICES.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isGenerating || isDownloadingAudio || isProcessingPayment}
            className={`flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-900/30 flex items-center justify-center ${(isGenerating || isDownloadingAudio || isProcessingPayment) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? status || 'Generating...' : 'Generate Meditation & Audio'}
            <ArrowRight className="ml-2" size={18} />
          </motion.button>

          {meditation?.text && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleDownload}
              disabled={isProcessingPayment}
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-green-900/30 flex items-center justify-center"
              title={`Download Text ($${getPriceByDuration(meditation.duration || parseInt(meditationLength)).toFixed(2)})`}
            >
              <Download size={18} />
              <DollarSign size={14} className="ml-1" />
            </motion.button>
          )}
          
          {meditation?.audioUrl && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAudioDownload}
              disabled={isDownloadingAudio || isProcessingPayment}
              className={`py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center ${isDownloadingAudio ? 'opacity-70 cursor-not-allowed' : ''}`}
              title={`Download MP3 ($${getPriceByDuration(meditation.duration || parseInt(meditationLength)).toFixed(2)})`}
            >
              <Music size={18} />
              <DollarSign size={14} className="ml-1" />
              {isDownloadingAudio && <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            </motion.button>
          )}
        </div>
      </form>

      {isGenerating && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-3"></div>
            <p className="text-white/80 text-sm">{status || 'Processing...'}</p>
          </div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: status === 'Generating audio...' ? "60%" : "30%" }}
              transition={{ duration: 1 }}
              className="h-full bg-indigo-400"
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete Your Purchase</h3>
            <p className="text-gray-600 mb-2">
              {paymentForAudio ? 'MP3 Audio Download' : 'Meditation Text Download'}
            </p>
            <p className="text-gray-600 mb-4">
              {meditation?.duration || parseInt(meditationLength)} minute meditation
            </p>
            
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">${paymentAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentComplete}
                disabled={isProcessingPayment}
                className={`flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay ${paymentAmount.toFixed(2)}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PromptForm;