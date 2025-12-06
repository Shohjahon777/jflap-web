'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Play, Circle } from 'lucide-react';
import { State } from '@/types/automata';

interface StateNodeData extends State {
  onSelect: () => void;
  onToggleStart: () => void;
  onToggleFinal: () => void;
}

export function StateNode({ data, selected }: NodeProps<StateNodeData>) {
  const { id, name, isStart, isFinal, isActive, onSelect, onToggleStart, onToggleFinal } = data;

  return (
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
          className="absolute -top-2 -left-2 z-10"
        >
          <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
      )}

      {/* State circle */}
      <motion.div
        className={`
          w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer
          transition-all duration-200
          ${isActive 
            ? 'border-green-500 bg-green-100 dark:bg-green-900' 
            : isFinal 
              ? 'border-red-500 bg-red-100 dark:bg-red-900' 
              : 'border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600'
          }
          ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
        onClick={onSelect}
        whileHover={{ 
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' 
        }}
        animate={{
          scale: isActive ? 1.1 : 1,
          boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.8)' : 'none'
        }}
      >
        {/* State name */}
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {name}
        </span>

        {/* Final state indicator */}
        {isFinal && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-2 rounded-full border-2 border-red-500"
          />
        )}
      </motion.div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
    </motion.div>
  );
}
