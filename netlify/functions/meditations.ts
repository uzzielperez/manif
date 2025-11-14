import { Handler } from '@netlify/functions';
import { setupDatabase } from '../../db-setup.js';
import { synthesizeSpeech } from '../../server/elevenlabs';

export const handler: Handler = async (event, context) => {
  console.log('Meditation function called:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? JSON.parse(event.body) : null
  });

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Initializing database...');
    // Initialize database
    await setupDatabase();
    console.log('Database initialized successfully');

    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'POST':
        if (event.path === '/.netlify/functions/meditations/audio') {
          console.log('Processing audio generation request...');
          const { text, voiceId, duration } = JSON.parse(event.body || '{}');
          console.log('Audio generation params:', { textLength: text.length, voiceId, duration });
          
          const audioBuffer = await synthesizeSpeech(text, voiceId);
          console.log('Audio generated successfully, size:', audioBuffer.length);
          
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.length.toString()
            },
            body: audioBuffer.toString('base64'),
            isBase64Encoded: true
          };
        }

        // Handle meditation generation
        console.log('Processing meditation generation request...');
        const { prompt, model } = JSON.parse(event.body || '{}');
        console.log('Meditation generation params:', { prompt, model });
        
        // Call Groq API for real meditation generation
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
          throw new Error('GROQ_API_KEY is not set in environment variables');
        }

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: 'You are a meditation coach. Generate a personalized manifestation meditation script based on the user\'s intention.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500
          })
        });

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text();
          throw new Error(`Groq API error: ${groqResponse.status} ${errorText}`);
        }

        const groqData = await groqResponse.json();
        const meditationText = groqData.choices?.[0]?.message?.content || 'Sorry, could not generate meditation.';

        console.log('Meditation generated successfully');
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: Date.now(),
            content: meditationText,
            duration: 5
          })
        };

      case 'GET':
        console.log('Processing GET request...');
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'GET endpoint for meditations'
          })
        };

      default:
        console.log('Method not allowed:', event.httpMethod);
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      })
    };
  }
}; 