import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';
import { TimelineGraph } from '../components/TimelineGraph';
import { TimelineChat } from '../components/TimelineChat';
import { Sparkles, Save, Download, HelpCircle } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Current Reality' },
    position: { x: 250, y: 0 },
    style: { 
      background: 'var(--cosmic-glass)', 
      color: 'white', 
      border: '2px solid var(--cosmic-primary)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '14px',
      fontWeight: '600'
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
      data: { label: message.length > 20 ? message.substring(0, 20) + '...' : message },
      position: { x: Math.random() * 500, y: (nodes.length * 100) + 50 },
      style: { 
        background: 'var(--cosmic-glass)', 
        color: 'white', 
        border: '1px solid var(--cosmic-accent)',
        borderRadius: '8px',
        padding: '8px',
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
        style: { stroke: 'var(--cosmic-accent)', strokeWidth: 2 },
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
      className="w-full max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-[var(--cosmic-accent)]" />
            Cosmic Timeline
          </h1>
          <p className="text-white/60 text-sm">Visualize and manifest your future paths</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 transition-all">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--cosmic-primary)] hover:opacity-90 rounded-xl text-white font-medium transition-all shadow-[0_0_15px_rgba(var(--cosmic-primary),0.3)]">
            <Save size={18} />
            <span className="hidden sm:inline">Save Timeline</span>
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Graph Area */}
        <div className="lg:col-span-3 relative h-full">
          <TimelineGraph 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onConnect={onConnect} 
          />
          
          {/* Legend/Info Overlay */}
          <div className="absolute bottom-4 left-4 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-white/70 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-[var(--cosmic-primary)]" />
              <span>Current Reality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-[var(--cosmic-accent)]" />
              <span>Possible Path</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-1 h-full min-h-[400px]">
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
