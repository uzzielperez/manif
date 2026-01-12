import 'dotenv/config';

/**
 * Base Agent class for all marketing agents
 * Provides common functionality: memory, learning, configuration, orchestration
 */

export interface AgentConfig {
  id: string;
  name: string;
  channel: 'twitter' | 'reddit' | 'tiktok' | 'instagram' | 'email' | 'blog';
  enabled: boolean;
  personality: {
    tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'inspiring';
    style: string; // Custom style description
  };
  postingFrequency: {
    minHours: number;
    maxHours: number;
    preferredTimes: number[]; // Hours of day (0-23)
  };
  targetAudience: {
    demographics: string[];
    interests: string[];
    painPoints: string[];
  };
  learningRate: number; // 0-1, how quickly agent adapts to feedback
}

export interface AgentAction {
  id: string;
  agentId: string;
  type: 'post' | 'reply' | 'comment' | 'email' | 'schedule';
  channel: string;
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'approved' | 'posted' | 'failed';
}

export interface AgentPerformance {
  agentId: string;
  actionId: string;
  metrics: {
    engagement?: {
      likes?: number;
      shares?: number;
      comments?: number;
      views?: number;
      clicks?: number;
    };
    conversions?: {
      purchases?: number;
      signups?: number;
      revenue?: number;
    };
    reach?: number;
  };
  timestamp: Date;
  score: number; // Calculated performance score (0-100)
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected memory: AgentMemory;

  constructor(config: AgentConfig, memory: AgentMemory) {
    this.config = config;
    this.memory = memory;
  }

  /**
   * Generate content using the content generator
   * Each agent implements its own content strategy
   */
  abstract generateContent(prompt: string, context?: Record<string, any>): Promise<string>;

  /**
   * Post content to the agent's channel
   */
  abstract postContent(content: string, metadata?: Record<string, any>): Promise<AgentAction>;

  /**
   * Track performance of a posted action
   */
  abstract trackPerformance(actionId: string): Promise<AgentPerformance>;

  /**
   * Learn from performance data and update behavior
   */
  async learnFromPerformance(performance: AgentPerformance): Promise<void> {
    // Store performance in memory
    await this.memory.recordPerformance(performance);

    // Update agent configuration based on learnings
    if (performance.score > 70) {
      // Successful pattern - reinforce
      await this.memory.reinforcePattern(this.config.id, performance);
    } else if (performance.score < 30) {
      // Failed pattern - avoid
      await this.memory.avoidPattern(this.config.id, performance);
    }

    // Adjust learning parameters
    this.updateConfigFromLearnings();
  }

  /**
   * Update agent config based on accumulated learnings
   */
  protected updateConfigFromLearnings(): void {
    const learnings = this.memory.getLearnings(this.config.id);
    
    // Example: Adjust tone based on what works
    if (learnings.bestPerformingTone) {
      this.config.personality.tone = learnings.bestPerformingTone;
    }

    // Example: Adjust posting frequency based on engagement patterns
    if (learnings.optimalPostingTimes.length > 0) {
      this.config.postingFrequency.preferredTimes = learnings.optimalPostingTimes;
    }
  }

  /**
   * Check if agent should post now based on frequency rules
   */
  shouldPostNow(): boolean {
    if (!this.config.enabled) return false;

    const now = new Date();
    const hour = now.getHours();
    
    // Check if current hour is in preferred times
    if (this.config.postingFrequency.preferredTimes.length > 0) {
      if (!this.config.postingFrequency.preferredTimes.includes(hour)) {
        return false;
      }
    }

    // Check last post time
    const lastAction = this.memory.getLastAction(this.config.id);
    if (lastAction) {
      const hoursSinceLastPost = (now.getTime() - lastAction.timestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastPost < this.config.postingFrequency.minHours) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Update agent configuration
   */
  updateConfig(updates: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

/**
 * Agent Memory interface for storing and retrieving agent learnings
 */
export interface AgentMemory {
  recordAction(action: AgentAction): Promise<void>;
  recordPerformance(performance: AgentPerformance): Promise<void>;
  getLastAction(agentId: string): AgentAction | null;
  getPerformanceHistory(agentId: string, limit?: number): Promise<AgentPerformance[]>;
  reinforcePattern(agentId: string, performance: AgentPerformance): Promise<void>;
  avoidPattern(agentId: string, performance: AgentPerformance): Promise<void>;
  getLearnings(agentId: string): AgentLearnings;
}

export interface AgentLearnings {
  bestPerformingTone?: string;
  bestPerformingTopics?: string[];
  optimalPostingTimes?: number[];
  averageScore?: number;
  totalActions?: number;
  successfulActions?: number;
}
