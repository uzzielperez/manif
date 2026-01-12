import 'dotenv/config';

/**
 * Content Generator using Groq API
 * Generates marketing content for various channels with brand voice consistency
 */

export interface ContentPrompt {
  channel: 'twitter' | 'reddit' | 'tiktok' | 'instagram' | 'email' | 'blog';
  topic: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'inspiring';
  style?: string;
  targetAudience?: string[];
  maxLength?: number;
  includeHashtags?: boolean;
  includeCTA?: boolean;
  context?: Record<string, any>;
}

export interface GeneratedContent {
  content: string;
  metadata: {
    estimatedEngagement?: number;
    keywords?: string[];
    hashtags?: string[];
    suggestedPostingTime?: string;
  };
}

const BRAND_VOICE = `
You are a marketing content creator for Manifest.ink, a cosmic manifestation and meditation platform.

Brand Voice Guidelines:
- Cosmic, mystical, yet accessible and modern
- Empowering and inspiring without being preachy
- Focus on transformation, growth, and alignment
- Use metaphors from space, stars, and cosmic journeys
- Balance spiritual depth with practical action
- Avoid overly commercial or salesy language
- Be authentic and genuine

Key Messaging:
- Manifestation through intentional action
- Meditation as a tool for clarity and alignment
- AI-powered personalization for unique journeys
- Community of like-minded manifestors
- Scientific approach to spiritual practices
`;

export async function generateContent(prompt: ContentPrompt): Promise<GeneratedContent> {
  const systemPrompt = buildSystemPrompt(prompt);
  const userPrompt = buildUserPrompt(prompt);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: prompt.maxLength ? Math.min(prompt.maxLength * 2, 2048) : 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content generated from Groq API');
    }

    // Extract metadata
    const metadata = extractMetadata(content, prompt);

    return {
      content: cleanContent(content),
      metadata,
    };
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
}

function buildSystemPrompt(prompt: ContentPrompt): string {
  let systemPrompt = BRAND_VOICE;

  // Channel-specific guidelines
  switch (prompt.channel) {
    case 'twitter':
      systemPrompt += `
      
Twitter Guidelines:
- Keep it concise (under 280 characters)
- Use engaging hooks and questions
- Include relevant hashtags (2-3 max)
- Make it shareable and retweetable
- Use line breaks for readability
- Can create threads for longer content
`;
      break;

    case 'reddit':
      systemPrompt += `
      
Reddit Guidelines:
- Provide genuine value, not just promotion
- Follow subreddit rules and culture
- Be helpful and authentic
- Avoid self-promotion unless explicitly allowed
- Engage in discussions naturally
- Use proper formatting (markdown)
`;
      break;

    case 'tiktok':
      systemPrompt += `
      
TikTok Guidelines:
- Create engaging, hook-driven captions
- Use trending sounds and hashtags when relevant
- Keep it short and punchy
- Include call-to-action
- Make it visually descriptive (for video planning)
`;
      break;

    case 'instagram':
      systemPrompt += `
      
Instagram Guidelines:
- Create visually appealing captions
- Use line breaks and emojis strategically
- Include relevant hashtags (5-10)
- Tell a story or share insights
- Include call-to-action
`;
      break;

    case 'email':
      systemPrompt += `
      
Email Guidelines:
- Clear, compelling subject line
- Personal and conversational tone
- Value-first approach
- Clear call-to-action
- Mobile-friendly formatting
`;
      break;

    case 'blog':
      systemPrompt += `
      
Blog Guidelines:
- Long-form, comprehensive content
- SEO-optimized with natural keyword usage
- Clear structure with headings
- Engaging introduction and conclusion
- Internal linking opportunities
- Actionable insights
`;
      break;
  }

  // Tone-specific adjustments
  if (prompt.tone) {
    systemPrompt += `\n\nTone: ${prompt.tone}`;
  }

  return systemPrompt;
}

function buildUserPrompt(prompt: ContentPrompt): string {
  let userPrompt = `Create ${prompt.channel} content about: ${prompt.topic}`;

  if (prompt.targetAudience && prompt.targetAudience.length > 0) {
    userPrompt += `\nTarget audience: ${prompt.targetAudience.join(', ')}`;
  }

  if (prompt.maxLength) {
    userPrompt += `\nMaximum length: ${prompt.maxLength} characters`;
  }

  if (prompt.includeHashtags) {
    userPrompt += `\nInclude relevant hashtags`;
  }

  if (prompt.includeCTA) {
    userPrompt += `\nInclude a call-to-action`;
  }

  if (prompt.context) {
    userPrompt += `\nContext: ${JSON.stringify(prompt.context)}`;
  }

  if (prompt.style) {
    userPrompt += `\nStyle: ${prompt.style}`;
  }

  return userPrompt;
}

function cleanContent(content: string): string {
  // Remove markdown code blocks if present
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove leading/trailing quotes if AI wrapped it
  content = content.trim().replace(/^["']|["']$/g, '');

  return content.trim();
}

function extractMetadata(content: string, prompt: ContentPrompt): GeneratedContent['metadata'] {
  const metadata: GeneratedContent['metadata'] = {};

  // Extract hashtags
  const hashtagRegex = /#[\w]+/g;
  const hashtags = content.match(hashtagRegex) || [];
  if (hashtags.length > 0) {
    metadata.hashtags = hashtags;
  }

  // Extract keywords (simple approach - in production, use NLP)
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4);
  
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  metadata.keywords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  // Simple engagement estimation (in production, use ML model)
  const hasQuestion = content.includes('?');
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(content);
  const hasCTA = /(visit|try|learn|discover|start|join|get)/i.test(content);
  
  let engagementScore = 50; // Base score
  if (hasQuestion) engagementScore += 10;
  if (hasEmoji) engagementScore += 5;
  if (hasCTA) engagementScore += 10;
  if (hashtags.length > 0) engagementScore += 5;

  metadata.estimatedEngagement = Math.min(engagementScore, 100);

  return metadata;
}

/**
 * Generate multiple content variations for A/B testing
 */
export async function generateContentVariations(
  prompt: ContentPrompt,
  count: number = 3
): Promise<GeneratedContent[]> {
  const variations: GeneratedContent[] = [];

  for (let i = 0; i < count; i++) {
    // Slightly vary the prompt for diversity
    const variedPrompt: ContentPrompt = {
      ...prompt,
      context: {
        ...prompt.context,
        variation: i + 1,
        temperature: 0.7 + (i * 0.1), // Vary creativity
      },
    };

    const content = await generateContent(variedPrompt);
    variations.push(content);
  }

  return variations;
}
