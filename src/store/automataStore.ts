import { create } from 'zustand';
import { State, Transition, Automaton, SimulationResult, SimulationControls } from '@/types/automata';

interface AutomataStore {
  // Current automaton
  currentAutomaton: Automaton | null;
  
  // UI state
  selectedStateId: string | null;
  selectedTransitionId: string | null;
  isCreatingTransition: boolean;
  isSimulating: boolean;
  
  // Simulation state
  simulationResult: SimulationResult | null;
  simulationControls: SimulationControls;
  
  // Actions
  setCurrentAutomaton: (automaton: Automaton | null) => void;
  addState: (state: State) => void;
  updateState: (stateId: string, updates: Partial<State>) => void;
  removeState: (stateId: string) => void;
  addTransition: (transition: Transition) => void;
  updateTransition: (transitionId: string, updates: Partial<Transition>) => void;
  removeTransition: (transitionId: string) => void;
  
  // UI actions
  selectState: (stateId: string | null) => void;
  selectTransition: (transitionId: string | null) => void;
  setCreatingTransition: (isCreating: boolean) => void;
  
  // Simulation actions
  startSimulation: (input: string) => void;
  stopSimulation: () => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  updateSimulationControls: (controls: Partial<SimulationControls>) => void;
  
  // Reset
  resetAutomaton: () => void;
  resetSimulation: () => void;
}

export const useAutomataStore = create<AutomataStore>((set, get) => ({
  // Initial state
  currentAutomaton: null,
  selectedStateId: null,
  selectedTransitionId: null,
  isCreatingTransition: false,
  isSimulating: false,
  simulationResult: null,
  simulationControls: {
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    speed: 1000,
    autoPlay: false,
  },

  // Automaton actions
  setCurrentAutomaton: (automaton) => set({ currentAutomaton: automaton }),
  
  addState: (state) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        states: [...currentAutomaton.states, state],
      },
    });
  },
  
  updateState: (stateId, updates) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        states: currentAutomaton.states.map(state =>
          state.id === stateId ? { ...state, ...updates } : state
        ),
      },
    });
  },
  
  removeState: (stateId) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        states: currentAutomaton.states.filter(state => state.id !== stateId),
        transitions: currentAutomaton.transitions.filter(
          transition => transition.from !== stateId && transition.to !== stateId
        ),
      },
    });
  },
  
  addTransition: (transition) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        transitions: [...currentAutomaton.transitions, transition],
      },
    });
  },
  
  updateTransition: (transitionId, updates) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        transitions: currentAutomaton.transitions.map(transition =>
          transition.id === transitionId ? { ...transition, ...updates } : transition
        ),
      },
    });
  },
  
  removeTransition: (transitionId) => {
    const { currentAutomaton } = get();
    if (!currentAutomaton) return;
    
    set({
      currentAutomaton: {
        ...currentAutomaton,
        transitions: currentAutomaton.transitions.filter(
          transition => transition.id !== transitionId
        ),
      },
    });
  },
  
  // UI actions
  selectState: (stateId) => set({ selectedStateId: stateId }),
  selectTransition: (transitionId) => set({ selectedTransitionId: transitionId }),
  setCreatingTransition: (isCreating) => set({ isCreatingTransition: isCreating }),
  
  // Simulation actions
  startSimulation: (input) => {
    set({ isSimulating: true, simulationControls: { ...get().simulationControls, isPlaying: true } });
    // Simulation logic will be implemented in the simulation service
  },
  
  stopSimulation: () => {
    set({ 
      isSimulating: false, 
      simulationControls: { ...get().simulationControls, isPlaying: false, isPaused: false } 
    });
  },
  
  setSimulationResult: (result) => set({ simulationResult: result }),
  
  updateSimulationControls: (controls) => {
    set({
      simulationControls: { ...get().simulationControls, ...controls }
    });
  },
  
  // Reset actions
  resetAutomaton: () => {
    set({
      currentAutomaton: null,
      selectedStateId: null,
      selectedTransitionId: null,
      isCreatingTransition: false,
    });
  },
  
  resetSimulation: () => {
    set({
      isSimulating: false,
      simulationResult: null,
      simulationControls: {
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        speed: 1000,
        autoPlay: false,
      },
    });
  },
}));
