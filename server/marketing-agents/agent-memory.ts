import { AgentAction, AgentPerformance, AgentMemory, AgentLearnings } from './agent-core';

/**
 * In-memory implementation of AgentMemory
 * TODO: Replace with database-backed implementation for persistence
 */
export class InMemoryAgentMemory implements AgentMemory {
  private actions: Map<string, AgentAction[]> = new Map();
  private performances: Map<string, AgentPerformance[]> = new Map();
  private learnings: Map<string, AgentLearnings> = new Map();

  async recordAction(action: AgentAction): Promise<void> {
    const agentActions = this.actions.get(action.agentId) || [];
    agentActions.push(action);
    this.actions.set(action.agentId, agentActions);
  }

  async recordPerformance(performance: AgentPerformance): Promise<void> {
    const agentPerformances = this.performances.get(performance.agentId) || [];
    agentPerformances.push(performance);
    this.performances.set(performance.agentId, agentPerformances);

    // Update learnings
    this.updateLearnings(performance.agentId);
  }

  getLastAction(agentId: string): AgentAction | null {
    const agentActions = this.actions.get(agentId) || [];
    if (agentActions.length === 0) return null;
    
    // Sort by timestamp descending and return most recent
    return agentActions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async getPerformanceHistory(agentId: string, limit: number = 100): Promise<AgentPerformance[]> {
    const agentPerformances = this.performances.get(agentId) || [];
    return agentPerformances
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async reinforcePattern(agentId: string, performance: AgentPerformance): Promise<void> {
    const learnings = this.getLearnings(agentId);
    
    // Extract patterns from successful performance
    // This is a simplified version - in production, use more sophisticated pattern extraction
    const action = await this.getActionById(performance.actionId);
    if (action) {
      // Extract topics/keywords from content
      const topics = this.extractTopics(action.content);
      if (learnings.bestPerformingTopics) {
        learnings.bestPerformingTopics = [...new Set([...learnings.bestPerformingTopics, ...topics])];
      } else {
        learnings.bestPerformingTopics = topics;
      }
    }

    this.learnings.set(agentId, learnings);
  }

  async avoidPattern(agentId: string, performance: AgentPerformance): Promise<void> {
    // Mark patterns to avoid - could be stored in a separate "avoid" list
    // For now, we'll just update learnings to reduce similar patterns
    const learnings = this.getLearnings(agentId);
    this.learnings.set(agentId, learnings);
  }

  getLearnings(agentId: string): AgentLearnings {
    const existing = this.learnings.get(agentId);
    if (existing) return existing;

    // Initialize learnings if not exists
    const performances = this.performances.get(agentId) || [];
    const learnings: AgentLearnings = {
      totalActions: performances.length,
      successfulActions: performances.filter(p => p.score > 50).length,
      averageScore: performances.length > 0
        ? performances.reduce((sum, p) => sum + p.score, 0) / performances.length
        : 0,
    };

    this.learnings.set(agentId, learnings);
    return learnings;
  }

  private updateLearnings(agentId: string): void {
    const performances = this.performances.get(agentId) || [];
    if (performances.length === 0) return;

    const learnings: AgentLearnings = {
      totalActions: performances.length,
      successfulActions: performances.filter(p => p.score > 50).length,
      averageScore: performances.reduce((sum, p) => sum + p.score, 0) / performances.length,
    };

    // Find best performing tone (if tracked in metadata)
    const topPerformances = performances
      .filter(p => p.score > 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (topPerformances.length > 0) {
      // Extract common patterns from top performances
      // This is simplified - in production, use ML/NLP to extract patterns
    }

    // Find optimal posting times
    const actions = this.actions.get(agentId) || [];
    const timePerformanceMap = new Map<number, number[]>();
    
    actions.forEach(action => {
      const hour = action.timestamp.getHours();
      const perf = performances.find(p => p.actionId === action.id);
      if (perf) {
        const scores = timePerformanceMap.get(hour) || [];
        scores.push(perf.score);
        timePerformanceMap.set(hour, scores);
      }
    });

    const optimalTimes: number[] = [];
    timePerformanceMap.forEach((scores, hour) => {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      if (avgScore > 60) {
        optimalTimes.push(hour);
      }
    });

    if (optimalTimes.length > 0) {
      learnings.optimalPostingTimes = optimalTimes.sort((a, b) => a - b);
    }

    this.learnings.set(agentId, learnings);
  }

  private async getActionById(actionId: string): Promise<AgentAction | null> {
    for (const actions of this.actions.values()) {
      const action = actions.find(a => a.id === actionId);
      if (action) return action;
    }
    return null;
  }

  private extractTopics(content: string): string[] {
    // Simple keyword extraction - in production, use NLP library
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4); // Filter short words
    
    // Count frequency and return top words
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}
