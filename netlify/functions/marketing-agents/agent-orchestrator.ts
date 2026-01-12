import { Handler } from '@netlify/functions';
import { AgentOrchestrator } from '../../../server/marketing-agents/orchestrator';
import { TwitterAgent } from '../../../server/marketing-agents/channels/twitter-agent';
import { BaseAgent, AgentConfig } from '../../../server/marketing-agents/agent-core';
import { InMemoryAgentMemory } from '../../../server/marketing-agents/agent-memory';

/**
 * Netlify Function: Agent Orchestrator
 * Main endpoint for running marketing agents
 * 
 * Usage:
 * - GET: Get orchestrator status
 * - POST: Run agents (with optional topics)
 */

const orchestrator = new AgentOrchestrator();
let initialized = false;

function initializeAgents() {
  if (initialized) return;

  const memory = new InMemoryAgentMemory();

  // Initialize Twitter Agent (example)
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
      preferredTimes: [9, 12, 15, 18, 21], // 9am, 12pm, 3pm, 6pm, 9pm
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

  // TODO: Initialize other agents (Reddit, Instagram, TikTok, Email, Blog)
  // as they are implemented

  initialized = true;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Initialize agents on first request
  initializeAgents();

  try {
    if (event.httpMethod === 'GET') {
      // Return orchestrator status
      const status = orchestrator.getStatus();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status,
          message: 'Agent orchestrator is running',
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { action, topics, agentId } = body;

      switch (action) {
        case 'run-scheduled':
          // Run all agents that should post now
          const actions = await orchestrator.runScheduledAgents(topics);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              actions: actions.map(a => ({
                id: a.id,
                agentId: a.agentId,
                channel: a.channel,
                status: a.status,
                timestamp: a.timestamp,
              })),
            }),
          };

        case 'run-agent':
          // Run a specific agent
          if (!agentId) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'agentId is required' }),
            };
          }

          const agent = orchestrator.getAgent(agentId);
          if (!agent) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: `Agent ${agentId} not found` }),
            };
          }

          const topic = topics && topics.length > 0
            ? topics[0]
            : 'manifestation techniques';

          const actionResult = await orchestrator.runAgent(agent, topic);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              action: actionResult ? {
                id: actionResult.id,
                agentId: actionResult.agentId,
                channel: actionResult.channel,
                status: actionResult.status,
              } : null,
            }),
          };

        case 'update-performance':
          // Update performance for a specific action
          const { actionId } = body;
          if (!agentId || !actionId) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'agentId and actionId are required' }),
            };
          }

          await orchestrator.updatePerformance(agentId, actionId);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
          };

        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action. Use: run-scheduled, run-agent, update-performance' }),
          };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Agent orchestrator error:', error);
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
