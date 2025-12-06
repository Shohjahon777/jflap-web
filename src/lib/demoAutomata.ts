import { DFA, NFA } from '@/types/automata';

// DFA Example: Strings divisible by 3
export const divisibleBy3DFA: DFA = {
  id: 'divisible-by-3-dfa',
  name: 'Divisible by 3 DFA',
  type: 'DFA',
  states: [
    { id: 'q0', name: 'q0', x: 100, y: 200, isStart: true, isFinal: true },
    { id: 'q1', name: 'q1', x: 300, y: 200, isStart: false, isFinal: false },
    { id: 'q2', name: 'q2', x: 500, y: 200, isStart: false, isFinal: false },
  ],
  transitions: [
    { id: 't1', from: 'q0', to: 'q1', symbol: '1', symbols: ['1'], label: '1', isEpsilon: false },
    { id: 't2', from: 'q0', to: 'q0', symbol: '0', symbols: ['0'], label: '0', isEpsilon: false },
    { id: 't3', from: 'q1', to: 'q2', symbol: '1', symbols: ['1'], label: '1', isEpsilon: false },
    { id: 't4', from: 'q1', to: 'q0', symbol: '0', symbols: ['0'], label: '0', isEpsilon: false },
    { id: 't5', from: 'q2', to: 'q0', symbol: '1', symbols: ['1'], label: '1', isEpsilon: false },
    { id: 't6', from: 'q2', to: 'q1', symbol: '0', symbols: ['0'], label: '0', isEpsilon: false },
  ],
  alphabet: ['0', '1'],
};

// NFA Example: Strings ending with 'ab'
export const endsWithAbNFA: NFA = {
  id: 'ends-with-ab-nfa',
  name: 'Ends with "ab" NFA',
  type: 'NFA',
  states: [
    { id: 'q0', name: 'q0', x: 100, y: 200, isStart: true, isFinal: false },
    { id: 'q1', name: 'q1', x: 300, y: 200, isStart: false, isFinal: false },
    { id: 'q2', name: 'q2', x: 500, y: 200, isStart: false, isFinal: true },
  ],
  transitions: [
    { id: 't1', from: 'q0', to: 'q0', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't2', from: 'q0', to: 'q0', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
    { id: 't3', from: 'q0', to: 'q1', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't4', from: 'q1', to: 'q2', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
  ],
  alphabet: ['a', 'b'],
};

// Simple DFA Example: Even number of a's
export const evenAsDFA: DFA = {
  id: 'even-as-dfa',
  name: 'Even number of a\'s DFA',
  type: 'DFA',
  states: [
    { id: 'q0', name: 'q0', x: 100, y: 200, isStart: true, isFinal: true },
    { id: 'q1', name: 'q1', x: 300, y: 200, isStart: false, isFinal: false },
  ],
  transitions: [
    { id: 't1', from: 'q0', to: 'q1', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't2', from: 'q0', to: 'q0', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
    { id: 't3', from: 'q1', to: 'q0', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't4', from: 'q1', to: 'q1', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
  ],
  alphabet: ['a', 'b'],
};

// DFA Example: Strings that start and end with 'a'
export const startsAndEndsWithA: DFA = {
  id: 'starts-ends-with-a-dfa',
  name: 'Starts and Ends with "a" DFA',
  type: 'DFA',
  states: [
    { id: 'q0', name: 'q0', x: 100, y: 200, isStart: true, isFinal: false },
    { id: 'q1', name: 'q1', x: 300, y: 200, isStart: false, isFinal: false },
    { id: 'q2', name: 'q2', x: 500, y: 200, isStart: false, isFinal: true },
  ],
  transitions: [
    { id: 't1', from: 'q0', to: 'q1', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't2', from: 'q1', to: 'q1', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't3', from: 'q1', to: 'q1', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
    { id: 't4', from: 'q1', to: 'q2', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't5', from: 'q2', to: 'q2', symbol: 'a', symbols: ['a'], label: 'a', isEpsilon: false },
    { id: 't6', from: 'q2', to: 'q2', symbol: 'b', symbols: ['b'], label: 'b', isEpsilon: false },
  ],
  alphabet: ['a', 'b'],
};

export const demoAutomata = {
  divisibleBy3DFA,
  endsWithAbNFA,
  evenAsDFA,
  startsAndEndsWithA,
};
