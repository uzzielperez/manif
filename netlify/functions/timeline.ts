import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { prompt, model } = JSON.parse(event.body || '{}');
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
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
            
            IMPORTANT: Ensure the JSON is flat and correctly formatted. Do not include any text outside the JSON object.`
          },
          {
            role: 'user',
            content: `Generate a timeline for this goal/situation: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || '{}';

    // Robust JSON cleaning in case the model returns markdown code blocks
    if (content.includes('```json')) {
      content = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      content = content.split('```')[1].split('```')[0].trim();
    }

    return {
      statusCode: 200,
      headers,
      body: content
    };
  } catch (error) {
    console.error('Timeline function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) })
    };
  }
};

