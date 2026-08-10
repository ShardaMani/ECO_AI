'use client';

import React from 'react';
import { Sparkles, FileText, MessageSquare, Layers } from 'lucide-react';

interface FloatingNavProps {
  activeTab: 'vault' | 'chat' | 'report';
  setActiveTab: (tab: 'vault' | 'chat' | 'report') => void;
  documentCount: number;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  activeTab,
  setActiveTab,
  documentCount
}) => {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <nav 
        className="w-full max-w-4xl px-5 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(22, 22, 22, 0.85)',
          border: '1px solid rgba(229, 229, 229, 0.15)',
          borderRadius: '9999px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)'
        }}
      >
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-sm">
            E
          </div>
          <span className="text-white font-medium text-sm tracking-tight hidden sm:inline-block">
            EcoResearch <span className="text-xs text-gray-400 font-normal">AI</span>
          </span>
        </div>

        {/* Center Pill Nav Links */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'vault'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vault ({documentCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Q&A Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'report'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Studio</span>
          </button>
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="pill-btn-white text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline-block">Generate Report</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
