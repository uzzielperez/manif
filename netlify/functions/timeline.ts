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
            content: `You are a Temporal Architect. Output ONLY a valid JSON object representing a life path roadmap.
            
            STRUCTURE:
            {
              "nodes": [{ "id": "1", "label": "Text", "type": "milestone" | "crossroad" }],
              "edges": [{ "source": "1", "target": "2" }]
            }
            
            RULES:
            1. No text before or after JSON.
            2. Minimum 5 nodes.
            3. Must be valid JSON.`
          },
          {
            role: 'user',
            content: `Generate a JSON timeline for: ${prompt}`
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

