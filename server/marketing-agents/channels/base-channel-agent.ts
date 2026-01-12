import { BaseAgent, AgentConfig, AgentAction, AgentPerformance, AgentMemory } from '../agent-core';
import { generateContent, ContentPrompt } from '../content-generator';

/**
 * Base implementation for channel agents
 * Provides common functionality that all channel agents share
 */
export abstract class BaseChannelAgent extends BaseAgent {
  constructor(config: AgentConfig, memory: AgentMemory) {
    super(config, memory);
  }

  /**
   * Generate content using content generator
   */
  async generateContent(prompt: string, context?: Record<string, any>): Promise<string> {
    const contentPrompt: ContentPrompt = {
      channel: this.config.channel as any,
      topic: prompt,
      tone: this.config.personality.tone,
      style: this.config.personality.style,
      targetAudience: this.config.targetAudience.interests,
      includeHashtags: this.config.channel === 'twitter' || this.config.channel === 'instagram',
      includeCTA: true,
      context,
    };

    const result = await generateContent(contentPrompt);
    return result.content;
  }

  /**
   * Default implementation - subclasses should override
   */
  async postContent(content: string, metadata?: Record<string, any>): Promise<AgentAction> {
    const actionId = `${this.config.channel}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: actionId,
      agentId: this.config.id,
      type: 'post',
      channel: this.config.channel,
      content,
      metadata: {
        ...metadata,
        status: 'not_implemented',
      },
      timestamp: new Date(),
      status: 'pending',
    };
  }

  /**
   * Default implementation - subclasses should override
   */
  async trackPerformance(actionId: string): Promise<AgentPerformance> {
    return {
      agentId: this.config.id,
      actionId,
      metrics: {},
      timestamp: new Date(),
      score: 0,
    };
  }
}
