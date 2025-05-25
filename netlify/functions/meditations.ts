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
        
        // Add your meditation generation logic here
        // For now, we'll simulate a delay to match the actual processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Meditation generated successfully');
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: Date.now(),
            content: `Generated meditation for: ${prompt}`,
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