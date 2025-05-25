/**
 * Utility functions for text processing
 */

/**
 * Cleans up meditation text by removing markdown formatting and metadata
 * while preserving pause markers for speech rhythm
 */
export function cleanupText(text: string): string {
  if (!text) return '';
  
  // Remove markdown formatting and metadata
  let cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/#{1,6}\s+/g, '')       // Remove headers
    .replace(/```[^`]*```/g, '')     // Remove code blocks
    .replace(/^Title:.*$/gmi, '')    // Remove title metadata
    .replace(/^Meditation:.*$/gmi, '') // Remove meditation metadata
    .replace(/^Script:.*$/gmi, '')   // Remove script metadata
    .replace(/^#+\\s.*$/gmi, '')     // Remove markdown headers
    .replace(/\\[.*?\\]\\(.*?\\)/g, '') // Remove markdown links
    .replace(/\\!\\[.*?\\]\\(.*?\\)/g, '') // Remove markdown images
    .replace(/\\s{2,}/g, ' ')        // Collapse multiple spaces
    .replace(/\\n{2,}/g, '\\n');     // Collapse multiple newlines
  
  // Remove LLM self-talk and instructions
  cleanText = cleanText
    .replace(/^(Here('s| is) a meditation|I('ve| have) created a meditation|This meditation (will |)focus(es|) on|Here is your personalized meditation)/gmi, '')
    .replace(/^(I hope (this|you) (helps|enjoy|find)|Let me know if you|This should help you)/gmi, '')
    .replace(/^(To begin|Let's begin|To start|First,) (this meditation|with this meditation)/gmi, '')
    .replace(/^(Please|Now) (find|take|get) (a comfortable|your) (position|place|spot)/gmi, '')
    .replace(/^As requested, here('s| is)/gmi, '')
    .replace(/^This is a \\d{1,2}(-| )minute guided meditation/gmi, '');
  
  // Remove lines that are just instructions or empty
  const lines = cleanText.split('\\n');
  const cleanedLines = lines
    .map(line => line.trim())
    .filter(line =>
      line &&
      !line.match(/^(Title|Duration|Tags|Author|Description|Focus|Theme):/i) &&
      !line.match(/^(I'll guide you through|Feel free to|Let me know if|I hope this helps|Enjoy your meditation!|Remember to|You can use this meditation)$/i)
    );
  
  // IMPORTANT: We are now keeping line breaks and pause indicators like "..." and "-"
  // to maintain the speech rhythm intended in the meditation
  return cleanedLines.join('\\n\\n').trim();
} 