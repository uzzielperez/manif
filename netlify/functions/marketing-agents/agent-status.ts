import { Handler } from '@netlify/functions';
import { AgentOrchestrator } from '../../../server/marketing-agents/orchestrator';
import { TwitterAgent } from '../../../server/marketing-agents/channels/twitter-agent';
import { BaseAgent, AgentConfig } from '../../../server/marketing-agents/agent-core';
import { InMemoryAgentMemory } from '../../../server/marketing-agents/agent-memory';

/**
 * Netlify Function: Agent Status & Monitoring
 * Provides detailed status, performance metrics, and history for all agents
 */

const orchestrator = new AgentOrchestrator();
let initialized = false;

function initializeAgents() {
  if (initialized) return;

  const memory = new InMemoryAgentMemory();

  // Initialize Twitter Agent
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

  initialized = true;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  initializeAgents();

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const path = event.path.split('/').pop() || '';
    const queryParams = new URLSearchParams(event.queryStringParameters || {});

    // Get all agents with detailed status
    if (path === 'agent-status' || path === '') {
      const agents = orchestrator.getAgents();
      const status = orchestrator.getStatus();

      const agentDetails = await Promise.all(
        agents.map(async (agent) => {
          const config = agent.getConfig();
          const memory = (agent as any).memory as any;
          
          // Get last action
          const lastAction = memory?.getLastAction?.(config.id) || null;
          
          // Get performance history
          const performances = memory?.getPerformanceHistory?.(config.id, 10) || [];
          
          // Get learnings
          const learnings = memory?.getLearnings?.(config.id) || {};

          // Calculate stats
          const totalActions = performances.length;
          const avgScore = learnings.averageScore || 0;
          const successRate = learnings.totalActions
            ? ((learnings.successfulActions || 0) / learnings.totalActions) * 100
            : 0;

          // Recent performance trend
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
    }

    // Get specific agent details
    const agentId = queryParams.get('agentId');
    if (agentId) {
      const agent = orchestrator.getAgent(agentId);
      if (!agent) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `Agent ${agentId} not found` }),
        };
      }

      const config = agent.getConfig();
      const memory = (agent as any).memory as any;
      
      // Get full performance history
      const limit = parseInt(queryParams.get('limit') || '50');
      const performances = memory?.getPerformanceHistory?.(config.id, limit) || [];
      
      // Get learnings
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

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  } catch (error: any) {
    console.error('Agent status error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
