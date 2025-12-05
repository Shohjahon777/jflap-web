# 🎯 Automata Playground

A professional, visual interactive web application for creating and simulating finite automata. Built with Next.js 15, React Flow, and shadcn/ui for a clean, modern interface.

## ✨ Features

### 🏗️ **Professional Interface**
- **Clean Sidebar Layout**: Professional sidebar with organized tools and controls
- **Modern Design**: Built with shadcn/ui components for consistent, beautiful styling
- **Responsive**: Works perfectly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes with smooth transitions

### 🤖 **Automaton Types**
- **DFA**: Deterministic Finite Automaton
- **NFA**: Non-Deterministic Finite Automaton (with epsilon transitions support)

### 🎨 **Visual Design**
- **Professional State Nodes**: Clean circles with proper sizing (not huge like JFLAP)
- **Smart Color Scheme**: Professional grays, blues, and accent colors
- **Smooth Animations**: Framer Motion for beautiful transitions
- **Interactive Elements**: Hover effects, tooltips, and smooth interactions

### 🛠️ **JFLAP-like Features**
- **Start State**: Click the play button on any state to set as start
- **Final States**: Click the circle button to toggle final states
- **Drag & Drop**: Drag states around the canvas
- **Transition Labels**: Click to edit transition symbols
- **Visual Feedback**: States highlight during simulation

### 🎮 **Simulation**
- **Step-by-step**: Watch automata process input step by step
- **Play/Pause Controls**: Full control over simulation speed
- **Visual Highlighting**: Active states and transitions are highlighted
- **NFA Support**: Properly handles epsilon transitions and non-determinism

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd automata-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating an Automaton

1. **Choose Type**: Select DFA or NFA from the sidebar
2. **Create New**: Click "New Automaton" to start
3. **Add States**: Click "Add State" to place states on the canvas
4. **Set Start State**: Click the play button on a state to make it the start state
5. **Set Final States**: Click the circle button on states to make them final
6. **Add Transitions**: Drag from one state to another to create transitions
7. **Edit Labels**: Click on transition labels to edit symbols

### Simulation

1. **Enter Input**: Type a string in the "Input String" field
2. **Simulate**: Click "Simulate" to test the automaton
3. **Watch Steps**: Use play/pause/step controls to see the process
4. **View Results**: See if the string is accepted or rejected

### Demo Examples

Load pre-built examples from the sidebar:
- **Divisible by 3 DFA**: Accepts binary numbers divisible by 3
- **Ends with "ab" NFA**: Accepts strings ending with "ab"
- **Even number of a's DFA**: Accepts strings with even number of 'a' characters
- **Starts and Ends with "a" DFA**: Accepts strings that start and end with 'a'

### Saving and Loading

- **Save**: Export your automaton as JSON
- **Load**: Import previously saved automata
- **Demo**: Load example automata to learn from

## 🎨 Design Philosophy

This application prioritizes:

- **Professional Appearance**: Clean, modern design suitable for academic use
- **Usability**: Intuitive interface that doesn't require extensive learning
- **Performance**: Smooth animations and responsive interactions
- **Accessibility**: Clear visual hierarchy and keyboard navigation
- **Educational Value**: Visual feedback helps understand automata concepts

## 🛠️ Technical Stack

- **Frontend**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Visualization**: React Flow (@xyflow/react)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **TypeScript**: Full type safety
- **Styling**: Professional color scheme with dark/light mode

## 📚 Educational Use

Perfect for:
- **Computer Science Courses**: Theory of Automata, Formal Languages
- **Self-Learning**: Interactive exploration of automata concepts
- **Research**: Prototyping and testing automata designs
- **Presentations**: Clean, professional interface for demos

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT License.# jflap-web
