'use client';

import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Transition } from '@/types/automata';

interface TransitionEdgeData extends Transition {
  onSelect: () => void;
}

export function TransitionEdge({
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

  const { symbol, label, onSelect } = data;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? '#3b82f6' : '#6b7280',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <motion.button
            className={`
              px-2 py-1 text-xs font-medium rounded-md cursor-pointer
              transition-all duration-200
              ${selected 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }
            `}
            onClick={onSelect}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            {label || symbol}
          </motion.button>
        </motion.div>
      </EdgeLabelRenderer>
    </>
  );
}
