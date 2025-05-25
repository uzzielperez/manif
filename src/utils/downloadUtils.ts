import { cleanupText } from './textUtils'; // Assuming textUtils.ts is in the same directory

export const downloadTextFileUtility = (text: string, prompt: string = 'meditation'): void => {
  if (!text) return;
  try {
    const cleaned = cleanupText(text);
    const element = document.createElement('a');
    const file = new Blob([cleaned], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const baseFilename = prompt.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    const filename = baseFilename || `meditation-${new Date().getTime()}`;
    element.download = `${filename}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href); // Clean up blob URL
    console.log(`Text file '${filename}.txt' download initiated.`);
  } catch (err: any) {
    console.error('Text download error:', err);
    alert('Error downloading meditation text: ' + err.message);
  }
};

export const downloadAudioFileUtility = (audioUrl: string, prompt: string = 'meditation'): void => {
  if (!audioUrl) return;
  try {
    const element = document.createElement('a');
    element.href = audioUrl; // Expects a blob URL or direct link
    const baseFilename = prompt.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    const filename = baseFilename || `meditation-${new Date().getTime()}`;
    element.download = `${filename}.mp3`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    // If audioUrl is a blob URL created by this session, it might need revoking elsewhere after use
    console.log(`Audio file '${filename}.mp3' download initiated.`);
  } catch (err: any) {
    console.error('Audio download error:', err);
    alert('Error downloading audio: ' + err.message);
  }
}; 