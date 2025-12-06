'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Check, AlertTriangle } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';

interface TransitionEditorProps {
  transitionId: string | null;
  onClose: () => void;
}

export function TransitionEditor({ transitionId, onClose }: TransitionEditorProps) {
  const { currentAutomaton, updateTransition } = useAutomataStore();
  const [newSymbol, setNewSymbol] = useState('');
  const [isEpsilon, setIsEpsilon] = useState(false);

  if (!currentAutomaton || !transitionId) return null;

  const transition = currentAutomaton.transitions.find(t => t.id === transitionId);
  if (!transition) return null;

  const [symbols, setSymbols] = useState<string[]>(transition.symbols || [transition.symbol]);
  const [isEpsilonTransition, setIsEpsilonTransition] = useState(transition.isEpsilon || false);

  const handleAddSymbol = () => {
    if (!newSymbol.trim() || symbols.includes(newSymbol.trim())) return;
    
    const updatedSymbols = [...symbols, newSymbol.trim()];
    setSymbols(updatedSymbols);
    setNewSymbol('');
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSymbols(symbols.filter(s => s !== symbol));
  };

  const handleSave = () => {
    const updatedTransition = {
      ...transition,
      symbols: isEpsilonTransition ? ['ε'] : symbols,
      symbol: isEpsilonTransition ? 'ε' : symbols[0] || '',
      label: isEpsilonTransition ? 'ε' : symbols.join(','),
      isEpsilon: isEpsilonTransition,
    };

    updateTransition(transitionId, updatedTransition);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Check for determinism violations (DFA only)
  const checkDeterminismViolation = () => {
    if (currentAutomaton.type !== 'DFA') return false;
    
    const sameFromTransitions = currentAutomaton.transitions.filter(t => 
      t.from === transition.from && t.id !== transitionId
    );
    
    return symbols.some(symbol => 
      sameFromTransitions.some(t => 
        t.symbols.includes(symbol) || t.symbol === symbol
      )
    );
  };

  const hasViolation = checkDeterminismViolation();

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Edit Transition</CardTitle>
        <CardDescription>
          From {currentAutomaton.states.find(s => s.id === transition.from)?.name || transition.from} to {currentAutomaton.states.find(s => s.id === transition.to)?.name || transition.to}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Epsilon Transition (NFA only) */}
        {currentAutomaton.type === 'NFA' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="epsilon"
              checked={isEpsilonTransition}
              onCheckedChange={(checked) => setIsEpsilonTransition(checked === true)}
            />
            <Label htmlFor="epsilon" className="text-sm">
              Epsilon transition (ε)
            </Label>
          </div>
        )}

        {!isEpsilonTransition && (
          <>
            {/* Current Symbols */}
            <div className="space-y-2">
              <Label className="text-xs">Transition Symbols</Label>
              <div className="flex flex-wrap gap-1">
                {symbols.map((symbol, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {symbol}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSymbol(symbol)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Add New Symbol */}
            <div className="space-y-2">
              <Label className="text-xs">Add Symbol</Label>
              <div className="flex gap-2">
                <Input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="Enter symbol..."
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSymbol();
                    }
                  }}
                />
                <Button size="sm" onClick={handleAddSymbol} disabled={!newSymbol.trim()}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Quick Add from Alphabet */}
            <div className="space-y-2">
              <Label className="text-xs">Quick Add</Label>
              <div className="flex flex-wrap gap-1">
                {currentAutomaton.alphabet
                  .filter(symbol => !symbols.includes(symbol))
                  .map(symbol => (
                    <Button
                      key={symbol}
                      size="sm"
                      variant="outline"
                      className="text-xs h-6"
                      onClick={() => {
                        setSymbols([...symbols, symbol]);
                      }}
                    >
                      {symbol}
                    </Button>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Determinism Warning */}
        {hasViolation && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-md">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-800 dark:text-yellow-200">
              Warning: This creates non-deterministic transitions
            </span>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="flex-1">
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
