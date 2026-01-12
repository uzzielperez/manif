import 'dotenv/config';
import { BaseAgent, AgentConfig, AgentAction, AgentPerformance, AgentMemory } from '../agent-core';
import { generateContent, ContentPrompt } from '../content-generator';

/**
 * Twitter/X Marketing Agent
 * Handles posting tweets, tracking engagement, and learning from performance
 */

export class TwitterAgent extends BaseAgent {
  private apiKey: string;
  private apiSecret: string;
  private bearerToken: string;
  private clientId: string;
  private clientSecret: string;

  constructor(config: AgentConfig, memory: AgentMemory) {
    super(config, memory);
    
    // Twitter API credentials (Twitter API v2)
    this.apiKey = process.env.TWITTER_API_KEY || '';
    this.apiSecret = process.env.TWITTER_API_SECRET || '';
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    this.clientId = process.env.TWITTER_CLIENT_ID || '';
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET || '';

    if (!this.bearerToken && !this.apiKey) {
      console.warn('Twitter API credentials not configured. Twitter agent will run in test mode.');
    }
  }

  /**
   * Generate Twitter content using content generator
   */
  async generateContent(prompt: string, context?: Record<string, any>): Promise<string> {
    const contentPrompt: ContentPrompt = {
      channel: 'twitter',
      topic: prompt,
      tone: this.config.personality.tone,
      style: this.config.personality.style,
      targetAudience: this.config.targetAudience.interests,
      maxLength: 280,
      includeHashtags: true,
      includeCTA: true,
      context,
    };

    const result = await generateContent(contentPrompt);
    return result.content;
  }

  /**
   * Post content to Twitter/X
   */
  async postContent(content: string, metadata?: Record<string, any>): Promise<AgentAction> {
    const actionId = `tw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Truncate to 280 characters if needed
    const tweetContent = content.length > 280 ? content.substring(0, 277) + '...' : content;

    const action: AgentAction = {
      id: actionId,
      agentId: this.config.id,
      type: 'post',
      channel: 'twitter',
      content: tweetContent,
      metadata: {
        ...metadata,
        originalLength: content.length,
        truncated: content.length > 280,
      },
      timestamp: new Date(),
      status: 'pending',
    };

    // If Twitter API is not configured, simulate posting
    if (!this.bearerToken && !this.apiKey) {
      console.log('[TEST MODE] Would post to Twitter:', tweetContent);
      action.status = 'posted';
      action.metadata = { ...action.metadata, testMode: true };
      return action;
    }

    try {
      // Post to Twitter API v2
      const response = await this.postTweet(tweetContent);
      
      if (response.success) {
        action.status = 'posted';
        action.metadata = {
          ...action.metadata,
          tweetId: response.tweetId,
          url: response.url,
        };
      } else {
        action.status = 'failed';
        action.metadata = {
          ...action.metadata,
          error: response.error,
        };
      }
    } catch (error: any) {
      console.error('Twitter API error:', error);
      action.status = 'failed';
      action.metadata = {
        ...action.metadata,
        error: error.message || 'Unknown error',
      };
    }

    return action;
  }

  /**
   * Track performance of a posted tweet
   */
  async trackPerformance(actionId: string): Promise<AgentPerformance> {
    const action = await this.getActionById(actionId);
    if (!action || action.status !== 'posted') {
      throw new Error(`Action ${actionId} not found or not posted`);
    }

    const tweetId = action.metadata?.tweetId;
    if (!tweetId && !action.metadata?.testMode) {
      throw new Error('Tweet ID not found in action metadata');
    }

    // If in test mode, return mock performance
    if (action.metadata?.testMode) {
      return {
        agentId: this.config.id,
        actionId,
        metrics: {
          engagement: {
            likes: Math.floor(Math.random() * 50),
            retweets: Math.floor(Math.random() * 10),
            replies: Math.floor(Math.random() * 5),
            views: Math.floor(Math.random() * 500),
          },
          reach: Math.floor(Math.random() * 1000),
        },
        timestamp: new Date(),
        score: 50 + Math.random() * 40, // Random score between 50-90
      };
    }

    try {
      // Fetch tweet metrics from Twitter API
      const metrics = await this.getTweetMetrics(tweetId);
      
      // Calculate performance score
      const score = this.calculateScore(metrics);

      return {
        agentId: this.config.id,
        actionId,
        metrics,
        timestamp: new Date(),
        score,
      };
    } catch (error: any) {
      console.error('Error tracking Twitter performance:', error);
      // Return default performance on error
      return {
        agentId: this.config.id,
        actionId,
        metrics: {},
        timestamp: new Date(),
        score: 0,
      };
    }
  }

  /**
   * Post a tweet using Twitter API v2
   */
  private async postTweet(text: string): Promise<{ success: boolean; tweetId?: string; url?: string; error?: string }> {
    if (!this.bearerToken) {
      return { success: false, error: 'Twitter Bearer Token not configured' };
    }

    try {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: JSON.stringify(errorData) };
      }

      const data = await response.json();
      const tweetId = data.data?.id;
      const url = tweetId ? `https://twitter.com/i/web/status/${tweetId}` : undefined;

      return { success: true, tweetId, url };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get tweet metrics from Twitter API
   */
  private async getTweetMetrics(tweetId: string): Promise<AgentPerformance['metrics']> {
    if (!this.bearerToken) {
      return {};
    }

    try {
      const response = await fetch(
        `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }

      const data = await response.json();
      const metrics = data.data?.public_metrics;

      return {
        engagement: {
          likes: metrics?.like_count || 0,
          retweets: metrics?.retweet_count || 0,
          replies: metrics?.reply_count || 0,
          views: metrics?.impression_count || 0,
        },
        reach: metrics?.impression_count || 0,
      };
    } catch (error) {
      console.error('Error fetching tweet metrics:', error);
      return {};
    }
  }

  /**
   * Calculate performance score from metrics
   */
  private calculateScore(metrics: AgentPerformance['metrics']): number {
    let score = 0;
    const engagement = metrics.engagement || {};

    // Base score from engagement
    const likes = engagement.likes || 0;
    const retweets = engagement.retweets || 0;
    const replies = engagement.replies || 0;
    const views = engagement.views || 0;

    // Weighted scoring
    score += Math.min(likes * 2, 30); // Max 30 points for likes
    score += Math.min(retweets * 5, 25); // Max 25 points for retweets
    score += Math.min(replies * 3, 15); // Max 15 points for replies
    
    // Engagement rate bonus
    if (views > 0) {
      const engagementRate = ((likes + retweets + replies) / views) * 100;
      score += Math.min(engagementRate * 2, 30); // Max 30 points for engagement rate
    }

    return Math.min(score, 100);
  }

  /**
   * Helper to get action by ID from memory
   */
  private async getActionById(actionId: string): Promise<AgentAction | null> {
    // Get performance history to find the action
    const performances = await this.memory.getPerformanceHistory(this.config.id, 100);
    const performance = performances.find(p => p.actionId === actionId);
    
    if (!performance) {
      return null;
    }

    // In a real implementation, we'd fetch the full action from database
    // For now, return a minimal action object
    return {
      id: actionId,
      agentId: this.config.id,
      type: 'post',
      channel: 'twitter',
      content: '',
      timestamp: performance.timestamp,
      status: 'posted',
    };
  }
}
