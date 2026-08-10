'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface CitationPillProps {
  fileName: string;
  pageNumber: number;
  snippet?: string;
  onInspect?: (citation: { fileName: string; pageNumber: number; verbatimSnippet?: string }) => void;
}

export const CitationPill: React.FC<CitationPillProps> = ({
  fileName,
  pageNumber,
  snippet,
  onInspect
}) => {
  return (
    <button
      onClick={() => onInspect && onInspect({ fileName, pageNumber, verbatimSnippet: snippet })}
      className="citation-pill-btn"
      title={`Click to inspect verbatim source quote from ${fileName}, p. ${pageNumber}`}
    >
      <BookOpen size={12} style={{ color: '#a78bfa' }} />
      <span>{fileName}</span>
      <span style={{ color: '#94a3b8' }}>p.{pageNumber}</span>
    </button>
  );
};
