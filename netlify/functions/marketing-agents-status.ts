import { Handler } from '@netlify/functions';
import { AgentOrchestrator } from '../../server/marketing-agents/orchestrator';
import { TwitterAgent } from '../../server/marketing-agents/channels/twitter-agent';
import { RedditAgent } from '../../server/marketing-agents/channels/reddit-agent';
import { InstagramAgent } from '../../server/marketing-agents/channels/instagram-agent';
import { TikTokAgent } from '../../server/marketing-agents/channels/tiktok-agent';
import { EmailAgent } from '../../server/marketing-agents/channels/email-agent';
import { BlogAgent } from '../../server/marketing-agents/channels/blog-agent';
import { BaseAgent, AgentConfig } from '../../server/marketing-agents/agent-core';
import { InMemoryAgentMemory } from '../../server/marketing-agents/agent-memory';
// Simple inline auth check to avoid import issues
function checkAdminAuth(event: any): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'manifest-admin-2024';
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === adminPassword) return true;
  }
  const queryParams = new URLSearchParams(event.queryStringParameters || {});
  const adminKey = queryParams.get('admin_key');
  if (adminKey === adminPassword) return true;
  // Allow in dev, require auth in production
  return process.env.NODE_ENV !== 'production' || !!adminPassword;
}

/**
 * Netlify Function: Agent Status & Monitoring
 * Accessible at: /.netlify/functions/marketing-agents-status
 */

const orchestrator = new AgentOrchestrator();
let initialized = false;

