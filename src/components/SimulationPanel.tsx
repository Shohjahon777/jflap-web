'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';
import { simulateAutomaton } from '@/lib/simulation';

export function SimulationPanel() {
  const {
    currentAutomaton,
    simulationResult,
    simulationControls,
    startSimulation,
    stopSimulation,
    setSimulationResult,
    updateSimulationControls,
  } = useAutomataStore();

  const [input, setInput] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleSimulate = () => {
    if (!currentAutomaton || !input.trim()) return;
    
    const result = simulateAutomaton(currentAutomaton, input);
    setSimulationResult(result);
    setCurrentStepIndex(0);
    startSimulation(input);
  };

  const handlePlay = () => {
    updateSimulationControls({ isPlaying: true, isPaused: false });
  };

  const handlePause = () => {
    updateSimulationControls({ isPlaying: false, isPaused: true });
  };

  const handleStop = () => {
    stopSimulation();
    setCurrentStepIndex(0);
  };

  const handleStepForward = () => {
    if (simulationResult && currentStepIndex < simulationResult.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    updateSimulationControls({ isPlaying: false, isPaused: false });
  };

  // Auto-play simulation steps
  useEffect(() => {
    if (simulationControls.isPlaying && simulationResult) {
      const timer = setTimeout(() => {
        if (currentStepIndex < simulationResult.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          updateSimulationControls({ isPlaying: false, isPaused: false });
        }
      }, simulationControls.speed);

      return () => clearTimeout(timer);
    }
  }, [simulationControls.isPlaying, currentStepIndex, simulationResult, simulationControls.speed, updateSimulationControls]);

  const currentStep = simulationResult?.steps[currentStepIndex];
  const isAccepted = simulationResult?.isAccepted;
  const isRejected = currentStep?.isRejected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Simulation
      </h3>

      {/* Input field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Input String
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter string to simulate..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Control buttons */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSimulate}
          disabled={!currentAutomaton || !input.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md
                   hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          <Play className="w-4 h-4" />
          <span>Simulate</span>
        </motion.button>

        {simulationResult && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulationControls.isPlaying ? handlePause : handlePlay}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md
                       hover:bg-green-600 transition-colors duration-200"
            >
              {simulationControls.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{simulationControls.isPlaying ? 'Pause' : 'Play'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStepForward}
              disabled={currentStepIndex >= simulationResult.steps.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md
                       hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md
                       hover:bg-red-600 transition-colors duration-200"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md
                       hover:bg-gray-600 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Simulation result */}
      <AnimatePresence>
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Result status */}
            <div className={`
              p-4 rounded-lg text-center font-semibold
              ${isAccepted 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : isRejected 
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }
            `}>
              {isAccepted ? '✅ ACCEPTED' : isRejected ? '❌ REJECTED' : '⏳ PROCESSING'}
            </div>

            {/* Current step info */}
            {currentStep && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Step {currentStep.step}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentStepIndex + 1} / {simulationResult.steps.length}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">Current State:</span> {currentStep.currentState}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Remaining Input:</span> 
                    <span className="ml-2 font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {currentStep.remainingInput || 'ε'}
                    </span>
                  </div>
                  {currentStep.stack && (
                    <div className="text-sm">
                      <span className="font-medium">Stack:</span> 
                      <span className="ml-2 font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        [{currentStep.stack.join(', ')}]
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
