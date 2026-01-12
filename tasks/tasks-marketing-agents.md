# Tasks - AI Marketing Agents System

## Relevant Files

- `server/marketing-agents/` - New directory for marketing agent infrastructure
  - `agent-core.ts` - Core agent orchestration and learning system
  - `agent-memory.ts` - Persistent memory/feedback loop for agent improvement
  - `content-generator.ts` - AI-powered content generation using Groq
  - `scheduler.ts` - Content scheduling and calendar management
- `server/marketing-agents/channels/` - Channel-specific integrations
  - `twitter-agent.ts` - Twitter/X API integration and posting logic
  - `reddit-agent.ts` - Reddit API integration and community engagement
  - `tiktok-agent.ts` - TikTok API integration and video content planning
  - `instagram-agent.ts` - Instagram Graph API integration and posting
  - `email-agent.ts` - Email marketing and mailing list management
  - `blog-agent.ts` - Blog content generation and scheduling
- `server/marketing-agents/analytics/` - Analytics and performance tracking
  - `ga-analyzer.ts` - Google Analytics 4 data extraction and insights
  - `buyer-tracker.ts` - Stripe webhook integration for purchase tracking
  - `performance-evaluator.ts` - Cross-channel performance analysis and optimization
- `netlify/functions/marketing-agents/` - Serverless endpoints for agent operations
  - `agent-orchestrator.ts` - Main function to trigger and coordinate agents
  - `content-approval.ts` - Human-in-the-loop approval system (optional)
  - `analytics-webhook.ts` - Webhook receiver for real-time analytics updates
- `src/components/admin/MarketingDashboard.tsx` - Admin UI for monitoring and controlling agents
- `src/components/admin/AgentConfig.tsx` - Configuration panel for agent behavior and learning parameters
- `shared/marketing-schema.ts` - Database schema for marketing data, content, and performance metrics

### Notes

- Marketing agents should use Groq API (like existing meditation/timeline generation) for content creation
- All agents should log their actions and performance metrics for learning
- Implement a feedback loop where agent performance (engagement, conversions) improves future content
- Use environment variables for all API keys (Twitter, Reddit, TikTok, Instagram, email service)
- Consider rate limits and implement queuing/throttling for API calls
- Unit tests should be placed alongside code files (e.g., `twitter-agent.test.ts`)

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Progress Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-01-12 | Marketing Agents System - Foundation | Completed | Built core infrastructure: BaseAgent class, AgentMemory system, ContentGenerator using Groq, and AgentOrchestrator |
| 2026-01-12 | Twitter Agent Implementation | Completed | Created TwitterAgent with posting, engagement tracking, and performance scoring. Currently disabled (needs API credentials) |
| 2026-01-12 | Admin Dashboard & Security | Completed | Built secure AdminPortal with password authentication at `/admin`. Marketing dashboard is now discrete and protected |
| 2026-01-12 | Database Schema | Completed | Created marketing-schema.ts with tables for agents, actions, performance, learnings, content library, and buyer attribution |
| 2026-01-12 | Netlify Functions | Completed | Created agent-orchestrator and agent-status functions. Fixed routing issues and added comprehensive error handling |
| 2026-01-12 | Current Status | Working | Dashboard is live and functional. Twitter agent is registered but disabled. Ready for API credential setup and additional channel agents |

## Next Session: Getting Agents Working

### Immediate Steps to Enable Twitter Agent

1. **Get Twitter API Credentials:**
   - Go to https://developer.twitter.com/en/portal/dashboard
   - Create a new app or use existing app
   - Generate API keys:
     - `TWITTER_API_KEY`
     - `TWITTER_API_SECRET`
     - `TWITTER_BEARER_TOKEN`
     - `TWITTER_CLIENT_ID`
     - `TWITTER_CLIENT_SECRET`

2. **Set Environment Variables in Netlify:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add the following:
     ```
     TWITTER_API_KEY=your_key_here
     TWITTER_API_SECRET=your_secret_here
     TWITTER_BEARER_TOKEN=your_bearer_token_here
     TWITTER_CLIENT_ID=your_client_id_here
     TWITTER_CLIENT_SECRET=your_client_secret_here
     TWITTER_AGENT_ENABLED=true
     ADMIN_PASSWORD=your_secure_admin_password
     REACT_APP_ADMIN_PASSWORD=your_secure_admin_password
     ```

