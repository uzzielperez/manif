import 'dotenv/config';
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com" // Removed /openai/v1 from baseURL
});

// Add connection test function
export async function testConnection() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
}

export async function listModels() {
  if (!groq) {
    console.error("Groq client not initialized due to missing API key.");
    return [];
  }
  
  try {
    const models = await groq.models.list();
    return models.data || [];
  } catch (error) {
    console.error("Error listing Groq models:", error);
    return [];
  }
}

export async function generateMeditation(prompt: string, model: string = "llama3-70b-8192") {
  try {
    console.log(`Starting meditation generation for prompt: "${prompt}" using model: ${model}`);
    
    // Use fetch directly instead of the Groq client
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a meditation guide creating scripts to be read aloud. 
            Follow these guidelines:
            1. Provide ONLY the verbatim script that would be read aloud during the meditation
            2. DO NOT include introductions, titles, notes, metadata, or durations
            3. DO NOT use markdown formatting, asterisks, or other special characters
            4. DO NOT number steps or sections
            5. Use natural pauses in the text with line breaks where appropriate
            6. Begin directly with the meditation guidance (e.g., "Close your eyes...", "Take a deep breath...")
            7. Use plain, clear language designed for speaking
            8. Avoid any text that isn't meant to be read aloud
            9. IMPORTANT: Include frequent natural speech pauses using "..." and "-" to create rhythm
            10. Insert longer pauses between meditation sections using "..." to give listeners time to experience the meditation
            11. Use "..." to indicate where the listener should take a breath or pause in their practice
            
            Your response should be the exact text a narrator would read, with natural pauses included.`
          },
          {
            role: "user",
            content: `Create a meditation script based on this prompt: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    console.log(`Generated meditation with ${content.length} characters`);
    
    const duration = Math.round(content.length / 15);
    return { content, duration };
  } catch (error: any) {
    console.error('Meditation generation error:', error);
    throw new Error(`Failed to generate meditation: ${error.message || 'Unknown error'}`);
  }
}

export async function generateTimeline(prompt: string, model: string = "llama3-70b-8192") {
  try {
    console.log(`Starting timeline generation for prompt: "${prompt}" using model: ${model}`);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a Temporal Architect, an AI designed to map out life paths and manifestation roadmaps.
            Your goal is to take a user's goal or situation and output a structured timeline of events and milestones.
            
            FORMATTING RULES:
            1. Output ONLY a valid JSON object.
            2. The JSON MUST have two keys: "nodes" and "edges".
            3. "nodes" is an array of objects: { id: string, label: string, description: string, type: 'milestone' | 'crossroad' | 'achievement' }
            4. "edges" is an array of objects: { source: string, target: string, label?: string }
            5. Keep labels short (1-4 words).
            6. Provide at least 5-8 nodes representing a logical progression.
            7. The first node should logically follow from the "Current Reality".
            
            IMPORTANT: Ensure the JSON is flat and correctly formatted. Do not include any text outside the JSON object.
`
          },
          {
            role: "user",
            content: `Generate a timeline for this goal/situation: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error('Timeline generation error:', error);
    throw new Error(`Failed to generate timeline: ${error.message || 'Unknown error'}`);
  }
}

console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set");