// Core automata types and interfaces

export interface State {
  id: string;
  name: string;
  x: number;
  y: number;
  isStart: boolean;
  isFinal: boolean;
  isActive?: boolean; // For simulation highlighting
}

export interface Transition {
  id: string;
  from: string; // State ID
  to: string; // State ID
  symbol: string; // Input symbol (for backward compatibility)
  symbols: string[]; // Multiple symbols on same transition
  label: string; // Display label
  isEpsilon?: boolean; // For NFA: epsilon transition
}

export interface Automaton {
  id: string;
  name: string;
  type: 'DFA' | 'NFA';
  states: State[];
  transitions: Transition[];
  alphabet: string[];
  customAlphabet?: boolean; // Whether user has defined custom alphabet
}

export interface SimulationStep {
  step: number;
  currentState: string;
  remainingInput: string;
  transition?: Transition;
  isAccepted: boolean;
  isRejected: boolean;
}

export interface SimulationResult {
  isAccepted: boolean;
  steps: SimulationStep[];
  finalState?: string;
  error?: string;
}

// DFA specific types
export interface DFA extends Automaton {
  type: 'DFA';
}

// NFA specific types
export interface NFA extends Automaton {
  type: 'NFA';
}

// Canvas and UI types
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  draggedStateId: string | null;
  startPosition: CanvasPosition;
  currentPosition: CanvasPosition;
}

// Simulation controls
export interface SimulationControls {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  speed: number; // milliseconds between steps
  autoPlay: boolean;
}
