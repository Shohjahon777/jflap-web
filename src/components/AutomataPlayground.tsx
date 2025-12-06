'use client';

import React, { useCallback, useState } from 'react';
import { ReactFlow, Node, Edge, addEdge, Connection, useNodesState, useEdgesState, Controls, Background, BackgroundVariant, MiniMap, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAutomataStore } from '@/store/automataStore';
import { ProfessionalStateNode } from './ProfessionalStateNode';
import { ProfessionalTransitionEdge } from './ProfessionalTransitionEdge';
import { TransitionEditor } from './TransitionEditor';
import { Card } from '@/components/ui/card';

const nodeTypes = {
  stateNode: ProfessionalStateNode,
};

const edgeTypes: any = {
  transitionEdge: ProfessionalTransitionEdge,
};

export function AutomataPlayground() {
  const {
    currentAutomaton,
    addState,
    addTransition,
    selectState,
    selectTransition,
    updateState,
  } = useAutomataStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingTransition, setEditingTransition] = useState<string | null>(null);

  // Convert automaton states to React Flow nodes
  React.useEffect(() => {
    if (currentAutomaton) {
      const flowNodes: Node[] = currentAutomaton.states.map(state => ({
        id: state.id,
        type: 'stateNode',
        position: { x: state.x, y: state.y },
        data: {
          ...state,
          onSelect: () => selectState(state.id),
          onToggleStart: () => {
            // Toggle start state - only one can be start
            currentAutomaton.states.forEach(s => {
              if (s.id !== state.id && s.isStart) {
                updateState(s.id, { isStart: false });
              }
            });
            updateState(state.id, { isStart: !state.isStart });
          },
          onToggleFinal: () => {
            updateState(state.id, { isFinal: !state.isFinal });
          },
        },
      }));

      const flowEdges: Edge[] = currentAutomaton.transitions.map(transition => ({
        id: transition.id,
        source: transition.from,
        target: transition.to,
        type: 'transitionEdge',
        data: {
          ...transition,
          onSelect: () => selectTransition(transition.id),
          onEdit: () => setEditingTransition(transition.id),
        },
      }));

      setNodes(flowNodes as any);
      setEdges(flowEdges as any);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentAutomaton, selectState, selectTransition, updateState]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Automatically open transition editor for new connections
        const newTransition = {
          id: `transition-${Date.now()}`,
          from: params.source,
          to: params.target,
          symbol: '', // Empty by default
          symbols: [], // Empty by default
          label: 'Click to edit',
          isEpsilon: false,
        };
        addTransition(newTransition);
        // Automatically open editor for new transitions
        setEditingTransition(newTransition.id);
      }
    },
    [addTransition]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    selectState(node.id);
  }, [selectState]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    selectTransition(edge.id);
  }, [selectTransition]);

  const onPaneClick = useCallback(() => {
    selectState(null);
    selectTransition(null);
  }, [selectState, selectTransition]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // Update state position in store
    if (currentAutomaton) {
      updateState(node.id, { x: node.position.x, y: node.position.y });
    }
  }, [currentAutomaton, updateState]);

  if (!currentAutomaton) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Automaton Selected</h3>
          <p className="text-muted-foreground mb-4">
            Create a new automaton or load a demo example from the sidebar
          </p>
          <div className="text-sm text-muted-foreground">
            Choose an automaton type and click "New Automaton" to get started
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          className="bg-background"
        />
        <Controls 
          className="bg-background border border-border"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-background border border-border"
          nodeColor={(node) => {
            if (node.data?.isStart) return '#3b82f6';
            if (node.data?.isFinal) return '#ef4444';
            return '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
      
      {/* Transition Editor Overlay */}
      {editingTransition && (
        <div className="absolute top-4 right-4 z-50">
          <TransitionEditor
            transitionId={editingTransition}
            onClose={() => setEditingTransition(null)}
          />
        </div>
      )}
    </div>
  );
}
