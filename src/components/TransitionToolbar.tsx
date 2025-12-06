'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';

export function TransitionToolbar() {
  const { currentAutomaton, addTransition, removeTransition } = useAutomataStore();
  const [fromState, setFromState] = useState('');
  const [toState, setToState] = useState('');
  const [transitionSymbols, setTransitionSymbols] = useState<string[]>(['']);
  const [newSymbol, setNewSymbol] = useState('');

  if (!currentAutomaton) return null;

  const handleAddSymbol = () => {
    if (newSymbol.trim() && !transitionSymbols.includes(newSymbol.trim())) {
      setTransitionSymbols([...transitionSymbols, newSymbol.trim()]);
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (index: number) => {
    setTransitionSymbols(transitionSymbols.filter((_, i) => i !== index));
  };

  const handleCreateTransition = () => {
    if (!fromState || !toState || transitionSymbols.every(s => !s.trim())) {
      alert('Please select states and add at least one symbol');
      return;
    }

    const validSymbols = transitionSymbols.filter(s => s.trim());
    if (validSymbols.length === 0) {
      alert('Please add at least one valid symbol');
      return;
    }

    const newTransition = {
      id: `transition-${Date.now()}`,
      from: fromState,
      to: toState,
      symbol: validSymbols[0],
      symbols: validSymbols,
      label: validSymbols.join(','),
      isEpsilon: false,
    };

    addTransition(newTransition);
    
    // Reset form
    setFromState('');
    setToState('');
    setTransitionSymbols(['']);
  };

  const handleDeleteTransition = (transitionId: string) => {
    if (confirm('Delete this transition?')) {
      removeTransition(transitionId);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Create Transition</CardTitle>
        <CardDescription>Easily add transitions between states</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* State Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">From State</Label>
            <select
              value={fromState}
              onChange={(e) => setFromState(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
            >
              <option value="">Select state...</option>
              {currentAutomaton.states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name} {state.isStart ? '(start)' : ''} {state.isFinal ? '(final)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">To State</Label>
            <select
              value={toState}
              onChange={(e) => setToState(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
            >
              <option value="">Select state...</option>
              {currentAutomaton.states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name} {state.isStart ? '(start)' : ''} {state.isFinal ? '(final)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transition Symbols */}
        <div className="space-y-2">
          <Label className="text-xs">Transition Symbols</Label>
          <div className="space-y-2">
            {transitionSymbols.map((symbol, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={symbol}
                  onChange={(e) => {
                    const newSymbols = [...transitionSymbols];
                    newSymbols[index] = e.target.value;
                    setTransitionSymbols(newSymbols);
                  }}
                  placeholder="Enter symbol..."
                  className="text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveSymbol(index)}
                  disabled={transitionSymbols.length === 1}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTransitionSymbols([...transitionSymbols, ''])}
              className="w-full text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Symbol
            </Button>
          </div>
        </div>

        {/* Quick Add from Alphabet */}
        <div className="space-y-2">
          <Label className="text-xs">Quick Add from Alphabet</Label>
          <div className="flex flex-wrap gap-1">
            {currentAutomaton.alphabet.map(symbol => (
              <Button
                key={symbol}
                size="sm"
                variant="outline"
                className="text-xs h-6"
                onClick={() => {
                  if (!transitionSymbols.includes(symbol)) {
                    setTransitionSymbols([...transitionSymbols, symbol]);
                  }
                }}
                disabled={transitionSymbols.includes(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Create Button */}
        <Button
          onClick={handleCreateTransition}
          className="w-full"
          size="sm"
          disabled={!fromState || !toState || transitionSymbols.every(s => !s.trim())}
        >
          <ArrowRight className="w-3 h-3 mr-1" />
          Create Transition
        </Button>

        {/* Current Transitions */}
        {currentAutomaton.transitions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Current Transitions</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {currentAutomaton.transitions.map(transition => {
                const fromState = currentAutomaton.states.find(s => s.id === transition.from);
                const toState = currentAutomaton.states.find(s => s.id === transition.to);
                const fromName = fromState?.name || transition.from;
                const toName = toState?.name || transition.to;
                return (
                <div key={transition.id} className="flex items-center justify-between bg-muted p-2 rounded text-xs">
                  <span>
                    {fromName} → {toName}: {transition.label}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTransition(transition.id)}
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
