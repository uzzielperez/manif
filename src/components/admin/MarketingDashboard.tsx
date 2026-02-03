import { useState, useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';

interface AgentStatus {
  id: string;
  name: string;
  channel: string;
  enabled: boolean;
  personality: {
    tone: string;
    style: string;
  };
  lastAction: {
    id: string;
    type: string;
    status: string;
    timestamp: string;
    content: string;
  } | null;
  stats: {
    totalActions: number;
    averageScore: number;
    successRate: number;
    recentAverageScore: number;
  };
  learnings: {
    bestPerformingTopics: string[];
    optimalPostingTimes: number[];
  };
  shouldPostNow: boolean;
}

interface OrchestratorStatus {
  totalAgents: number;
  enabledAgents: number;
  agentsByChannel: Record<string, number>;
}

interface AgentStatusResponse {
  success: boolean;
  orchestrator: OrchestratorStatus;
  agents: AgentStatus[];
  timestamp: string;
}

const adminPassword = () => process.env.REACT_APP_ADMIN_PASSWORD || 'manifest-admin-2024';

export default function MarketingDashboard() {
  const [status, setStatus] = useState<AgentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ agentId: string; success: boolean; contentPreview?: string; error?: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      // Get admin password from localStorage (set by AdminPortal)
      const authData = localStorage.getItem('manifest_admin_authenticated');
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'manifest-admin-2024';
      
      const response = await fetch('/.netlify/functions/marketing-agents-status', {
        headers: {
          'Authorization': `Bearer ${adminPassword()}`,
        },
      });
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 200)}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data: AgentStatusResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch agent status');
      }
      
      setStatus(data);
      setError(null);
      trackEvent('marketing_dashboard_view', {
        total_agents: data.orchestrator.totalAgents,
        enabled_agents: data.orchestrator.enabledAgents,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agent status');
      console.error('Error fetching agent status:', err);
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (agentId: string) => {
    setTestResult(null);
    setRunningAgentId(agentId);
    try {
      const res = await fetch('/.netlify/functions/marketing-agents/agent-orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword()}`,
        },
        body: JSON.stringify({
          action: 'run-agent',
          agentId,
          topics: ['manifestation techniques'],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTestResult({ agentId, success: false, error: data.error || `HTTP ${res.status}` });
        return;
      }
      setTestResult({
        agentId,
        success: !!data.action,
        contentPreview: data.action?.contentPreview,
        error: data.action ? undefined : 'No action returned',
      });
      if (data.action) fetchStatus();
    } catch (err: any) {
      setTestResult({ agentId, success: false, error: err.message || 'Request failed' });
    } finally {
      setRunningAgentId(null);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'twitter':
        return '🐦';
      case 'reddit':
        return '🤖';
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'email':
        return '📧';
      case 'blog':
        return '✍️';
      default:
        return '🤖';
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading agent status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-200">
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p>{error}</p>
            <button
              onClick={fetchStatus}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Marketing Agents Dashboard</h1>
          <p className="text-purple-200">
            Monitor and track your AI marketing agents' performance and learnings
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={fetchStatus}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              Refresh
            </button>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span>Auto-refresh (30s)</span>
            </label>
            {status && (
              <span className="text-purple-300 text-sm">
                Last updated: {formatTime(status.timestamp)}
              </span>
            )}
          </div>
        </div>

        {/* Orchestrator Overview */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <div className="text-purple-300 text-sm mb-1">Total Agents</div>
              <div className="text-3xl font-bold text-white">{status.orchestrator.totalAgents}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-green-500/30 rounded-lg p-6">
              <div className="text-green-300 text-sm mb-1">Enabled Agents</div>
              <div className="text-3xl font-bold text-white">{status.orchestrator.enabledAgents}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-blue-500/30 rounded-lg p-6">
              <div className="text-blue-300 text-sm mb-1">Channels Active</div>
              <div className="text-3xl font-bold text-white">
                {Object.keys(status.orchestrator.agentsByChannel).length}
              </div>
            </div>
          </div>
        )}

        {/* Agents List */}
        {status && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Agents</h2>
            {status.agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getChannelIcon(agent.channel)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                      <p className="text-purple-300 text-sm capitalize">{agent.channel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.enabled ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                        Disabled
                      </span>
                    )}
                    {agent.shouldPostNow && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                        Ready to Post
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-purple-300 text-xs mb-1">Total Actions</div>
                    <div className="text-lg font-bold text-white">{agent.stats.totalActions}</div>
                  </div>
                  <div>
                    <div className="text-purple-300 text-xs mb-1">Avg Score</div>
                    <div className={`text-lg font-bold ${getScoreColor(agent.stats.averageScore)}`}>
                      {agent.stats.averageScore.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-purple-300 text-xs mb-1">Success Rate</div>
                    <div className="text-lg font-bold text-white">{agent.stats.successRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-purple-300 text-xs mb-1">Recent Avg</div>
                    <div className={`text-lg font-bold ${getScoreColor(agent.stats.recentAverageScore)}`}>
                      {agent.stats.recentAverageScore.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Last Action */}
                {agent.lastAction && (
                  <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 text-sm">Last Action</span>
                      <span className={`text-sm font-semibold ${getStatusColor(agent.lastAction.status)}`}>
                        {agent.lastAction.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-2">{agent.lastAction.content}</p>
                    <p className="text-gray-400 text-xs">{formatTime(agent.lastAction.timestamp)}</p>
                  </div>
                )}

                {/* Learnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-purple-300 text-xs mb-2">Best Performing Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {agent.learnings.bestPerformingTopics.length > 0 ? (
                        agent.learnings.bestPerformingTopics.slice(0, 5).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No data yet</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-purple-300 text-xs mb-2">Optimal Posting Times</div>
                    <div className="flex flex-wrap gap-2">
                      {agent.learnings.optimalPostingTimes.length > 0 ? (
                        agent.learnings.optimalPostingTimes.map((hour, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                          >
                            {hour}:00
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No data yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Test run & View Details */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => runTest(agent.id)}
                    disabled={runningAgentId !== null}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium"
                  >
                    {runningAgentId === agent.id ? 'Running…' : 'Test run'}
                  </button>
                  <button
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
                  >
                    {selectedAgent === agent.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                {testResult?.agentId === agent.id && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${testResult.success ? 'bg-slate-800/80 text-green-200' : 'bg-red-900/30 text-red-200'}`}>
                    {testResult.success ? (
                      <>
                        <div className="font-medium mb-1">Test run result</div>
                        {testResult.contentPreview ? (
                          <p className="text-slate-300 whitespace-pre-wrap break-words">{testResult.contentPreview}</p>
                        ) : (
                          <p>Action recorded (no content preview). Refresh to see last action.</p>
                        )}
                      </>
                    ) : (
                      <p>Error: {testResult.error}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {status && status.agents.length === 0 && (
          <div className="text-center py-20 text-purple-300">
            <p className="text-xl mb-2">No agents configured</p>
            <p className="text-sm">Agents will appear here once they are registered with the orchestrator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
