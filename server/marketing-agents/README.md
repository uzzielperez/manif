# Marketing Agents System

AI-powered marketing agents that autonomously create and post content across multiple channels, learn from performance, and improve over time.

## Architecture

### Core Components

1. **BaseAgent** (`agent-core.ts`)
   - Abstract base class for all marketing agents
   - Handles configuration, memory, learning, and orchestration
   - Provides common functionality: posting frequency checks, performance tracking

2. **AgentMemory** (`agent-memory.ts`)
   - Stores agent actions, performance metrics, and learnings
   - Currently in-memory implementation (TODO: database-backed)
   - Tracks patterns, optimal posting times, best-performing content

3. **ContentGenerator** (`content-generator.ts`)
   - Uses Groq API to generate marketing content
   - Channel-specific prompts (Twitter, Reddit, Instagram, etc.)
   - Brand voice consistency across all content
   - A/B testing support with content variations

4. **Orchestrator** (`orchestrator.ts`)
   - Coordinates multiple agents
   - Prevents conflicts (duplicate content, rate limiting)
   - Manages scheduling and execution

### Channel Agents

Each channel has its own agent implementation:

- **TwitterAgent** (`channels/twitter-agent.ts`) - ✅ Implemented
- **RedditAgent** (`channels/reddit-agent.ts`) - ⏳ TODO
- **TikTokAgent** (`channels/tiktok-agent.ts`) - ⏳ TODO
- **InstagramAgent** (`channels/instagram-agent.ts`) - ⏳ TODO
- **EmailAgent** (`channels/email-agent.ts`) - ⏳ TODO
- **BlogAgent** (`channels/blog-agent.ts`) - ⏳ TODO

## Features

### ✅ Implemented

- Core agent infrastructure
- Content generation using Groq
- Twitter/X agent (with test mode)
- Agent memory and learning system
- Orchestrator for multi-agent coordination
- Database schema for marketing data
- Netlify function for agent operations

### ⏳ In Progress / TODO

- Other channel agents (Reddit, TikTok, Instagram, Email, Blog)
- Google Analytics integration
- Buyer attribution tracking
- Performance evaluation dashboard
- Admin UI for monitoring and control
- Database persistence (currently in-memory)
- Advanced learning algorithms

## Usage

### Running Agents via Netlify Function

```bash
# Get orchestrator status
curl https://your-site.netlify.app/.netlify/functions/marketing-agents/agent-orchestrator

# Run all scheduled agents
curl -X POST https://your-site.netlify.app/.netlify/functions/marketing-agents/agent-orchestrator \
  -H "Content-Type: application/json" \
  -d '{"action": "run-scheduled", "topics": ["meditation", "manifestation"]}'

# Run specific agent
curl -X POST https://your-site.netlify.app/.netlify/functions/marketing-agents/agent-orchestrator \
  -H "Content-Type: application/json" \
  -d '{"action": "run-agent", "agentId": "twitter-main", "topics": ["cosmic alignment"]}'
```

### Environment Variables

Required for Twitter agent:
```env
GROQ_API_KEY=your_groq_key
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_AGENT_ENABLED=true
```

## How Agents Learn

1. **Performance Tracking**: Each posted action is tracked for engagement (likes, shares, views, conversions)

2. **Scoring**: Performance is scored (0-100) based on:
   - Engagement metrics (likes, retweets, comments)
   - Conversion metrics (purchases, signups)
   - Reach metrics (impressions, views)

3. **Pattern Recognition**: Successful patterns are reinforced:
   - Best-performing topics/keywords
   - Optimal posting times
   - Effective tone and style

4. **Adaptation**: Agent configuration is updated based on learnings:
   - Adjusts posting frequency
   - Refines target audience
   - Optimizes content style

## Brand Voice

All agents follow consistent brand voice guidelines:
- Cosmic, mystical, yet accessible
- Empowering and inspiring
- Focus on transformation and alignment
- Balance spiritual depth with practical action
- Authentic and genuine (not salesy)

## Next Steps

1. Implement remaining channel agents
2. Add Google Analytics integration for performance tracking
3. Build buyer attribution system (link purchases to marketing channels)
4. Create admin dashboard for monitoring and control
5. Implement database persistence
6. Add advanced ML-based learning algorithms

## Testing

Agents can run in "test mode" when API credentials are not configured. In test mode:
- Content is generated but not posted
- Performance metrics are simulated
- All learning mechanisms still work

This allows development and testing without API costs.
