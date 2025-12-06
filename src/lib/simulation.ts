import { DFA, NFA, Automaton, SimulationResult, SimulationStep, Transition } from '@/types/automata';

// Helper: Compute epsilon closure for NFA
function epsilonClosure(nfa: NFA, states: Set<string>): Set<string> {
  const closure = new Set<string>(states);
  let changed = true;
  
  while (changed) {
    changed = false;
    const newStates = new Set<string>(closure);
    
    for (const state of closure) {
      // Find all epsilon transitions from this state
      const epsilonTransitions = nfa.transitions.filter(t => 
        t.from === state && (t.isEpsilon || t.symbols.includes('ε') || t.symbol === 'ε')
      );
      
      for (const transition of epsilonTransitions) {
        if (!newStates.has(transition.to)) {
          newStates.add(transition.to);
          changed = true;
        }
      }
    }
    
    newStates.forEach(s => closure.add(s));
  }
  
  return closure;
}

// Helper: Find transitions from a state for a given symbol
function getTransitionsForSymbol(automaton: Automaton, fromState: string, symbol: string): Transition[] {
  return automaton.transitions.filter(t => {
    if (t.from !== fromState || t.isEpsilon) return false;
    
    // Check if transition has valid symbols
    const hasSymbols = t.symbols && t.symbols.length > 0;
    const hasSymbol = t.symbol && t.symbol.trim() !== '';
    
    if (!hasSymbols && !hasSymbol) return false; // Skip transitions with no symbols
    
    // Check if symbol matches
    if (hasSymbols && t.symbols.includes(symbol)) return true;
    if (hasSymbol && t.symbol === symbol) return true;
    
    return false;
  });
}

// Helper: Find epsilon transitions from a state
function getEpsilonTransitions(automaton: Automaton, fromState: string): Transition[] {
  return automaton.transitions.filter(t => 
    t.from === fromState && 
    (t.isEpsilon || t.symbols.includes('ε') || t.symbol === 'ε')
  );
}

// DFA Simulation
export function simulateDFA(dfa: DFA, input: string): SimulationResult {
  const steps: SimulationStep[] = [];
  let currentState = dfa.states.find(s => s.isStart)?.id;
  
  if (!currentState) {
    return {
      isAccepted: false,
      steps: [],
      error: 'No start state found. Please set a start state.'
    };
  }
  
  // Validate that transitions have symbols
  const transitionsWithoutSymbols = dfa.transitions.filter(t => {
    const hasSymbols = t.symbols && t.symbols.length > 0;
    const hasSymbol = t.symbol && t.symbol.trim() !== '';
    return !hasSymbols && !hasSymbol && !t.isEpsilon;
  });
  
  if (transitionsWithoutSymbols.length > 0) {
    return {
      isAccepted: false,
      steps: [],
      error: `Some transitions are missing symbols. Please edit transitions to add input symbols.`
    };
  }

  // Add initial step
  steps.push({
    step: 0,
    currentState,
    remainingInput: input,
    isAccepted: false,
    isRejected: false
  });

  // Process each input symbol
  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    
    // Find transitions from current state with this symbol
    const transitions = getTransitionsForSymbol(dfa, currentState, symbol);
    
    if (transitions.length === 0) {
      // Check if there are any transitions from this state at all
      const allTransitionsFromState = dfa.transitions.filter(t => t.from === currentState);
      const validTransitions = allTransitionsFromState.filter(t => {
        const hasSymbols = t.symbols && t.symbols.length > 0;
        const hasSymbol = t.symbol && t.symbol.trim() !== '';
        return hasSymbols || hasSymbol;
      });
      
      if (validTransitions.length === 0) {
        return {
          isAccepted: false,
          steps,
          error: `No valid transitions defined from state ${currentState}. Please add transition symbols.`
        };
      }
      
      // No transition for this symbol
      steps.push({
        step: i + 1,
        currentState,
        remainingInput: input.slice(i + 1),
        isAccepted: false,
        isRejected: true
      });
      break;
    }
    
    if (transitions.length > 1) {
      // Multiple transitions - this violates DFA determinism
      return {
        isAccepted: false,
        steps,
        error: `Non-deterministic transition: multiple transitions from ${currentState} on symbol ${symbol}`
      };
    }
    
    // Take the single transition
    currentState = transitions[0].to;
    steps.push({
      step: i + 1,
      currentState,
      remainingInput: input.slice(i + 1),
      isAccepted: false,
      isRejected: false
    });
  }

  // Check if final state is accepting
  const finalState = dfa.states.find(s => s.id === currentState);
  const isAccepted = finalState?.isFinal || false;

  // Update final step
  if (steps.length > 0) {
    steps[steps.length - 1].isAccepted = isAccepted;
    steps[steps.length - 1].isRejected = !isAccepted;
  }

  return {
    isAccepted,
    steps,
    finalState: currentState
  };
}

