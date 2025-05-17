// This is a mock service for demonstration purposes
// In a real implementation, you would connect to the Eleven Labs API

export const generateSpeech = async (text: string, voiceType: string): Promise<string> => {
  try {
    // In a real implementation, you would make an API call to Eleven Labs
    // For demo purposes, we're returning a mock response
    console.log(`Generating speech for text length: ${text.length}, voice type: ${voiceType}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a placeholder URL - in a real app this would be the URL to the generated audio
    return 'https://audio.jukehost.co.uk/5PybQbnTEhY3mZpLLWQxcUL0lIh3GqVK';
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
};

export const getAvailableVoices = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock voice options
  return ['calm', 'soothing', 'energetic', 'meditative', 'peaceful'];
};