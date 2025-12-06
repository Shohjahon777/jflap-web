'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Edit2, Check, X as XIcon } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';

export function AlphabetManager() {
  const { currentAutomaton, setCurrentAutomaton } = useAutomataStore();
  const [newSymbol, setNewSymbol] = useState('');
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!currentAutomaton) return null;

  const handleAddSymbol = () => {
    if (!newSymbol.trim() || currentAutomaton.alphabet.includes(newSymbol.trim())) return;
    
    const updatedAutomaton = {
      ...currentAutomaton,
      alphabet: [...currentAutomaton.alphabet, newSymbol.trim()],
      customAlphabet: true,
    };
    setCurrentAutomaton(updatedAutomaton);
    setNewSymbol('');
  };

  const handleRemoveSymbol = (symbol: string) => {
    // Check if symbol is used in transitions
    const isUsed = currentAutomaton.transitions.some(t => 
      t.symbols.includes(symbol) || t.symbol === symbol
    );
    
    if (isUsed) {
      alert(`Cannot remove symbol "${symbol}" - it's used in transitions`);
      return;
    }

    const updatedAutomaton = {
      ...currentAutomaton,
      alphabet: currentAutomaton.alphabet.filter(s => s !== symbol),
    };
    setCurrentAutomaton(updatedAutomaton);
  };

  const handleEditSymbol = (oldSymbol: string) => {
    setEditingSymbol(oldSymbol);
    setEditValue(oldSymbol);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editValue === editingSymbol) {
      setEditingSymbol(null);
      return;
    }

    // Check if new symbol already exists
    if (currentAutomaton.alphabet.includes(editValue.trim()) && editValue.trim() !== editingSymbol) {
      alert(`Symbol "${editValue.trim()}" already exists`);
      return;
    }

    // Update transitions that use this symbol
    const updatedTransitions = currentAutomaton.transitions.map(transition => {
      if (transition.symbols.includes(editingSymbol!)) {
        return {
          ...transition,
          symbols: transition.symbols.map(s => s === editingSymbol ? editValue.trim() : s),
          symbol: transition.symbol === editingSymbol ? editValue.trim() : transition.symbol,
          label: transition.symbols.map(s => s === editingSymbol ? editValue.trim() : s).join(',')
        };
      }
      return transition;
    });

    const updatedAutomaton = {
      ...currentAutomaton,
      alphabet: currentAutomaton.alphabet.map(s => s === editingSymbol ? editValue.trim() : s),
      transitions: updatedTransitions,
    };
    setCurrentAutomaton(updatedAutomaton);
    setEditingSymbol(null);
  };

  const handleCancelEdit = () => {
    setEditingSymbol(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getDefaultAlphabet = () => {
    return ['a', 'b'];
  };

  const resetToDefault = () => {
    const updatedAutomaton = {
      ...currentAutomaton,
      alphabet: getDefaultAlphabet(),
      customAlphabet: false,
    };
    setCurrentAutomaton(updatedAutomaton);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Alphabet</CardTitle>
        <CardDescription>
          Define the input alphabet for your automaton
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Alphabet */}
        <div className="space-y-2">
          <Label className="text-xs">Current Alphabet</Label>
          <div className="flex flex-wrap gap-1">
            {currentAutomaton.alphabet.map((symbol, index) => (
              <div key={index} className="flex items-center gap-1">
                {editingSymbol === symbol ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-6 w-16 text-xs"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSaveEdit}>
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {symbol}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleEditSymbol(symbol)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSymbol(symbol)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
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

        {/* Reset to Default */}
        {currentAutomaton.customAlphabet && (
          <>
            <Separator />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={resetToDefault}
            >
              Reset to Default Alphabet
            </Button>
          </>
        )}

        {/* Special Symbols for NFA */}
        {currentAutomaton.type === 'NFA' && (
          <div className="space-y-2">
            <Label className="text-xs">Special Symbols</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  if (!currentAutomaton.alphabet.includes('ε')) {
                    setNewSymbol('ε');
                    handleAddSymbol();
                  }
                }}
                disabled={currentAutomaton.alphabet.includes('ε')}
              >
                Add ε (Epsilon)
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  if (!currentAutomaton.alphabet.includes('λ')) {
                    setNewSymbol('λ');
                    handleAddSymbol();
                  }
                }}
                disabled={currentAutomaton.alphabet.includes('λ')}
              >
                Add λ (Lambda)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
