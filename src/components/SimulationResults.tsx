'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Play, Square, SkipForward, RotateCcw, List, FileText } from 'lucide-react';
import { useAutomataStore } from '@/store/automataStore';
import { simulateAutomaton } from '@/lib/simulation';

interface TestCaseResult {
  input: string;
  result: any;
}

export function SimulationResults() {
  const { currentAutomaton, simulationResult, simulationControls, updateSimulationControls } = useAutomataStore();
  const [input, setInput] = React.useState('');
  const [batchInput, setBatchInput] = React.useState('');
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [result, setResult] = React.useState<any>(null);
  const [batchResults, setBatchResults] = React.useState<TestCaseResult[]>([]);
  const [testMode, setTestMode] = React.useState<'single' | 'batch'>('single');

  const handleSimulate = () => {
    if (!currentAutomaton) {
      alert('Please create or load an automaton first');
      return;
    }

    // Allow empty string (epsilon) as valid input
    const simulationResult = simulateAutomaton(currentAutomaton, input);
    setResult(simulationResult);
    setCurrentStepIndex(0);
  };

  const handleBatchTest = () => {
    if (!currentAutomaton) {
      alert('Please create or load an automaton first');
      return;
    }

    // Parse test cases - one per line, trim whitespace, filter empty lines
    const testCases = batchInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 || line === ''); // Include empty string as valid test case

    if (testCases.length === 0) {
      alert('Please enter at least one test case (one per line)');
      return;
    }

    // Run simulation for each test case
    const results: TestCaseResult[] = testCases.map(testInput => ({
      input: testInput === '' ? 'ε' : testInput, // Display empty string as epsilon
      result: simulateAutomaton(currentAutomaton, testInput),
    }));

    setBatchResults(results);
  };

  const handleStepForward = () => {
    if (result && currentStepIndex < result.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setResult(null);
  };

  const currentStep = result?.steps[currentStepIndex];
  const isAccepted = result?.isAccepted;
  const isRejected = currentStep?.isRejected;

  if (!currentAutomaton) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Test Your Automaton</CardTitle>
        <CardDescription>Test single string or multiple test cases at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={testMode === 'single' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => {
              setTestMode('single');
              setBatchResults([]);
            }}
          >
            <FileText className="w-4 h-4 mr-1" />
            Single Test
          </Button>
          <Button
            variant={testMode === 'batch' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => {
              setTestMode('batch');
              setResult(null);
            }}
          >
            <List className="w-4 h-4 mr-1" />
            Batch Test
          </Button>
        </div>

        {/* Single Test Mode */}
        {testMode === 'single' && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Input String</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter string to test..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSimulate();
                  }
                }}
              />
              <Button onClick={handleSimulate} size="sm" disabled={!currentAutomaton}>
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Batch Test Mode */}
        {testMode === 'batch' && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Test Cases (one per line)</label>
            <textarea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Enter test cases, one per line:&#10;a&#10;ab&#10;aba&#10;ε"
              rows={6}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono resize-y"
            />
            <Button onClick={handleBatchTest} size="sm" className="w-full" disabled={!currentAutomaton || !batchInput.trim()}>
              <Play className="w-4 h-4 mr-2" />
              Test All Cases
            </Button>
          </div>
        )}

        {/* Helpful Hint */}
        {!result && currentAutomaton && currentAutomaton.transitions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-blue-800 dark:text-blue-200 text-xs">
            💡 <strong>Tip:</strong> Make sure all transitions have symbols assigned. Click on transition labels to edit them.
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="space-y-3">
            {/* Overall Result */}
            <div className={`
              p-3 rounded-lg text-center font-semibold
              ${isAccepted 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : isRejected 
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }
            `}>
              {isAccepted ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>✅ ACCEPTED</span>
                </div>
              ) : isRejected ? (
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>❌ REJECTED</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>⏳ PROCESSING</span>
                </div>
              )}
            </div>

            {/* Step-by-Step Controls */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStepForward}
                disabled={currentStepIndex >= result.steps.length - 1}
                className="flex-1"
              >
                Forward →
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Current Step Info */}
            {currentStep && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Step {currentStep.step}</span>
                  <span className="text-xs text-muted-foreground">
                    {currentStepIndex + 1} / {result.steps.length}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Current State:</span> 
                    <Badge variant="secondary" className="ml-2">
                      {currentStep.currentState}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Remaining Input:</span> 
                    <Badge variant="outline" className="ml-2 font-mono">
                      {currentStep.remainingInput || 'ε'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {result.error && (
              <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg text-red-800 dark:text-red-200 text-sm">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        )}

        {/* Batch Test Results */}
        {testMode === 'batch' && batchResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Test Results ({batchResults.length} cases)</label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBatchResults([])}
                className="text-xs h-6"
              >
                Clear
              </Button>
            </div>
            <div className="border border-border rounded-md overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Input</th>
                      <th className="text-center p-2 font-medium">Result</th>
                      <th className="text-left p-2 font-medium">Final State</th>
                      <th className="text-left p-2 font-medium">Steps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((testCase, index) => (
                      <tr
                        key={index}
                        className={`border-t border-border ${
                          testCase.result.isAccepted
                            ? 'bg-green-50/50 dark:bg-green-950/20'
                            : testCase.result.error
                            ? 'bg-yellow-50/50 dark:bg-yellow-950/20'
                            : 'bg-red-50/50 dark:bg-red-950/20'
                        }`}
                      >
                        <td className="p-2 font-mono">{testCase.input}</td>
                        <td className="p-2 text-center">
                          {testCase.result.error ? (
                            <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
                              Error
                            </Badge>
                          ) : testCase.result.isAccepted ? (
                            <Badge variant="default" className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 font-mono text-xs">
                          {testCase.result.finalState || '-'}
                        </td>
                        <td className="p-2 text-xs text-muted-foreground">
                          {testCase.result.steps?.length || 0} steps
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Summary */}
            <div className="flex gap-2 text-xs">
              <div className="flex-1 bg-muted p-2 rounded">
                <div className="font-medium">Summary</div>
                <div className="text-muted-foreground">
                  Accepted: <span className="text-green-600 dark:text-green-400 font-semibold">
                    {batchResults.filter(r => r.result.isAccepted).length}
                  </span> | 
                  Rejected: <span className="text-red-600 dark:text-red-400 font-semibold">
                    {batchResults.filter(r => !r.result.isAccepted && !r.result.error).length}
                  </span>
                  {batchResults.some(r => r.result.error) && (
                    <> | Errors: <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                      {batchResults.filter(r => r.result.error).length}
                    </span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Test Examples */}
        {currentAutomaton && testMode === 'single' && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Quick Test</label>
            <div className="flex flex-wrap gap-1">
              {currentAutomaton.alphabet.map(symbol => (
                <Button
                  key={symbol}
                  size="sm"
                  variant="outline"
                  className="text-xs h-6"
                  onClick={() => setInput(symbol)}
                >
                  {symbol}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6"
                onClick={() => setInput('')}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

