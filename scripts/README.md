# Meditation Generation Scripts

## Generate Free Meditations

This script automatically generates all 7 free meditations with AI-powered scripts and audio synthesis.

### Prerequisites

Make sure you have the following environment variables set:
- `GROQ_API_KEY` - For generating meditation scripts
- `ELEVENLABS_API_KEY` - For synthesizing speech

### Voice Selection

The script is currently set to use **Uzi's voice** (your cloned voice).

To switch voices, edit `scripts/generate-free-meditations.ts` line 68:
```typescript
const VOICE_ID = VOICES.uzi;     // Your voice (default)
// or try:
const VOICE_ID = VOICES.jameson; // Jameson - Guided Meditation
const VOICE_ID = VOICES.sarah;   // Sarah - Soothing
const VOICE_ID = VOICES.alison;  // Alison
```

### Usage

**Generate all meditations:**
```bash
npm run generate-meditations
```

**Generate a specific meditation (recommended for testing):**
```bash
npm run generate-meditations 7    # Loving Kindness Meditation
npm run generate-meditations 1    # Cosmic Grounding
npm run generate-meditations 2    # Nebula Relaxation
```

**See available meditations:**
```bash
npm run generate-meditations --help
```

### What it does

1. **Generates Scripts** - Uses Groq AI to create 5-minute meditation scripts for each meditation
2. **Synthesizes Audio** - Automatically passes scripts to ElevenLabs API (Rachel voice)
3. **Saves Files** - Stores both audio (.mp3) and scripts (.txt) in `/audio/free-meditations/`

### Output

Files will be saved as:
- `1-cosmic-grounding.mp3` + `.txt`
- `2-nebula-relaxation.mp3` + `.txt`
- `3-solar-energy-breath.mp3` + `.txt`
- `4-stellar-abundance.mp3` + `.txt`
- `5-void-silence.mp3` + `.txt`
- `6-galactic-gratitude.mp3` + `.txt`
- `7-loving-kindness-meditation.mp3` + `.txt`

### Quality Check Workflow

After generation:
1. Listen to meditations #1, #4, and #7 (beginning, middle, end)
2. If quality is good, the rest should be consistent
3. Review any flagged errors in the summary

### Time Estimate

- ~2 minutes per meditation
- Total: ~15-20 minutes for all 7

### Regenerating Single Meditations

If you need to regenerate a specific meditation, edit the `FREE_MEDITATIONS` array in the script to include only the ones you want.

### Customization

Edit `scripts/generate-free-meditations.ts` to:
- Change voice ID (line 60)
- Adjust duration
- Modify prompt templates
- Change output directory
