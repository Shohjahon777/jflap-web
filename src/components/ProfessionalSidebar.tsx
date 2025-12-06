'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Play, Square, SkipForward, RotateCcw, Plus, Save, Download, Upload, Trash2 } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';
import { demoAutomata } from '@/lib/demoAutomata';
import { AlphabetManager } from './AlphabetManager';
import { TransitionToolbar } from './TransitionToolbar';
import { SimulationResults } from './SimulationResults';
import { simulateAutomaton } from '@/lib/simulation';

export function ProfessionalSidebar() {
  const {
    currentAutomaton,
    addState,
    resetAutomaton,
    setCurrentAutomaton,
    startSimulation,
    stopSimulation,
    simulationControls,
    updateSimulationControls,
    setSimulationResult,
  } = useAutomataStore();

  const [input, setInput] = React.useState('');
  const [automatonType, setAutomatonType] = React.useState<'DFA' | 'NFA'>('DFA');

  const handleNewAutomaton = () => {
    const newAutomaton = {
      id: `automaton-${Date.now()}`,
      name: `${automatonType} Automaton`,
      type: automatonType,
      states: [],
      transitions: [],
      alphabet: ['a', 'b'],
    };
    setCurrentAutomaton(newAutomaton);
  };

  const handleLoadDemo = (demoKey: keyof typeof demoAutomata) => {
    setCurrentAutomaton(demoAutomata[demoKey]);
  };

  const handleAddState = () => {
    if (!currentAutomaton) return;
    
    // Use proper state name as ID (q0, q1, q2, etc.)
    const stateName = `q${currentAutomaton.states.length}`;
    const newState = {
      id: stateName,
      name: stateName,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      isStart: currentAutomaton.states.length === 0,
      isFinal: false,
    };
    addState(newState);
  };

  const handleSimulate = () => {
    if (!currentAutomaton) {
      alert('Please create or load an automaton first');
      return;
    }
    // Allow empty string (epsilon) as valid input
    const result = simulateAutomaton(currentAutomaton, input);
    setSimulationResult(result);
    startSimulation(input);
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

  return (
    <div className="w-96 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Automaton Builder</h2>
          <p className="text-sm text-muted-foreground">
            Create and simulate finite automata
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Automaton Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Automaton Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={automatonType} onValueChange={(value: 'DFA' | 'NFA') => setAutomatonType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select automaton type" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="DFA">Deterministic Finite Automaton</SelectItem>
                  <SelectItem value="NFA">Non-Deterministic Finite Automaton</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleNewAutomaton} className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Automaton
              </Button>
            </CardContent>
          </Card>

          {/* Alphabet Management */}
          {currentAutomaton && <AlphabetManager />}

          {/* Transition Toolbar */}
          {currentAutomaton && <TransitionToolbar />}

          {/* Demo Automata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demo Examples</CardTitle>
              <CardDescription>Load pre-built automata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => handleLoadDemo('divisibleBy3DFA')}
              >
                Divisible by 3 DFA
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => handleLoadDemo('endsWithAbNFA')}
              >
                Ends with "ab" NFA
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => handleLoadDemo('evenAsDFA')}
              >
                Even number of a's DFA
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => handleLoadDemo('startsAndEndsWithA')}
              >
                Starts and Ends with "a" DFA
              </Button>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleAddState} className="w-full" size="sm" disabled={!currentAutomaton}>
                <Plus className="w-4 h-4 mr-2" />
                Add State
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleSave} disabled={!currentAutomaton}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-1" />
                      Load
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLoad}
                    className="hidden"
                  />
                </label>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => resetAutomaton()}
                disabled={!currentAutomaton}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Simulation Results */}
          {currentAutomaton && <SimulationResults />}

          {/* Current Automaton Info */}
          {currentAutomaton && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Current Automaton</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">{currentAutomaton.name}</span>
                  <span className="text-muted-foreground ml-2">({currentAutomaton.type})</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  States: {currentAutomaton.states.length} | 
                  Transitions: {currentAutomaton.transitions.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Alphabet: {currentAutomaton.alphabet.join(', ')}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