// NFA Simulation (using BFS to explore all possible paths)
export function simulateNFA(nfa: NFA, input: string): SimulationResult {
  const steps: SimulationStep[] = [];
  
  const startState = nfa.states.find(s => s.isStart)?.id;
  if (!startState) {
    return {
      isAccepted: false,
      steps: [],
      error: 'No start state found. Please set a start state.'
    };
  }
  
  // Validate that transitions have symbols (except epsilon transitions)
  const transitionsWithoutSymbols = nfa.transitions.filter(t => {
    if (t.isEpsilon || t.symbols?.includes('ε') || t.symbol === 'ε') return false;
    const hasSymbols = t.symbols && t.symbols.length > 0;
    const hasSymbol = t.symbol && t.symbol.trim() !== '';
    return !hasSymbols && !hasSymbol;
  });
  
  if (transitionsWithoutSymbols.length > 0) {
    return {
      isAccepted: false,
      steps: [],
      error: `Some transitions are missing symbols. Please edit transitions to add input symbols.`
    };
  }

  // Start with epsilon closure of start state
  let currentStates = epsilonClosure(nfa, new Set([startState]));
  
  // Add initial step
  steps.push({
    step: 0,
    currentState: Array.from(currentStates).sort().join(', '),
    remainingInput: input,
    isAccepted: false,
    isRejected: false
  });

  // Process each input symbol
  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const nextStates = new Set<string>();
    
    // For each current state, find all possible next states
    for (const state of currentStates) {
      // Find all transitions with this symbol
      const transitions = getTransitionsForSymbol(nfa, state, symbol);
      transitions.forEach(t => nextStates.add(t.to));
    }
    
    // Compute epsilon closure of all reached states
    const nextStatesWithEpsilon = epsilonClosure(nfa, nextStates);
    
    if (nextStatesWithEpsilon.size === 0) {
      // No transitions available
      steps.push({
        step: i + 1,
        currentState: '',
        remainingInput: input.slice(i + 1),
        isAccepted: false,
        isRejected: true
      });
      break;
    }
    
    currentStates = nextStatesWithEpsilon;
    steps.push({
      step: i + 1,
      currentState: Array.from(currentStates).sort().join(', '),
      remainingInput: input.slice(i + 1),
      isAccepted: false,
      isRejected: false
    });
  }

  // Check if any final state is accepting
  const finalStates = Array.from(currentStates);
  const isAccepted = finalStates.some(stateId => {
    const state = nfa.states.find(s => s.id === stateId);
    return state?.isFinal || false;
  });

  // Update final step
  if (steps.length > 0) {
    steps[steps.length - 1].isAccepted = isAccepted;
    steps[steps.length - 1].isRejected = !isAccepted;
  }

  return {
    isAccepted,
    steps,
    finalState: finalStates.sort().join(', ')
  };
}

// Main simulation function that routes to appropriate simulator
export function simulateAutomaton(automaton: DFA | NFA, input: string): SimulationResult {
  switch (automaton.type) {
    case 'DFA':
      return simulateDFA(automaton as DFA, input);
    case 'NFA':
      return simulateNFA(automaton as NFA, input);
    default:
      return {
        isAccepted: false,
        steps: [],
        error: 'Unknown automaton type. Only DFA and NFA are supported.'
      };
  }
}