3. **Redeploy Site:**
   - After adding environment variables, trigger a new deployment
   - The Twitter agent should now show as "Enabled" in the dashboard

4. **Test the Agent:**
   - Go to `/admin` and log in
   - You should see "Twitter Main Agent" with status "Enabled"
   - The agent will automatically post when conditions are met (posting frequency, optimal times)

### Next Agents to Implement

**Priority Order:**
1. **Reddit Agent** (Task 4.0) - Good for community engagement
2. **Email Agent** (Task 7.0) - Direct communication channel
3. **Blog Agent** (Task 8.0) - SEO and content marketing
4. **Instagram Agent** (Task 6.0) - Visual content platform
5. **TikTok Agent** (Task 5.0) - Video content (most complex)

### For Each New Agent

1. **Create Agent File:**
   - Copy `server/marketing-agents/channels/twitter-agent.ts` as template
   - Update channel-specific logic (API calls, posting format)
   - Implement `generateContent()`, `postContent()`, and `trackPerformance()` methods

2. **Register in Orchestrator:**
   - Add agent initialization in `netlify/functions/marketing-agents-status.ts`
   - Add agent initialization in `netlify/functions/marketing-agents/agent-orchestrator.ts`

3. **Set Environment Variables:**
   - Add API credentials for the platform
   - Set `[PLATFORM]_AGENT_ENABLED=true`

4. **Test:**
   - Verify agent appears in dashboard
   - Test content generation
   - Test posting (use test mode if available)

### Google Analytics Integration (Task 9.0)

**Setup:**
1. Get Google Analytics Data API credentials
2. Set `GOOGLE_ANALYTICS_PROPERTY_ID` environment variable
3. Implement `ga-analyzer.ts` to extract metrics
4. Connect to agent performance tracking

### Buyer Tracking (Task 10.0)

**Setup:**
1. Enhance existing Stripe webhook handler
2. Add buyer attribution logic to link purchases to marketing channels
3. Track which agent/channel led to conversion
4. Calculate ROI per agent

### Performance Learning (Task 11.0)

**Already Partially Implemented:**
- Agent memory system tracks performance
- Basic learning (optimal times, best topics) is working
- Can be enhanced with ML-based pattern recognition

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch `feature/marketing-agents`
- [x] 1.0 Build Core Agent Infrastructure
  - [x] 1.1 Create `server/marketing-agents/agent-core.ts` with base Agent class
  - [x] 1.2 Implement agent memory system (`agent-memory.ts`) for storing past actions, outcomes, and learnings
  - [x] 1.3 Build feedback loop mechanism that updates agent behavior based on performance metrics
  - [x] 1.4 Create agent configuration system (personality, tone, posting frequency, target audience)
  - [ ] 1.5 Implement agent orchestration logic to coordinate multiple agents and prevent conflicts
- [x] 2.0 Implement Content Generation System
  - [x] 2.1 Create `content-generator.ts` using Groq API for generating marketing content
  - [x] 2.2 Build prompt templates for different content types (tweets, Reddit posts, blog posts, captions)
  - [x] 2.3 Implement content variation system (generate multiple options, A/B test variations)
  - [x] 2.4 Add content quality scoring based on engagement predictions
  - [x] 2.5 Integrate brand voice and messaging guidelines into content generation
- [x] 3.0 Build Twitter/X Agent
  - [x] 3.1 Set up Twitter API v2 authentication and client
  - [x] 3.2 Implement tweet generation using content generator
  - [x] 3.3 Build tweet posting functionality with media support (images, videos)
  - [x] 3.4 Add engagement tracking (likes, retweets, replies, impressions)
  - [ ] 3.5 Implement thread generation for longer-form content
  - [ ] 3.6 Create reply/engagement logic for responding to mentions and comments
  - [ ] 3.7 Add hashtag research and trending topic integration
