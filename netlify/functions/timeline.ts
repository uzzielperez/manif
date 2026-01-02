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
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, model } = body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration Error', details: 'GROQ_API_KEY is not set in Netlify environment variables.' })
      };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a Temporal Architect. Output ONLY a valid JSON object representing 3 distinct hybrid manifestation paths for a user's goal.
            
            THE 3 PATHS:
            1. "The Steady Orbit" (Conservative/Low Risk): Focused on gradual, consistent growth.
            2. "The Warp Drive" (Balanced/Medium Risk): Focused on efficiency and moderate expansion.
            3. "The Quantum Leap" (Aggressive/High Risk): Focused on rapid, exponential breakthrough.
            
            STRUCTURE:
            {
              "nodes": [
                { "id": "path1-1", "label": "Text", "type": "milestone", "pathId": "steady" },
                { "id": "path2-1", "label": "Text", "type": "crossroad", "pathId": "warp" },
                { "id": "path3-1", "label": "Text", "type": "achievement", "pathId": "quantum" }
              ],
              "edges": [
                { "source": "path1-1", "target": "path1-2" }
              ]
            }
            
            RULES:
            1. Each path should have 3-5 unique nodes.
            2. The "pathId" field is MANDATORY for each node (values: "steady", "warp", "quantum").
            3. All paths should originate from the concept of the user's "Current Reality".
            4. Use distinct IDs for nodes in different paths.
            5. Return ONLY valid JSON.`
          },
          {
            role: 'user',
            content: `Generate 3 hybrid manifestation paths for: ${prompt}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Groq API Error', details: errorData.error?.message || response.statusText })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: data.choices[0]?.message?.content || '{}'
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

