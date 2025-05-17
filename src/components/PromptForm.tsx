import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Download } from 'lucide-react';
import { useMeditationStore } from '../store/meditationStore';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { setMeditation, meditation } = useMeditationStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      try {
        setIsGenerating(true);
        console.log('Sending request to generate meditation...');
        const response = await fetch('http://localhost:5001/api/meditations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: 'qwen-qwq-32b' }) // Using Qwen QWQ 32B model
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error('Failed to generate meditation');
        }
        
        const meditation = await response.json();
        console.log('Received meditation:', meditation);
        
        setMeditation({
          id: meditation.id,
          prompt,
          text: meditation.content,
          audioUrl: '', // You can add audio generation logic later
          date: new Date().toLocaleDateString(),
          duration: meditation.duration
        });
        onSubmit(prompt);
      } catch (err: any) {
        console.error('Error details:', err);
        alert('Error generating meditation: ' + err.message);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!meditation?.text) return;
    
    try {
      // Option 1: Client-side download (more reliable)
      const element = document.createElement('a');
      const file = new Blob([meditation.text], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `meditation-${new Date().getTime()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      // Option 2: Server-side download (if you prefer)
      /*
      const response = await fetch('http://localhost:5001/api/meditations/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: meditation.text,
          title: `meditation-${new Date().getTime()}`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to download meditation');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditation-${new Date().getTime()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      */
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Error downloading meditation: ' + err.message);
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
          <div className="w-full sm:w-1/2">
            <label className="block text-white/70 mb-2 text-sm">Meditation Length</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-white/70 mb-2 text-sm">Voice Type</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none">
              <option value="calming">Calming</option>
              <option value="energetic">Energetic</option>
              <option value="meditative">Meditative</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isGenerating}
            className={`flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-900/30 flex items-center justify-center ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating...' : 'Generate Meditation'}
            <ArrowRight className="ml-2" size={18} />
          </motion.button>

          {meditation?.text && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleDownload}
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-green-900/30 flex items-center justify-center"
            >
              <Download size={18} />
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default PromptForm;