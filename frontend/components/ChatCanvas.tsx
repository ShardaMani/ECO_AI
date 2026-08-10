'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { CitationPill } from './CitationPill';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ file_name: string; page_number: number; verbatim_snippet?: string }>;
}

interface ChatCanvasProps {
  documents: Array<{ file_name: string }>;
}

export const ChatCanvas: React.FC<ChatCanvasProps> = ({ documents }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to EcoResearch AI. Ask any question across your uploaded sustainability papers. 100% of my responses will include verifiable inline citations.',
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputQuery.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputQuery
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = inputQuery;
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          selected_docs: documents.map((d) => d.file_name)
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
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
          content: 'Sorry, an error occurred while querying the vector database. Please ensure the backend server is running and your NVIDIA API key is set.',
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with interactive inline citation pills
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
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] graphite-panel p-4 overflow-hidden border border-white/10">
      {/* Chat Thread Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white text-black font-medium rounded-tr-none'
                  : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant'
                ? renderFormattedText(msg.content, msg.citations)
                : msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white/5 text-gray-400 p-4 rounded-2xl border border-white/10 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              <span>Querying vector store & auditing inline citations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask any question across your uploaded sustainability papers..."
          className="flex-1 bg-black/60 border border-white/15 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={loading || !inputQuery.trim()}
          className="pill-btn-white flex items-center gap-1.5 px-6 disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
