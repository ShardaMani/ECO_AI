'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, Download, Layers, Loader2 } from 'lucide-react';
import { CitationPill } from './CitationPill';

interface ReportStudioProps {
  documents: Array<{ file_name: string }>;
}

export const ReportStudio: React.FC<ReportStudioProps> = ({ documents }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [outline, setOutline] = useState<Array<{ title: string; description: string }>>([]);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [citations, setCitations] = useState<Array<{ file_name: string; page_number: number }>>([]);

  const handleGenerateReport = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setCurrentStep('Dispatching LangGraph Multi-Agent Workflow...');
    setReportMarkdown('');
    setOutline([]);

    try {
      const response = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          selected_docs: documents.map((d) => d.file_name)
        })
      });

      if (!response.ok) {
        throw new Error('Report generation failed');
      }

      const data = await response.json();
      setOutline(data.outline || []);
      setReportMarkdown(data.report_markdown || '');
      setCitations(data.citations || []);
      setCurrentStep('Completed');
    } catch (error) {
      setCurrentStep('Failed to generate report');
      setReportMarkdown('An error occurred during LangGraph multi-agent report generation. Please check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedMarkdown = (text: string) => {
    const citationRegex = /\[(?:Doc:\s*)?([^,\]]+),\s*p(?:age)?\.\s*(\d+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const fileName = match[1].trim();
      const pageNumber = parseInt(match[2], 10);

      parts.push(
        <CitationPill
          key={match.index}
          fileName={fileName}
          pageNumber={pageNumber}
        />
      );

      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-white font-geist">
          LangGraph Report Studio
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Autonomously compile multi-page sustainability briefing papers with outline planning, section research, citation audit, and markdown synthesis.
        </p>
      </div>

      {/* Prompt Input Box */}
      <div className="frosted-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Report Objective / Custom Prompt</span>
          </label>
          <span className="text-xs text-gray-400">
            Targeting {documents.length} Uploaded Resources
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="E.g., Generate a comprehensive 4-page Policy Brief comparing renewable energy tax incentives and carbon reduction targets across our uploaded climate reports..."
          className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={loading || !prompt.trim()}
            className="pill-btn-white flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Sparkles className="w-4 h-4 text-black" />
            )}
            <span>{loading ? 'Running LangGraph Agents...' : 'Compile Policy Report'}</span>
          </button>
        </div>
      </div>

      {/* Active Agent Status Bar */}
      {loading && (
        <div className="graphite-panel p-4 flex items-center gap-3 border border-violet-500/30">
          <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          <div className="text-xs">
            <p className="font-medium text-white">{currentStep}</p>
            <p className="text-gray-400">LangGraph nodes: OutlinePlanner → SectionResearcher → CitationVerifier → ReportSynthesizer</p>
          </div>
        </div>
      )}

      {/* Generated Report View */}
      {reportMarkdown && (
        <div className="frosted-panel p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-medium text-white font-geist">Generated Policy Brief</h2>
            </div>
            <button
              onClick={() => alert("Report downloaded as Markdown / PDF")}
              className="pill-btn-ghost flex items-center gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Document</span>
            </button>
          </div>

          {/* Render Markdown Content */}
          <div className="text-sm text-gray-300 leading-relaxed space-y-4 font-sans whitespace-pre-wrap">
            {renderFormattedMarkdown(reportMarkdown)}
          </div>
        </div>
      )}
    </div>
  );
};
