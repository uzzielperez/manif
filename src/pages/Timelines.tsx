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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log('Timeline data received:', data);

      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid timeline data: nodes missing or not an array');
      }
      
      // Transform API data into React Flow nodes and edges
      const newNodes: Node[] = data.nodes.map((n: any, i: number) => {
        // Calculate a more dynamic position
        const row = Math.floor(i / 2);
        const col = i % 2;
        const xOffset = col === 0 ? -150 : 150;
        
        return {
          id: n.id,
          data: { label: n.label },
          position: { 
            x: 250 + (data.nodes.length > 1 ? xOffset : 0), 
            y: (row * 180) + 200 
          },
          style: { 
            background: 'var(--cosmic-glass)', 
            color: 'white', 
            border: `1px solid ${n.type === 'crossroad' ? 'var(--cosmic-accent)' : 'var(--cosmic-primary)'}`,
            borderRadius: '16px',
            padding: '12px 20px',
            fontSize: '13px',
            width: 200,
            textAlign: 'center' as const,
            boxShadow: `0 0 20px rgba(var(--cosmic-${n.type === 'crossroad' ? 'accent' : 'primary'}), 0.1)`,
          },
        };
      });

      const newEdges: Edge[] = (data.edges || []).map((e: any) => ({
        id: `edge-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: 'var(--cosmic-accent)', strokeWidth: 1.5, opacity: 0.6 },
        labelStyle: { fill: 'white', fontSize: 10, fontWeight: 300 },
      }));

      // Combine with initial node if it's the first generation
      const finalNodes = nodes.length <= 1 ? [...initialNodes, ...newNodes] : [...nodes, ...newNodes];
      
      // If first generation, connect initial node to the first new node
      let finalEdges = [...edges, ...newEdges];
      if (nodes.length <= 1 && newNodes.length > 0) {
        const startToFirstEdge: Edge = {
          id: `edge-start-${newNodes[0].id}`,
          source: 'start',
          target: newNodes[0].id,
          animated: true,
          style: { stroke: 'var(--cosmic-primary)', strokeWidth: 1.5, opacity: 0.8 },
        };
        finalEdges = [startToFirstEdge, ...finalEdges];
      }

      setNodes(finalNodes);
      setEdges(finalEdges);
    } catch (error) {
      console.error('Error generating timeline:', error);
      throw error; // Re-throw to show error in chat
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

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
          <ReactFlowProvider>
            <TimelineGraph 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange} 
              onEdgesChange={onEdgesChange} 
              onConnect={onConnect} 
            />
          </ReactFlowProvider>
          
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
