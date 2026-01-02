import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface TimelineGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (params: Connection) => void;
}

export const TimelineGraph: React.FC<TimelineGraphProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const defaultEdgeOptions = {
    animated: true,
    style: { stroke: 'var(--cosmic-primary)', strokeWidth: 2 },
  };

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-[var(--cosmic-glass-border)] bg-[var(--cosmic-glass)] backdrop-blur-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'input') return 'var(--cosmic-primary)';
            if (n.type === 'output') return 'var(--cosmic-accent)';
            return 'var(--cosmic-secondary)';
          }}
          maskColor="var(--cosmic-glass)"
          style={{ backgroundColor: 'var(--cosmic-glass)' }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="var(--cosmic-primary)" 
          style={{ opacity: 0.1 }}
        />
      </ReactFlow>
    </div>
  );
};

