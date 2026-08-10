'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2, BookOpen, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { CitationPill } from './CitationPill';
import { CitationInspector, ActiveCitation } from './CitationInspector';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ file_name: string; page_number: number; verbatim_snippet?: string }>;
}

interface PolicyChatViewProps {
  documents: Array<{ file_name: string }>;
}

export const PolicyChatView: React.FC<PolicyChatViewProps> = ({ documents }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to the Policy Q&A Canvas. Ask any comparative or analytical query across your uploaded sustainability papers. 100% of my responses are backed by verifiable inline citations.',
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<ActiveCitation | null>(null);

  const quickPrompts = [
    "Compare EU vs US carbon border adjustment policies",
    "Extract 2030 renewable energy targets & deadlines",
    "Summarize Scope 1, 2, and 3 emissions reporting mandates",
    "What are the ESG disclosure penalties under CSRD?"
  ];

  const handleSend = async (queryOverride?: string) => {
    const queryToSubmit = queryOverride || inputQuery;
    if (!queryToSubmit.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryToSubmit
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryOverride) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSubmit,
          selected_docs: documents.map((d) => d.file_name)
        })
      });

      if (!response.ok) {
        throw new Error('API query failed');
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'An error occurred while querying the vector store. Please make sure the backend server is running.',
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string, citations?: Message['citations']) => {
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
      const matchedCit = citations?.find((c) => c.file_name === fileName);

      parts.push(
        <CitationPill
          key={match.index}
          fileName={fileName}
          pageNumber={pageNumber}
          snippet={matchedCit?.verbatim_snippet}
          onInspect={(cit) => setActiveCitation({
            fileName: cit.fileName,
            pageNumber: cit.pageNumber,
            verbatimSnippet: cit.verbatimSnippet
          })}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 130px)', position: 'relative' }}>
      {/* Header Controls Box */}
      <div className="ui-box" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4b5fd'
          }}>
            <BookOpen size={19} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
              Interactive Policy Q&A Canvas
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Searching across {documents.length} loaded papers</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} />
            Strict Citation Audit Active
          </span>
          <button
            onClick={() => setMessages([messages[0]])}
            className="btn-ghost-dark"
            style={{ padding: '6px 10px' }}
            title="Reset Chat"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Chat Thread Box */}
      <div className="ui-box" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <Bot size={19} />
              </div>
            )}

            <div style={{
              maxWidth: '750px',
              padding: '16px 20px',
              borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.05)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '15px',
              lineHeight: '1.6'
            }}>
              {msg.role === 'assistant'
                ? renderFormattedText(msg.content, msg.citations)
                : msg.content}
            </div>

            {msg.role === 'user' && (
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <User size={19} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c4b5fd'
            }}>
              <Sparkles size={19} className="animate-spin" />
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px 18px',
              borderRadius: '0 16px 16px 16px',
              fontSize: '15px',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Loader2 size={17} className="animate-spin text-purple-400" />
              <span>Querying vector store & auditing citation integrity with NVIDIA NIM...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Query Input Box & Quick Suggestions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <Zap size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', flexShrink: 0 }}>
            Suggested Queries:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="btn-ghost-dark"
              style={{ fontSize: '13px', padding: '5px 11px', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {qp}
            </button>
          ))}
        </div>

        <div className="ui-box" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask any sustainability policy query across your papers..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              padding: '6px'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="btn-violet"
            style={{ padding: '9px 20px', opacity: loading || !inputQuery.trim() ? 0.5 : 1 }}
          >
            <span>Ask</span>
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Slide-over Citation Inspector Drawer */}
      <CitationInspector
        activeCitation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />
    </div>
  );
};
