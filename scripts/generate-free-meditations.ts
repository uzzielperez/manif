import fs from 'fs';
import path from 'path';
import { generateMeditation } from '../server/groq';
import { synthesizeSpeech } from '../server/elevenlabs';

// Meditation definitions from FreeMeditations.tsx
const FREE_MEDITATIONS = [
  {
    id: '1',
    title: 'Cosmic Grounding',
    duration: 5,
    category: 'Foundational',
    description: 'Connect with the earth while channeling cosmic energy for stability and presence.',
  },
  {
    id: '2',
    title: 'Nebula Relaxation',
    duration: 5,
    category: 'Sleep',
    description: 'Float through colorful nebulas as you release tension and prepare for deep rest.',
  },
  {
    id: '3',
    title: 'Solar Energy Breath',
    duration: 5,
    category: 'Energy',
    description: 'Harness the power of solar energy through breathwork to invigorate body and mind.',
  },
  {
    id: '4',
    title: 'Stellar Abundance',
    duration: 5,
    category: 'Manifestation',
    description: 'Align with the infinite abundance of the universe to manifest your desires.',
  },
  {
    id: '5',
    title: 'Void Silence',
    duration: 5,
    category: 'Deep Zen',
    description: 'Experience the profound peace of the cosmic void in deep meditation.',
  },
  {
    id: '6',
    title: 'Galactic Gratitude',
    duration: 5,
    category: 'Gratitude',
    description: 'Expand your heart with cosmic gratitude for all that exists.',
  },
  {
    id: '7',
    title: 'Loving Kindness Meditation',
    duration: 5,
    category: 'Compassion',
    description: 'Send waves of loving kindness to yourself, others, and the entire cosmos.',
  },
];

// Voice ID for ElevenLabs (Rachel - calm, soothing voice)
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// Audio output directory
const AUDIO_DIR = path.join(process.cwd(), 'audio', 'free-meditations');

interface GenerationResult {
  id: string;
  title: string;
  success: boolean;
  audioPath?: string;
  scriptPath?: string;
  error?: string;
}

async function generateSingleMeditation(meditation: typeof FREE_MEDITATIONS[0]): Promise<GenerationResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌟 Generating: ${meditation.title}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    // Step 1: Generate meditation script using Groq
    console.log(`📝 Step 1/3: Generating script with AI...`);
    const prompt = `Create a ${meditation.duration}-minute guided meditation called "${meditation.title}". 
Category: ${meditation.category}
Description: ${meditation.description}

Please create a calming, cosmic-themed meditation script that:
- Is approximately ${meditation.duration * 150} words (for ~${meditation.duration} minutes of speech)
- Uses cosmic imagery and metaphors
- Guides the listener through relaxation and the specific focus of this meditation
- Has a gentle introduction and closing
- Uses natural pauses indicated by ellipses (...)

Return ONLY the meditation script text, no titles or metadata.`;

    const scriptResult = await generateMeditation(prompt);
    const script = scriptResult.text;
    
    console.log(`✅ Script generated (${script.length} characters)`);
    
    // Step 2: Synthesize speech using ElevenLabs
    console.log(`🎙️  Step 2/3: Synthesizing audio with ElevenLabs...`);
    const audioBuffer = await synthesizeSpeech(script, VOICE_ID);
    
    console.log(`✅ Audio synthesized (${(audioBuffer.length / 1024).toFixed(2)} KB)`);
    
    // Step 3: Save files
    console.log(`💾 Step 3/3: Saving files...`);
    
    // Ensure directory exists
    if (!fs.existsSync(AUDIO_DIR)) {
      fs.mkdirSync(AUDIO_DIR, { recursive: true });
    }
    
    // Save audio file
    const audioFilename = `${meditation.id}-${meditation.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    const audioPath = path.join(AUDIO_DIR, audioFilename);
    fs.writeFileSync(audioPath, audioBuffer);
    
    // Save script file for reference
    const scriptFilename = `${meditation.id}-${meditation.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    const scriptPath = path.join(AUDIO_DIR, scriptFilename);
    fs.writeFileSync(scriptPath, script);
    
    console.log(`✅ Saved to: ${audioFilename}`);
    console.log(`✅ Script saved to: ${scriptFilename}`);
    
    return {
      id: meditation.id,
      title: meditation.title,
      success: true,
      audioPath,
      scriptPath,
    };
    
  } catch (error: any) {
    console.error(`❌ Error generating ${meditation.title}:`, error.message);
    return {
      id: meditation.id,
      title: meditation.title,
      success: false,
      error: error.message,
    };
  }
}

async function generateAllMeditations() {
  console.log('\n🌌 COSMIC MEDITATION GENERATOR 🌌');
  console.log('Generating all free meditations...\n');
  
  const startTime = Date.now();
  const results: GenerationResult[] = [];
  
  // Generate meditations sequentially to avoid rate limits
  for (const meditation of FREE_MEDITATIONS) {
    const result = await generateSingleMeditation(meditation);
    results.push(result);
    
    // Add a small delay between generations to be respectful to API rate limits
    if (meditation.id !== FREE_MEDITATIONS[FREE_MEDITATIONS.length - 1].id) {
      console.log('\n⏳ Waiting 2 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successful}/${FREE_MEDITATIONS.length}`);
  console.log(`❌ Failed: ${failed}/${FREE_MEDITATIONS.length}`);
  console.log(`⏱️  Total time: ${duration}s`);
  console.log(`📁 Audio files saved to: ${AUDIO_DIR}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed meditations:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.title}: ${r.error}`);
    });
  }
  
  console.log('\n🎧 Next steps:');
  console.log('   1. Listen to meditations 1, 4, and 7 for quality check');
  console.log('   2. If satisfied, update FreeMeditations.tsx with audio URLs');
  console.log('   3. Upload audio files to your hosting (or keep in /audio folder)');
  console.log('\n✨ Done!\n');
}

// Run the generator
generateAllMeditations().catch(console.error);
