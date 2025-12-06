'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Download, Upload, Trash2, Settings, Play } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';

export function AutomataToolbar() {
  const {
    currentAutomaton,
    addState,
    resetAutomaton,
    setCurrentAutomaton,
  } = useAutomataStore();

  const [automatonType, setAutomatonType] = useState<'DFA' | 'NFA'>('DFA');

  const handleAddState = () => {
    if (!currentAutomaton) {
      // Create new automaton
      const newAutomaton = {
        id: `automaton-${Date.now()}`,
        name: `${automatonType} Automaton`,
        type: automatonType,
        states: [],
        transitions: [],
        alphabet: ['a', 'b'],
      };
      setCurrentAutomaton(newAutomaton);
    }

    // Add new state
    const newState = {
      id: `state-${Date.now()}`,
      name: `q${currentAutomaton?.states.length || 0}`,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      isStart: currentAutomaton?.states.length === 0, // First state is start state
      isFinal: false,
    };

    addState(newState);
  };

  const handleSave = () => {
    if (!currentAutomaton) return;
    
    const dataStr = JSON.stringify(currentAutomaton, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentAutomaton.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const automaton = JSON.parse(e.target?.result as string);
        setCurrentAutomaton(automaton);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the current automaton?')) {
      resetAutomaton();
    }
  };

  const handleNewAutomaton = () => {
    if (confirm('Create a new automaton? This will clear the current one.')) {
      resetAutomaton();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Automata Playground
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
          <select
            value={automatonType}
            onChange={(e) => setAutomatonType(e.target.value as 'DFA' | 'NFA')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewAutomaton}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md
                   hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddState}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add State</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={!currentAutomaton}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md
                   hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </motion.button>

        <label className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-md
                         hover:bg-purple-600 transition-colors duration-200 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Load</span>
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            className="hidden"
          />
        </label>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          disabled={!currentAutomaton}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md
                   hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </motion.button>
      </div>

      {/* Automaton info */}
      {currentAutomaton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {currentAutomaton.name}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentAutomaton.type}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            States: {currentAutomaton.states.length} | 
            Transitions: {currentAutomaton.transitions.length}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
