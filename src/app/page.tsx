'use client';

import React from 'react';
import { ProfessionalSidebar } from '@/components/ProfessionalSidebar';
import { AutomataPlayground } from '@/components/AutomataPlayground';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">🎯 Automata Playground</h1>
            <span className="text-sm text-muted-foreground">
              Professional DFA/NFA Simulator
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <ProfessionalSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <AutomataPlayground />
        </main>
      </div>
    </div>
  );
}