- [ ] 4.0 Build Reddit Agent
  - [ ] 4.1 Set up Reddit API (PRAW or Reddit API) authentication
  - [ ] 4.2 Implement subreddit discovery and targeting logic
  - [ ] 4.3 Build post generation for relevant subreddits (r/meditation, r/manifestation, etc.)
  - [ ] 4.4 Add comment engagement logic (responding to questions, providing value)
  - [ ] 4.5 Implement upvote tracking and community sentiment analysis
  - [ ] 4.6 Create Reddit-specific content guidelines (avoiding spam, following subreddit rules)
  - [ ] 4.7 Add rate limiting and cooldown logic to respect Reddit's API limits
- [ ] 5.0 Build TikTok Agent
  - [ ] 5.1 Set up TikTok Marketing API authentication
  - [ ] 5.2 Implement video content planning and script generation
  - [ ] 5.3 Build caption generation optimized for TikTok (trending sounds, hashtags)
  - [ ] 5.4 Add video metadata and scheduling (posting time optimization)
  - [ ] 5.5 Implement engagement tracking (views, likes, shares, comments)
  - [ ] 5.6 Create trend analysis to identify relevant TikTok trends and challenges
  - [ ] 5.7 Note: Video creation/editing may require external tools or manual review
- [ ] 6.0 Build Instagram Agent
  - [ ] 6.1 Set up Instagram Graph API authentication (Business/Creator account required)
  - [ ] 6.2 Implement post generation (captions, hashtags) for feed posts
  - [ ] 6.3 Build Stories content generation and scheduling
  - [ ] 6.4 Add Reels planning and caption generation
  - [ ] 6.5 Implement engagement tracking (likes, comments, saves, shares)
  - [ ] 6.6 Create hashtag research and optimization for reach
  - [ ] 6.7 Add visual content planning (suggest images/videos to pair with captions)
- [ ] 7.0 Build Email Marketing Agent
  - [ ] 7.1 Set up email service integration (SendGrid, Mailchimp, or Resend)
  - [ ] 7.2 Implement mailing list management (subscribe, unsubscribe, segmentation)
  - [ ] 7.3 Build email content generation (subject lines, body content, CTAs)
  - [ ] 7.4 Create email campaign scheduling and automation
  - [ ] 7.5 Add email performance tracking (open rates, click rates, conversions)
  - [ ] 7.6 Implement A/B testing for subject lines and content
  - [ ] 7.7 Build subscriber segmentation based on behavior and preferences
- [ ] 8.0 Build Blog Content Agent
  - [ ] 8.1 Create blog post generation using Groq (long-form content)
  - [ ] 8.2 Implement SEO optimization (keyword research, meta descriptions, headings)
  - [ ] 8.3 Build blog scheduling system (editorial calendar)
  - [ ] 8.4 Add blog performance tracking (views, time on page, bounce rate)
  - [ ] 8.5 Create topic research and content gap analysis
  - [ ] 8.6 Implement internal linking suggestions
  - [ ] 8.7 Add blog post promotion across other channels (auto-share to Twitter, Reddit, etc.)
- [ ] 9.0 Build Google Analytics Integration
  - [ ] 9.1 Set up Google Analytics Data API authentication
  - [ ] 9.2 Implement data extraction for key metrics (page views, sessions, bounce rate, conversions)
  - [ ] 9.3 Build automated insights generation (identifying trends, anomalies, opportunities)
  - [ ] 9.4 Create performance reports for marketing agents (which content drives traffic)
  - [ ] 9.5 Implement goal tracking and conversion attribution
  - [ ] 9.6 Add real-time analytics monitoring for immediate feedback
  - [ ] 9.7 Build dashboard visualization of analytics data for agents
- [ ] 10.0 Build Buyer Tracking System
  - [ ] 10.1 Enhance existing Stripe webhook handler to log purchases for marketing analysis
  - [ ] 10.2 Create buyer attribution system (which marketing channel led to purchase)
  - [ ] 10.3 Implement customer lifetime value (CLV) calculation
  - [ ] 10.4 Build conversion funnel analysis (awareness → interest → purchase)
  - [ ] 10.5 Add revenue tracking per marketing channel
  - [ ] 10.6 Create ROI calculation for each marketing agent's activities
  - [ ] 10.7 Implement customer segmentation based on purchase behavior
