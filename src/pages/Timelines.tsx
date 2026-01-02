import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node, ReactFlowProvider } from '@xyflow/react';
import { TimelineGraph } from '../components/TimelineGraph';
import { TimelineChat } from '../components/TimelineChat';
import { Sparkles, Save, Download, RotateCcw } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Current Reality' },
    position: { x: 250, y: 0 },
    style: { 
      background: 'var(--cosmic-glass)', 
      color: 'white', 
      border: '1px solid var(--cosmic-primary)',
      borderRadius: '16px',
      padding: '12px 20px',
      fontSize: '13px',
      fontWeight: '500',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      boxShadow: '0 0 20px rgba(var(--cosmic-primary), 0.1)',
    },
  },
];

const initialEdges: Edge[] = [];

const Timelines: React.FC = () => {
  return (
    <ReactFlowProvider>
      <TimelinesContent />
    </ReactFlowProvider>
  );
};

const TimelinesContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [activePaths, setActivePaths] = useState<Set<string>>(new Set(['steady', 'warp', 'quantum']));

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to generate timeline');
      }

      const data = await response.json();
      console.log('Hybrid Timeline data received:', data);

      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid timeline data: nodes missing or not an array');
      }
      
      const pathColors = {
        steady: 'var(--cosmic-primary)',
        warp: 'var(--cosmic-accent)',
        quantum: '#f472b6', // pink-400
      };

      // Transform API data into React Flow nodes and edges
      const newNodes: Node[] = data.nodes.map((n: any, i: number) => {
        const pathId = n.pathId || 'steady';
        const color = pathColors[pathId as keyof typeof pathColors] || 'var(--cosmic-primary)';
        
        // Position paths in 3 distinct horizontal zones
        let xPos = 250;
        if (pathId === 'steady') xPos = -100;
        if (pathId === 'warp') xPos = 250;
        if (pathId === 'quantum') xPos = 600;

        // Vertical spacing based on node index within its path
        const nodesInPath = data.nodes.filter((node: any) => node.pathId === pathId);
        const indexInPath = nodesInPath.indexOf(n);

        return {
          id: n.id,
          data: { label: n.label, pathId },
          position: { 
            x: xPos + (Math.random() * 20 - 10), 
            y: (indexInPath * 150) + 200 
          },
          style: { 
            background: 'var(--cosmic-glass)', 
            color: 'white', 
            border: `1px solid ${color}`,
            borderRadius: '16px',
            padding: '12px 20px',
            fontSize: '13px',
            width: 180,
            textAlign: 'center' as const,
            boxShadow: `0 0 20px ${color}22`,
          },
        };
      });

      const newEdges: Edge[] = (data.edges || []).map((e: any) => {
        const sourceNode = data.nodes.find((n: any) => n.id === e.source);
        const pathId = sourceNode?.pathId || 'steady';
        const color = pathColors[pathId as keyof typeof pathColors] || 'var(--cosmic-primary)';

        return {
          id: `edge-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: true,
          style: { stroke: color, strokeWidth: 1.5, opacity: 0.6 },
          labelStyle: { fill: 'white', fontSize: 10, fontWeight: 300 },
        };
      });

      // Combine with initial node and connect all 3 path starts to origin
      const finalNodes = [...initialNodes, ...newNodes];
      let finalEdges = [...edges, ...newEdges];

      // Connect start of each path to origin
      ['steady', 'warp', 'quantum'].forEach(pId => {
        const firstInPath = data.nodes.find((n: any) => n.pathId === pId);
        if (firstInPath) {
          finalEdges.push({
            id: `edge-start-${firstInPath.id}`,
            source: 'start',
            target: firstInPath.id,
            animated: true,
            style: { stroke: 'var(--cosmic-text-muted)', strokeWidth: 1, opacity: 0.4 },
          });
        }
      });

      setNodes(finalNodes);
      setEdges(finalEdges);
    } catch (error: any) {
      console.error('Error generating timeline:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const togglePath = (pathId: string) => {
    setActivePaths(prev => {
      const next = new Set(prev);
      if (next.has(pathId)) {
        if (next.size > 1) next.delete(pathId);
      } else {
        next.add(pathId);
      }
      return next;
    });
  };

  // Filter nodes and edges based on active paths
  const filteredNodes = nodes.filter(n => n.id === 'start' || activePaths.has((n.data as any).pathId));
  const filteredEdges = edges.filter(e => {
    const targetNode = nodes.find(n => n.id === e.target);
    return e.source === 'start' || (targetNode && activePaths.has((targetNode.data as any).pathId));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto h-[calc(100vh-220px)] flex flex-col px-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight">
            Timeline <span className="font-medium italic text-[var(--cosmic-accent)]">Architect</span>
          </h1>
          <div className="flex gap-3 mb-4">
            {[
              { id: 'steady', label: 'Steady Orbit', color: 'var(--cosmic-primary)' },
              { id: 'warp', label: 'Warp Drive', color: 'var(--cosmic-accent)' },
              { id: 'quantum', label: 'Quantum Leap', color: '#f472b6' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => togglePath(p.id)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  activePaths.has(p.id) 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                }`}
                style={activePaths.has(p.id) ? { boxShadow: `0 0 15px ${p.color}44` } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[var(--cosmic-text-muted)] text-lg font-light">Map the unfolding of your destiny across the stars.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all"
            title="Reset Timeline"
          >
            <RotateCcw size={20} />
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/80 font-medium transition-all">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-3 px-8 py-3 bg-[var(--cosmic-primary)] hover:opacity-90 rounded-2xl text-white font-bold transition-all shadow-xl shadow-[var(--cosmic-primary)]/10">
            <Save size={18} />
            <span>Save Blueprint</span>
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Graph Area */}
        <div className="lg:col-span-8 relative h-full">
          <TimelineGraph 
            nodes={filteredNodes} 
            edges={filteredEdges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onConnect={onConnect} 
          />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] text-white/50 space-y-3 pointer-events-none uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full border border-[var(--cosmic-primary)] bg-[var(--cosmic-primary)]/20 shadow-[0_0_10px_var(--cosmic-primary)]" />
              <span>Origin Point</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full border border-[var(--cosmic-accent)] bg-[var(--cosmic-accent)]/20 shadow-[0_0_10px_var(--cosmic-accent)]" />
              <span>Projected Node</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-4 h-full min-h-[400px]">
          <TimelineChat 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            onReset={handleReset} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Timelines;
