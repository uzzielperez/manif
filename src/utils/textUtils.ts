/**
 * Utility functions for text processing
 */

/**
 * Cleans up meditation text by removing markdown formatting and metadata
 * while preserving pause markers for speech rhythm
 */
export function cleanupText(text: string): string {
  if (!text) return '';
  
  // Remove markdown formatting
  let cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/#{1,6}\s+/g, '')       // Remove headers
    .replace(/```[^`]*```/g, '')     // Remove code blocks
    .replace(/^Title:.*$/gm, '')     // Remove title metadata
    .replace(/^Meditation:.*$/gm, '') // Remove meditation metadata
    .replace(/^Script:.*$/gm, '');   // Remove script metadata
  
  // Remove LLM self-talk patterns
  cleanText = cleanText
    .replace(/^(Here('s| is) a meditation|I('ve| have) created a meditation|This meditation (will |)focus(es|) on|Here is your personalized meditation)/gmi, '')
    .replace(/^(I hope (this|you) (helps|enjoy|find)|Let me know if you|This should help you)/gmi, '')
    .replace(/^(To begin|Let's begin|To start|First,) (this meditation|with this meditation)/gmi, '')
    .replace(/^(Please|Now) (find|take|get) (a comfortable|your) (position|place|spot)/gmi, '')
    .replace(/^As requested, here('s| is)/gmi, '')
    .replace(/^This is a \d{1,2}(-| )minute guided meditation/gmi, '');
  
  // Clean up lines
  const lines = cleanText.split('\n');
  const cleanedLines = lines
    .filter(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return false;
      
      // Skip metadata-like lines
      if (trimmedLine.match(/^(Title|Duration|Tags|Author|Description|Focus|Theme):/i)) {
        return false;
      }
      
      // Skip lines that are likely LLM self-talk
      if (trimmedLine.match(/^(I'll guide you through|Feel free to|Let me know if|I hope this helps|Enjoy your meditation!|Remember to|You can use this meditation)$/i)) {
        return false;
      }
      
      return true;
    })
    .map(line => line.trim())
    .filter((line, index, array) => 
      // Remove duplicate consecutive lines
      index === 0 || line !== array[index - 1]
    );
  
  // IMPORTANT: We are now keeping line breaks and pause indicators like "..." and "-"
  // to maintain the speech rhythm intended in the meditation
  return cleanedLines.join('\n\n');
} 