- [ ] 11.0 Build Performance Evaluation & Learning System
  - [ ] 11.1 Create `performance-evaluator.ts` to analyze agent outputs across channels
  - [ ] 11.2 Implement scoring system for content (engagement rate, conversion rate, reach)
  - [ ] 11.3 Build feedback loop that updates agent prompts based on top-performing content
  - [ ] 11.4 Add A/B testing framework to compare different content strategies
  - [ ] 11.5 Implement reinforcement learning logic (reward successful patterns, penalize failures)
  - [ ] 11.6 Create agent memory database schema to store learnings
  - [ ] 11.7 Build weekly/monthly performance reports for agent improvement
- [x] 12.0 Build Scheduling & Orchestration System
  - [x] 12.1 Create `scheduler.ts` for managing content calendar across all channels (integrated into orchestrator)
  - [x] 12.2 Implement optimal posting time calculation based on audience analytics
  - [ ] 12.3 Build content queue system with priority levels
  - [x] 12.4 Add conflict detection (prevent duplicate content across channels)
  - [ ] 12.5 Create scheduling UI/API for manual overrides and approvals
  - [ ] 12.6 Implement timezone handling for global audience
  - [ ] 12.7 Add calendar integration (Google Calendar, Outlook) for visibility
- [x] 13.0 Build Admin Dashboard & Controls
  - [x] 13.1 Create `MarketingDashboard.tsx` component for monitoring all agents
  - [x] 13.2 Build real-time activity feed showing agent actions and results
  - [ ] 13.3 Implement agent enable/disable controls
  - [ ] 13.4 Add content approval workflow (optional human review before posting)
  - [x] 13.5 Create performance metrics visualization (charts, graphs)
  - [ ] 13.6 Build agent configuration UI (`AgentConfig.tsx`) for adjusting behavior
  - [ ] 13.7 Add emergency stop/rollback functionality
- [ ] 14.0 Build Database Schema & Storage
  - [ ] 14.1 Create `shared/marketing-schema.ts` with TypeScript types
  - [ ] 14.2 Design database tables for: agent actions, content library, performance metrics, learnings
  - [ ] 14.3 Implement data persistence layer (use existing database setup or add new)
  - [ ] 14.4 Add data retention and archival policies
  - [ ] 14.5 Create indexes for efficient querying of performance data
- [x] 15.0 Build Netlify Functions for Agent Operations
  - [x] 15.1 Create `netlify/functions/marketing-agents/agent-orchestrator.ts` main endpoint
  - [ ] 15.2 Implement scheduled triggers (cron jobs) for automated agent runs
  - [ ] 15.3 Build webhook receiver for analytics updates (`analytics-webhook.ts`)
  - [ ] 15.4 Add content approval endpoint (`content-approval.ts`) for human review
  - [x] 15.5 Implement error handling and retry logic for failed agent actions
  - [x] 15.6 Add logging and monitoring for agent health
- [ ] 16.0 Testing & Quality Assurance
  - [ ] 16.1 Write unit tests for each agent's core functionality
  - [ ] 16.2 Create integration tests for API connections (use sandbox/test accounts)
  - [ ] 16.3 Implement end-to-end tests for agent workflows
  - [ ] 16.4 Add performance tests to ensure agents don't exceed rate limits
  - [ ] 16.5 Create test data and mock responses for development
  - [ ] 16.6 Build staging environment for safe agent testing before production
- [ ] 17.0 Documentation & Onboarding
  - [ ] 17.1 Write API documentation for all agent endpoints
  - [ ] 17.2 Create user guide for configuring and managing agents
  - [ ] 17.3 Document required API keys and setup steps for each platform
  - [ ] 17.4 Add troubleshooting guide for common issues
  - [ ] 17.5 Create example configurations and use cases
  - [ ] 17.6 Document learning/improvement mechanisms and how to interpret agent performance
