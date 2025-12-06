'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Play, Circle } from 'lucide-react';
import { State } from '@/types/automata';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StateNodeData extends State {
  onSelect: () => void;
  onToggleStart: () => void;
  onToggleFinal: () => void;
  height?: number;
  width?: number;
  sourcePosition?: any;
  targetPosition?: any;
  dragHandle?: string;
  parentId?: string;
}

export function ProfessionalStateNode({ data, selected }: NodeProps<StateNodeData>) {
  const { id, name, isStart, isFinal, isActive, onSelect, onToggleStart, onToggleFinal } = data;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Start state indicator */}
        {isStart && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -left-1 z-20"
          >
            <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-background shadow-sm" />
          </motion.div>
        )}

        {/* State circle */}
        <motion.div
          className={`
            w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer
            transition-all duration-200 relative
            ${isActive 
              ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-lg shadow-green-500/25' 
              : isFinal 
                ? 'border-red-500 bg-red-50 dark:bg-red-950' 
                : 'border-border bg-background hover:border-blue-300 dark:hover:border-blue-700'
            }
            ${selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' : ''}
            ${isActive ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}
          `}
          onClick={onSelect}
          whileHover={{ 
            boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)' 
          }}
          animate={{
            scale: isActive ? 1.1 : 1,
            boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none'
          }}
        >
          {/* State name */}
          <span className="text-sm font-medium text-foreground select-none">
            {name}
          </span>

          {/* Final state indicator - inner circle */}
          {isFinal && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-2 rounded-full border-2 border-red-500"
            />
          )}
        </motion.div>

        {/* Action buttons - only show on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 bg-background border-border hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStart();
                }}
              >
                <Play className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isStart ? 'Remove start state' : 'Set as start state'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 bg-background border-border hover:bg-red-50 dark:hover:bg-red-950"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFinal();
                }}
              >
                <Circle className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFinal ? 'Remove final state' : 'Set as final state'}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-blue-500 border-2 border-background hover:bg-blue-600 transition-colors"
          style={{ top: -4 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-blue-500 border-2 border-background hover:bg-blue-600 transition-colors"
          style={{ bottom: -4 }}
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-2 bg-blue-500 border-2 border-background hover:bg-blue-600 transition-colors"
          style={{ left: -4 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-2 h-2 bg-blue-500 border-2 border-background hover:bg-blue-600 transition-colors"
          style={{ right: -4 }}
        />
      </motion.div>
    </TooltipProvider>
  );
}
