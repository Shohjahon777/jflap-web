'use client';

import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Transition } from '@/types/automata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TransitionEdgeData {
  symbol: string;
  symbols: string[];
  label: string;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProfessionalTransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}: EdgeProps<TransitionEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { symbol, symbols, label, onSelect, onEdit } = (data as TransitionEdgeData) || { 
    symbol: '', 
    symbols: [], 
    label: '', 
    onSelect: () => {}, 
    onEdit: () => {} 
  };
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(symbol);

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.detail === 2) { // Double click
      onEdit();
    } else {
      onSelect();
    }
  };

  const handleSave = () => {
    // Update transition symbol
    setIsEditing(false);
    // This would update the transition in the store
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(symbol);
    }
  };

  return (
    <TooltipProvider>
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: selected ? '#3b82f6' : '#6b7280',
            strokeWidth: selected ? 2.5 : 1.5,
            strokeDasharray: selected ? '5,5' : 'none',
            ...(style as React.CSSProperties || {}),
          }}
        />
        <EdgeLabelRenderer>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {isEditing ? (
              <div className="bg-background border border-border rounded-md shadow-lg p-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="h-6 w-16 text-xs"
                  autoFocus
                />
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={`
                      px-2 py-1 text-xs font-medium rounded-md cursor-pointer
                      transition-all duration-200 min-w-[24px] h-6 flex items-center justify-center
                      ${selected 
                        ? 'bg-blue-500 text-white shadow-lg border border-blue-600' 
                        : 'bg-background text-foreground border border-border hover:bg-muted hover:border-blue-300'
                      }
                    `}
                    onClick={handleLabelClick}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label || symbol}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to edit transition symbol</p>
                </TooltipContent>
              </Tooltip>
            )}
          </motion.div>
        </EdgeLabelRenderer>
      </>
    </TooltipProvider>
  );
}
