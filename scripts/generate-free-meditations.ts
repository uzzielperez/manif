import 'dotenv/config';
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

// Voice ID for ElevenLabs
// Available voices (from PromptForm.tsx):
const VOICES = {
  uzi: 'B69tnztZ1gRYSVTCL8Cv',        // Uzi - Your voice!
  lauren: 'mgu2yPwXYhibgnytBnpW',     // Lauren
  jameson: 'ZQe5CZNOzWyzPSCn5a3c',    // Jameson - Guided Meditation
  sarah: 'EXAVITQu4vr4xnSDxMaL',      // Sarah - Soothing
  alison: 'uagKcbxPLaJH7iYADCbR',     // Alison
  lily: 'pFZP5JQG7iQjIQuC4Bku',       // Lily - Soft, nurturing
  charlotte: 'XB0fDUnXU5powFXDhCwa',  // Charlotte - Warm
};

// Select voice here:
const VOICE_ID = VOICES.jameson; // Jameson - Guided Meditation (default)

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

async function generateSingleMeditation(meditation: typeof FREE_MEDITATIONS[0], voiceId: string): Promise<GenerationResult> {
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
- Has a SLOW, GENTLE pace - this is NOT a conversation, it's a meditation
- Uses MANY pauses indicated by ellipses (...) - at least 2-3 per paragraph
- Allows time for listeners to breathe and experience each moment
- Speaks in a calm, unhurried manner
- Has a gentle introduction and closing
- Each instruction should be followed by a pause for the listener to comply

Return ONLY the meditation script text, no titles or metadata.`;

    const scriptResult = await generateMeditation(prompt);
    const script = scriptResult.text;
    
    console.log(`✅ Script generated (${script.length} characters)`);
    
    // Step 2: Synthesize speech using ElevenLabs
    console.log(`🎙️  Step 2/3: Synthesizing audio with ElevenLabs...`);
    const audioBuffer = await synthesizeSpeech(script, voiceId);
    
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

async function generateAllMeditations(specificId?: string, voiceId: string = VOICE_ID) {
  console.log('\n🌌 COSMIC MEDITATION GENERATOR 🌌');
  
  // Filter meditations if a specific ID is requested
  const meditationsToGenerate = specificId 
    ? FREE_MEDITATIONS.filter(m => m.id === specificId)
    : FREE_MEDITATIONS;
  
  if (meditationsToGenerate.length === 0) {
    console.error(`❌ No meditation found with ID: ${specificId}`);
    console.log('\nAvailable meditation IDs:');
    FREE_MEDITATIONS.forEach(m => console.log(`  ${m.id} - ${m.title}`));
    return;
  }
  
  if (specificId) {
    console.log(`Generating meditation #${specificId}: ${meditationsToGenerate[0].title}...\n`);
  } else {
    console.log('Generating all free meditations...\n');
  }
  
  const startTime = Date.now();
  const results: GenerationResult[] = [];
  
  // Generate meditations sequentially to avoid rate limits
  for (const meditation of meditationsToGenerate) {
    const result = await generateSingleMeditation(meditation, voiceId);
    results.push(result);
    
    // Add a small delay between generations to be respectful to API rate limits
    if (meditation.id !== meditationsToGenerate[meditationsToGenerate.length - 1].id) {
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
  console.log(`✅ Successful: ${successful}/${meditationsToGenerate.length}`);
  console.log(`❌ Failed: ${failed}/${meditationsToGenerate.length}`);
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

// Parse command line arguments
const args = process.argv.slice(2);
const meditationId = args[0];
const voiceName = args[1]; // Optional voice parameter

// Override voice if specified
let selectedVoice = VOICE_ID;
if (voiceName && VOICES[voiceName.toLowerCase() as keyof typeof VOICES]) {
  selectedVoice = VOICES[voiceName.toLowerCase() as keyof typeof VOICES];
  console.log(`\n🎙️  Using voice: ${voiceName}`);
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log('\n🌌 COSMIC MEDITATION GENERATOR 🌌\n');
  console.log('Usage:');
  console.log('  npm run generate-meditations                    # Generate all 7 meditations');
  console.log('  npm run generate-meditations [ID]               # Generate a specific meditation');
  console.log('  npm run generate-meditations [ID] [voice]       # Use a specific voice\n');
  console.log('Available Meditations:');
  FREE_MEDITATIONS.forEach(m => {
    console.log(`  ${m.id} - ${m.title} (${m.category})`);
  });
  console.log('\nAvailable Voices:');
  Object.keys(VOICES).forEach(voice => {
    console.log(`  ${voice}`);
  });
  console.log('\nExamples:');
  console.log('  npm run generate-meditations 7 jameson');
  console.log('  npm run generate-meditations 7 sarah');
  console.log('  npm run generate-meditations 1 uzi');
  console.log('');
  process.exit(0);
}

// Run the generator
generateAllMeditations(meditationId, selectedVoice).catch(console.error);
