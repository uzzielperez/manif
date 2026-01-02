import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';
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
    
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock logic to add nodes based on message
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: message.length > 25 ? message.substring(0, 25) + '...' : message },
      position: { x: Math.random() * 500, y: (nodes.length * 120) + 50 },
      style: { 
        background: 'var(--cosmic-glass)', 
        color: 'white', 
        border: '1px solid var(--cosmic-accent)',
        borderRadius: '16px',
        padding: '12px 20px',
        fontSize: '13px',
        fontWeight: '400',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    
    // Auto-connect to the last node
    if (nodes.length > 0) {
      const lastNodeId = nodes[nodes.length - 1].id;
      const newEdge: Edge = {
        id: `edge-${lastNodeId}-${newNodeId}`,
        source: lastNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: 'var(--cosmic-accent)', strokeWidth: 1.5, opacity: 0.6 },
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    setIsLoading(false);
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
          <TimelineGraph 
            nodes={nodes} 
            edges={edges} 
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
