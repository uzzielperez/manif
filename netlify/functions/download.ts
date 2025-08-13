import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// Simple PDF generation function that creates a manifestation guide
function generateManifestationGuideHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Manifestation AI Blueprint - Starter Guide</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 18px;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 15px;
            border-left: 4px solid #6366f1;
            padding-left: 15px;
        }
        .content {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .list {
            margin-left: 20px;
        }
        .list li {
            margin-bottom: 8px;
        }
        .highlight {
            background-color: #f0f9ff;
            padding: 15px;
            border-left: 4px solid #0ea5e9;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .email {
            color: #6366f1;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Manifestation AI Blueprint</div>
        <div class="subtitle">Starter Guide - Your Path to Manifestation</div>
    </div>

    <div class="content">
        <p><strong>Welcome to your manifestation journey!</strong> Thank you for joining our Manifestation AI Blueprint program. This guide contains everything you need to begin manifesting your desires with intention and clarity.</p>
    </div>

    <div class="section">
        <div class="section-title">Step 1: Relaxation and Heart Opening</div>
        <div class="content">
            <p>Every manifestation session should begin with proper preparation:</p>
            <ul class="list">
                <li>Find a quiet, comfortable space where you won't be disturbed</li>
                <li>Take 5-10 deep breaths, allowing your body to completely relax</li>
                <li>Place your hand on your heart and focus on opening your heart center</li>
                <li>Cultivate feelings of love, gratitude, and well-intentioned generosity</li>
                <li>Let go of any tension, stress, or negative emotions</li>
            </ul>
        </div>
        <div class="highlight">
            <strong>Heart-Opening Tip:</strong> Imagine your heart as a beautiful flower slowly blooming, radiating love and positive energy in all directions.
        </div>
    </div>

    <div class="section">
        <div class="section-title">Step 2: Clarifying Your Intent</div>
        <div class="content">
            <p>Clarity is power in manifestation. Take time to deeply understand what you truly desire:</p>
            <ul class="list">
                <li><strong>What do I truly desire?</strong> Be specific and authentic</li>
                <li><strong>How will this benefit others?</strong> Ensure your desires are well-intentioned</li>
                <li><strong>Is this aligned with my highest good?</strong> Check in with your intuition</li>
                <li><strong>Why do I want this?</strong> Understand your deeper motivations</li>
            </ul>
            <p>Write down your intentions using positive, present-tense language as if they've already manifested.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Step 3: Creating Your Manifestation List</div>
        <div class="content">
            <p>Create a comprehensive list of what you want to be, have, and experience:</p>
            <ul class="list">
                <li><strong>Personal Qualities:</strong> Character traits, skills, and ways of being you want to embody</li>
                <li><strong>Material Manifestations:</strong> Objects, resources, or financial goals that would enhance your life</li>
                <li><strong>Experiences:</strong> Adventures, achievements, and moments you want to create</li>
                <li><strong>Relationships:</strong> The types of connections and love you want to attract</li>
                <li><strong>Contributions:</strong> Ways you want to make a positive impact in the world</li>
            </ul>
        </div>
        <div class="highlight">
            <strong>Pro Tip:</strong> Review and update your list regularly. As you grow, your desires may evolve and become more refined.
        </div>
    </div>

    <div class="section">
        <div class="section-title">Step 4: Detailed Visualization Practice</div>
        <div class="content">
            <p>Visualization is where the magic happens. Create vivid, multi-sensory experiences:</p>
            <ul class="list">
                <li><strong>Visual:</strong> What do you see in your manifested reality? Colors, places, people?</li>
                <li><strong>Auditory:</strong> What sounds surround you? Conversations, music, nature sounds?</li>
                <li><strong>Kinesthetic:</strong> What do you feel physically and emotionally?</li>
                <li><strong>Olfactory & Gustatory:</strong> Any scents or tastes associated with your vision?</li>
            </ul>
            <p><strong>Practice Schedule:</strong> Spend at least 10-15 minutes daily in focused visualization. The more detailed and emotionally charged, the more powerful.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Step 5: Using Our AI Meditation Generator</div>
        <div class="content">
            <p>Leverage our advanced AI tools to enhance your practice:</p>
            <ul class="list">
                <li>Visit our home page to access the meditation generation tool</li>
                <li>Create personalized guided meditations that support your specific manifestation goals</li>
                <li>Use detailed prompts describing exactly what you want to manifest</li>
                <li>Regenerate and refine your meditations as your vision becomes clearer</li>
                <li>Add more sensory details and emotional depth with each iteration</li>
            </ul>
        </div>
        <div class="highlight">
            <strong>AI Tip:</strong> The more specific your prompt, the more targeted and effective your meditation will be. Include emotions, sensations, and specific outcomes.
        </div>
    </div>

    <div class="section">
        <div class="section-title">Step 6: Consistent Practice and Refinement</div>
        <div class="content">
            <p>Manifestation is a practice that grows stronger with consistency:</p>
            <ul class="list">
                <li><strong>Daily Practice:</strong> Maintain a regular manifestation routine, even if just for 5-10 minutes</li>
                <li><strong>Progressive Refinement:</strong> As your vision becomes clearer, update and enhance your meditations</li>
                <li><strong>Track Progress:</strong> Keep a manifestation journal to record insights and synchronicities</li>
                <li><strong>Stay Open:</strong> Allow the universe to deliver your desires in unexpected ways</li>
                <li><strong>Practice Gratitude:</strong> Appreciate what you have while working toward what you want</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Share Your Success Story</div>
        <div class="content">
            <p>Your manifestation journey can inspire others! When you achieve your goals, we'd love to celebrate with you.</p>
            <p><strong>Email us your success story at:</strong> <span class="email">uzzielperez25@gmail.com</span></p>
            <p>Share details about:</p>
            <ul class="list">
                <li>What you manifested and how long it took</li>
                <li>Which techniques worked best for you</li>
                <li>Any unexpected ways your manifestation appeared</li>
                <li>How the AI meditations helped your practice</li>
            </ul>
            <p>Your story could be featured to help inspire others on their manifestation journey!</p>
        </div>
    </div>

    <div class="highlight">
        <p><strong>Remember:</strong> Manifestation works best when you combine clear intention, positive emotion, consistent practice, and inspired action. Trust the process and stay open to receiving your desires in perfect timing.</p>
    </div>

    <div class="footer">
        <p>© 2024 Manifestation AI Blueprint. All rights reserved.</p>
        <p>For support and questions: <span class="email">uzzielperez25@gmail.com</span></p>
    </div>
</body>
</html>
  `;
}

export const handler: Handler = async (event, context) => {
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
    const pathSegments = event.path.split('/');
    const action = pathSegments[pathSegments.length - 1];
    const sessionId = pathSegments[pathSegments.length - 1];

    if (event.httpMethod === 'GET' && event.path.includes('manifestation-guide')) {
      // Verify payment before allowing download
      if (!sessionId || sessionId === 'manifestation-guide') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Session ID is required" })
        };
      }

      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
              error: "Payment verification failed", 
              paymentStatus: session.payment_status 
            })
          };
        }

        // Generate the HTML guide
        const htmlContent = generateManifestationGuideHTML();
        
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'text/html',
            'Content-Disposition': 'attachment; filename="Manifestation-AI-Blueprint-Starter-Guide.html"'
          },
          body: htmlContent
        };
      } catch (stripeError) {
        console.error('Stripe verification error:', stripeError);
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: "Payment verification failed" })
        };
      }
    }

    if (event.httpMethod === 'POST' && event.path.includes('generate-guide')) {
      const { sessionId: bodySessionId } = JSON.parse(event.body || '{}');
      
      if (!bodySessionId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Payment session ID is required" })
        };
      }

      try {
        const session = await stripe.checkout.sessions.retrieve(bodySessionId);
        
        if (session.payment_status !== 'paid') {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
              error: "Payment verification failed", 
              paymentStatus: session.payment_status 
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Manifestation guide generated successfully",
            downloadUrl: `/.netlify/functions/download/manifestation-guide/${bodySessionId}`,
            fileName: 'Manifestation-AI-Blueprint-Starter-Guide.html'
          })
        };
      } catch (stripeError) {
        console.error('Stripe verification error:', stripeError);
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: "Payment verification failed" })
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Download function error:', error);
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
