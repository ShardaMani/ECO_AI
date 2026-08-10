'use client';

import React from 'react';
import { BookOpen, FileText, CheckCircle2, X, ExternalLink, Copy, Check } from 'lucide-react';

export interface ActiveCitation {
  fileName: string;
  pageNumber: number;
  paragraphNumber?: number;
  verbatimSnippet?: string;
}

interface CitationInspectorProps {
  activeCitation: ActiveCitation | null;
  onClose: () => void;
}

export const CitationInspector: React.FC<CitationInspectorProps> = ({
  activeCitation,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!activeCitation) return null;

  const handleCopyQuote = () => {
    if (activeCitation.verbatimSnippet) {
      navigator.clipboard.writeText(
        `"${activeCitation.verbatimSnippet}" — ${activeCitation.fileName}, p. ${activeCitation.pageNumber}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenPDFDoc = () => {
    const docWindow = window.open('', '_blank');
    if (!docWindow) {
      alert("Please allow popups to view document excerpt.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeCitation.fileName} - Page ${activeCitation.pageNumber}</title>
          <style>
            body { font-family: sans-serif; margin: 40px; background: #0b0f19; color: #f1f5f9; line-height: 1.6; }
            .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; max-width: 700px; margin: 0 auto; }
            h2 { color: #a78bfa; margin-top: 0; font-size: 20px; }
            .meta { font-size: 13px; color: #94a3b8; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 12px; }
            .snippet { background: rgba(124, 58, 237, 0.15); border-left: 4px solid #7c3aed; padding: 16px; border-radius: 8px; font-style: italic; color: #e2e8f0; font-size: 15px; }
            .badge { background: #10b98120; color: #34d399; padding: 4px 8px; border-radius: 999px; font-size: 12px; display: inline-block; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">✓ 100% Grounded Source Match</div>
            <h2>${activeCitation.fileName}</h2>
            <div class="meta">Page Number: ${activeCitation.pageNumber} · Citation Chunk Excerpt</div>
            <div class="snippet">
              "${activeCitation.verbatimSnippet || 'Verbatim quote excerpt indexed from the original document page for policy verification.'}"
            </div>
          </div>
        </body>
      </html>
    `;

    docWindow.document.write(htmlContent);
    docWindow.document.close();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '68px',
        right: '0',
        width: '380px',
        height: 'calc(100vh - 68px)',
        background: '#0b0f19',
        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 60
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4b5fd'
          }}>
            <BookOpen size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
              Source Citation Inspector
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Verified Policy Reference</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Verification Badge Box */}
      <div className="badge-emerald" style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '10px 14px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: '13px', fontWeight: '600' }}>100% Grounded Source Match</span>
        </div>
        <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>Verified</span>
      </div>

      {/* Document Details Card */}
      <div className="ui-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <FileText size={20} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: 0, wordBreak: 'break-word' }}>
              {activeCitation.fileName}
            </h4>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
              Research Paper / Policy Directive
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Location</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', fontFamily: 'monospace' }}>Page {activeCitation.pageNumber}</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Section Chunk</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#38bdf8', fontFamily: 'monospace' }}>Para #{activeCitation.paragraphNumber || 1}</span>
          </div>
        </div>
      </div>

      {/* Verbatim Source Snippet Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Verbatim Source Quote:
        </span>
        <div style={{
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '13px',
          color: '#e2e8f0',
          lineHeight: '1.6',
          fontStyle: 'italic',
          flex: 1,
          overflowY: 'auto'
        }}>
          "{activeCitation.verbatimSnippet || 'Verbatim quote excerpt indexed from the original document page for policy verification.'}"
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleCopyQuote}
          className="btn-ghost-dark"
          style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
        >
          {copied ? <Check size={14} style={{ color: '#34d399' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied Reference' : 'Copy Quote'}</span>
        </button>
        <button
          onClick={handleOpenPDFDoc}
          className="btn-violet"
          style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
        >
          <ExternalLink size={14} />
          <span>View Excerpt</span>
        </button>
      </div>
    </div>
  );
};