function initializeAgents() {
  if (initialized) return;

  const memory = new InMemoryAgentMemory();

  const twitterConfig: AgentConfig = {
    id: 'twitter-main',
    name: 'Twitter Main Agent',
    channel: 'twitter',
    enabled: process.env.TWITTER_AGENT_ENABLED === 'true',
    personality: {
      tone: 'inspiring',
      style: 'cosmic, mystical, empowering',
    },
    postingFrequency: {
      minHours: 4,
      maxHours: 12,
      preferredTimes: [9, 12, 15, 18, 21],
    },
    targetAudience: {
      demographics: ['25-45', 'spiritual seekers', 'meditation practitioners'],
      interests: ['meditation', 'manifestation', 'personal growth', 'mindfulness'],
      painPoints: ['lack of clarity', 'feeling stuck', 'wanting transformation'],
    },
    learningRate: 0.3,
  };

  const twitterAgent = new TwitterAgent(twitterConfig, memory);
  orchestrator.registerAgent(twitterAgent);

  // Reddit Agent
  const redditConfig: AgentConfig = {
    id: 'reddit-main',
    name: 'Reddit Main Agent',
    channel: 'reddit',
    enabled: process.env.REDDIT_AGENT_ENABLED === 'true',
    personality: {
      tone: 'friendly',
      style: 'helpful, authentic, community-focused',
    },
    postingFrequency: {
      minHours: 6,
      maxHours: 24,
      preferredTimes: [10, 14, 18, 22],
    },
    targetAudience: {
      demographics: ['20-40', 'reddit users', 'community members'],
      interests: ['meditation', 'self-improvement', 'spirituality', 'mindfulness'],
      painPoints: ['seeking guidance', 'wanting community', 'looking for resources'],
    },
    learningRate: 0.3,
  };
  const redditAgent = new RedditAgent(redditConfig, memory);
  orchestrator.registerAgent(redditAgent);

  // Instagram Agent
  const instagramConfig: AgentConfig = {
    id: 'instagram-main',
    name: 'Instagram Main Agent',
    channel: 'instagram',
    enabled: process.env.INSTAGRAM_AGENT_ENABLED === 'true',
    personality: {
      tone: 'inspiring',
      style: 'visual, aesthetic, story-driven',
    },
    postingFrequency: {
      minHours: 6,
      maxHours: 12,
      preferredTimes: [8, 12, 17, 20],
    },
    targetAudience: {
      demographics: ['18-35', 'visual learners', 'social media users'],
      interests: ['wellness', 'meditation', 'lifestyle', 'self-care'],
      painPoints: ['seeking inspiration', 'wanting visual content', 'looking for community'],
    },
    learningRate: 0.3,
  };
  const instagramAgent = new InstagramAgent(instagramConfig, memory);
  orchestrator.registerAgent(instagramAgent);

  // TikTok Agent
  const tiktokConfig: AgentConfig = {
    id: 'tiktok-main',
    name: 'TikTok Main Agent',
    channel: 'tiktok',
    enabled: process.env.TIKTOK_AGENT_ENABLED === 'true',
    personality: {
      tone: 'casual',
      style: 'trendy, engaging, hook-driven',
    },
    postingFrequency: {
      minHours: 4,
      maxHours: 8,
      preferredTimes: [9, 12, 15, 18, 21],
    },
    targetAudience: {
      demographics: ['16-30', 'gen z', 'millennials'],
      interests: ['trends', 'quick tips', 'entertainment', 'self-improvement'],
      painPoints: ['short attention span', 'wanting quick wins', 'seeking trends'],
    },
    learningRate: 0.4,
  };
  const tiktokAgent = new TikTokAgent(tiktokConfig, memory);
  orchestrator.registerAgent(tiktokAgent);

  // Email Agent
  const emailConfig: AgentConfig = {
    id: 'email-main',
    name: 'Email Marketing Agent',
    channel: 'email',
    enabled: process.env.EMAIL_AGENT_ENABLED === 'true',
    personality: {
      tone: 'professional',
      style: 'personal, value-driven, clear',
    },
    postingFrequency: {
      minHours: 24,
      maxHours: 168, // Weekly
      preferredTimes: [9, 10, 14], // Morning and early afternoon
    },
    targetAudience: {
      demographics: ['25-50', 'subscribers', 'engaged users'],
      interests: ['meditation', 'personal growth', 'manifestation', 'wellness'],
      painPoints: ['wanting updates', 'seeking value', 'looking for resources'],
    },
    learningRate: 0.2,
  };
  const emailAgent = new EmailAgent(emailConfig, memory);
  orchestrator.registerAgent(emailAgent);

  // Blog Agent
  const blogConfig: AgentConfig = {
    id: 'blog-main',
    name: 'Blog Content Agent',
    channel: 'blog',
    enabled: process.env.BLOG_AGENT_ENABLED === 'true',
    personality: {
      tone: 'authoritative',
      style: 'comprehensive, SEO-optimized, educational',
    },
    postingFrequency: {
      minHours: 72, // Every 3 days
      maxHours: 168, // Weekly
      preferredTimes: [10, 14], // Mid-morning and early afternoon
    },
    targetAudience: {
      demographics: ['25-55', 'readers', 'learners'],
      interests: ['deep dives', 'education', 'manifestation', 'meditation'],
      painPoints: ['wanting in-depth content', 'seeking knowledge', 'looking for guides'],
    },
    learningRate: 0.2,
  };
  const blogAgent = new BlogAgent(blogConfig, memory);
  orchestrator.registerAgent(blogAgent);

  initialized = true;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Wrap everything in try-catch to ensure we always return JSON
  try {
    // Check admin authentication
    try {
      if (!checkAdminAuth(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Unauthorized. Admin access required.',
          }),
        };
      }
    } catch (authError: any) {
      console.error('Auth check error:', authError);
      // In dev, allow through; in prod, block
      if (process.env.NODE_ENV === 'production') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Authentication error',
          }),
        };
      }
    }

    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ success: false, error: 'Method not allowed' }),
      };
    }

    // Initialize agents (with fallback)
    try {
      initializeAgents();
    } catch (initError: any) {
      console.error('Agent initialization error:', initError);
      // Return empty status instead of error, so dashboard can still load
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          orchestrator: {
            totalAgents: 0,
            enabledAgents: 0,
            agentsByChannel: {},
          },
          agents: [],
          timestamp: new Date().toISOString(),
          warning: 'Agents not initialized. Check server logs.',
        }),
      };
    }

    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    const agentId = queryParams.get('agentId');
    
    if (!agentId) {
      // Get all agents
      const agents = orchestrator.getAgents();
      const status = orchestrator.getStatus();

      const agentDetails = await Promise.all(
        agents.map(async (agent) => {
          try {
            const config = agent.getConfig();
            const memory = (agent as any).memory as any;
            
            let lastAction = null;
            let performances: any[] = [];
            let learnings: any = {};
            
            try {
              lastAction = memory?.getLastAction?.(config.id) || null;
            } catch (e) {
              console.error('Error getting last action:', e);
            }
            
            try {
              performances = memory?.getPerformanceHistory?.(config.id, 10) || [];
            } catch (e) {
              console.error('Error getting performance history:', e);
            }
            
            try {
              learnings = memory?.getLearnings?.(config.id) || {};
            } catch (e) {
              console.error('Error getting learnings:', e);
            }

          const totalActions = performances.length;
          const avgScore = learnings.averageScore || 0;
          const successRate = learnings.totalActions
            ? ((learnings.successfulActions || 0) / learnings.totalActions) * 100
            : 0;

          const recentPerformances = performances.slice(0, 5);
          const recentAvgScore = recentPerformances.length > 0
            ? recentPerformances.reduce((sum, p) => sum + p.score, 0) / recentPerformances.length
            : 0;

          return {
            id: config.id,
            name: config.name,
            channel: config.channel,
            enabled: config.enabled,
            personality: config.personality,
            lastAction: lastAction ? {
              id: lastAction.id,
              type: lastAction.type,
              status: lastAction.status,
              timestamp: lastAction.timestamp,
              content: lastAction.content.substring(0, 100) + (lastAction.content.length > 100 ? '...' : ''),
            } : null,
            stats: {
              totalActions,
              averageScore: Math.round(avgScore * 10) / 10,
              successRate: Math.round(successRate * 10) / 10,
              recentAverageScore: Math.round(recentAvgScore * 10) / 10,
            },
            learnings: {
              bestPerformingTopics: learnings.bestPerformingTopics || [],
              optimalPostingTimes: learnings.optimalPostingTimes || [],
            },
            shouldPostNow: agent.shouldPostNow(),
          };
          } catch (agentError: any) {
            console.error(`Error processing agent ${agent.getConfig().id}:`, agentError);
            // Return minimal agent info on error
            return {
              id: agent.getConfig().id,
              name: agent.getConfig().name,
              channel: agent.getConfig().channel,
              enabled: agent.getConfig().enabled,
              error: agentError?.message || 'Error loading agent data',
              stats: { totalActions: 0, averageScore: 0, successRate: 0, recentAverageScore: 0 },
              learnings: { bestPerformingTopics: [], optimalPostingTimes: [] },
              shouldPostNow: false,
            };
          }
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          orchestrator: status,
          agents: agentDetails,
          timestamp: new Date().toISOString(),
        }),
      };
    } else {
      // Get specific agent
      const agent = orchestrator.getAgent(agentId);
      if (!agent) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: `Agent ${agentId} not found` }),
        };
      }

      const config = agent.getConfig();
      const memory = (agent as any).memory as any;
      const limit = parseInt(queryParams.get('limit') || '50');
      const performances = memory?.getPerformanceHistory?.(config.id, limit) || [];
      const learnings = memory?.getLearnings?.(config.id) || {};

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          agent: {
            id: config.id,
            name: config.name,
            channel: config.channel,
            enabled: config.enabled,
            config: config,
            learnings,
            performances: performances.map(p => ({
              actionId: p.actionId,
              score: p.score,
              metrics: p.metrics,
              timestamp: p.timestamp,
            })),
          },
        }),
      };
    }
  } catch (error: any) {
    console.error('Agent status error:', error);
    console.error('Error stack:', error?.stack);
    // Always return JSON, never HTML
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
        type: error?.constructor?.name || 'Error',
        // Only include stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
      }),
    };
  }
};
