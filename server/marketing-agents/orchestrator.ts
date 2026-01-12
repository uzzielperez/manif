import 'dotenv/config';
import { BaseAgent, AgentConfig, AgentAction } from './agent-core';
import { InMemoryAgentMemory } from './agent-memory';

/**
 * Agent Orchestrator
 * Coordinates multiple marketing agents, prevents conflicts, manages scheduling
 */

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private memory: InMemoryAgentMemory;

  constructor() {
    this.memory = new InMemoryAgentMemory();
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agent: BaseAgent): void {
    const config = agent.getConfig();
    this.agents.set(config.id, agent);
    console.log(`Registered agent: ${config.name} (${config.channel})`);
  }

  /**
   * Get all registered agents
   */
  getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get enabled agents
   */
  getEnabledAgents(): BaseAgent[] {
    return Array.from(this.agents.values()).filter(agent => {
      const config = agent.getConfig();
      return config.enabled;
    });
  }

  /**
   * Run all agents that should post now
   */
  async runScheduledAgents(topics?: string[]): Promise<AgentAction[]> {
    const enabledAgents = this.getEnabledAgents();
    const actions: AgentAction[] = [];

    for (const agent of enabledAgents) {
      if (agent.shouldPostNow()) {
        try {
          // Select a topic (random or from provided list)
          const topic = topics && topics.length > 0
            ? topics[Math.floor(Math.random() * topics.length)]
            : this.getDefaultTopic();

          // Generate and post content
          const action = await this.runAgent(agent, topic);
          if (action) {
            actions.push(action);
          }
        } catch (error) {
          console.error(`Error running agent ${agent.getConfig().id}:`, error);
        }
      }
    }

    return actions;
  }

  /**
   * Run a specific agent with a topic
   */
  async runAgent(agent: BaseAgent, topic: string): Promise<AgentAction | null> {
    const config = agent.getConfig();
    
    try {
      // Generate content
      const content = await agent.generateContent(topic, {
        channel: config.channel,
        tone: config.personality.tone,
        targetAudience: config.targetAudience.interests,
      });

      // Post content
      const action = await agent.postContent(content, {
        topic,
        generatedAt: new Date(),
      });

      // Record action in memory
      await this.memory.recordAction(action);

      console.log(`Agent ${config.name} posted: ${action.id}`);
      return action;
    } catch (error) {
      console.error(`Error running agent ${config.id}:`, error);
      return null;
    }
  }

  /**
   * Check for conflicts (e.g., duplicate content, too many posts at once)
   */
  async checkConflicts(proposedAction: AgentAction): Promise<boolean> {
    // Check if similar content was recently posted
    const recentActions = await this.memory.getPerformanceHistory(proposedAction.agentId, 10);
    
    // Simple similarity check (in production, use NLP for better comparison)
    const recentContent = recentActions
      .map(p => {
        // Would need to fetch action by ID - simplified for now
        return '';
      })
      .join(' ');

    // Check for duplicate hashtags or very similar text
    // This is a simplified check - in production, use more sophisticated similarity detection
    return false; // No conflicts found
  }

  /**
   * Get default topics for content generation
   */
  private getDefaultTopic(): string {
    const topics = [
      'manifestation techniques',
      'meditation benefits',
      'cosmic alignment',
      'intentional living',
      'spiritual growth',
      'mindfulness practices',
      'goal achievement',
      'inner peace',
      'personal transformation',
      'conscious creation',
    ];

    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Update agent performance and trigger learning
   */
  async updatePerformance(agentId: string, actionId: string): Promise<void> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      console.warn(`Agent ${agentId} not found`);
      return;
    }

    try {
      const performance = await agent.trackPerformance(actionId);
      await agent.learnFromPerformance(performance);
    } catch (error) {
      console.error(`Error updating performance for agent ${agentId}:`, error);
    }
  }

  /**
   * Get orchestrator status
   */
  getStatus(): {
    totalAgents: number;
    enabledAgents: number;
    agentsByChannel: Record<string, number>;
  } {
    const agents = this.getAgents();
    const enabled = this.getEnabledAgents();
    
    const agentsByChannel: Record<string, number> = {};
    agents.forEach(agent => {
      const channel = agent.getConfig().channel;
      agentsByChannel[channel] = (agentsByChannel[channel] || 0) + 1;
    });

    return {
      totalAgents: agents.length,
      enabledAgents: enabled.length,
      agentsByChannel,
    };
  }
}
