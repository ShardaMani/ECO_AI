'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StatusBannerProps {
  message?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  message = "LangGraph Multi-Agent Engine Active · Universal Citation Audit Enabled"
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div 
        className="px-4 py-1.5 flex items-center gap-2 text-xs text-gray-300 rounded-full transition-all cursor-pointer hover:border-white/30"
        style={{
          backgroundColor: '#161616',
          border: '1px solid rgba(229, 229, 229, 0.15)'
        }}
      >
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span className="font-medium text-gray-200">{message}</span>
        <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
      </div>
    </div>
  );
};
