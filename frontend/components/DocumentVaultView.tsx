'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, Database, ShieldCheck, CheckCircle2, Trash2, Eye, FileUp, Sparkles } from 'lucide-react';

interface DocumentVaultViewProps {
  documents: Array<{ file_name: string; total_pages?: number; chunks_count?: number }>;
  onUpload: (files: FileList) => void;
  isUploading: boolean;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  onUpload,
  isUploading
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner Box */}
      <div className="ui-box" style={{ borderLeft: '4px solid #7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c4b5fd', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={16} />
            <span>High-Volume Sustainability Document Vault</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
            Batch Paper Ingestion & Vector Repository
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            Upload 20 to 50+ policy documents, research reports, or ESG directives for automatic chunking and NVIDIA vector indexing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="ui-box" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(124, 58, 237, 0.1)' }}>
            <Database size={22} style={{ color: '#a78bfa' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Vector Index</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{documents.length} Papers Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Upload Form Card */}
      <div className="ui-box" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
          Upload Research Papers (PDF Format)
        </h2>

        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload-input')?.click()}
          style={{
            border: dragActive ? '2px dashed #7c3aed' : '2px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            background: dragActive ? 'rgba(124, 58, 237, 0.1)' : 'rgba(15, 23, 42, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            id="file-upload-input"
            type="file"
            multiple
            accept=".pdf"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4b5fd'
          }}>
            <UploadCloud size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>
              {isUploading ? 'Ingesting & Indexing Papers with NVIDIA NIM...' : 'Drag & drop 20 to 50+ research PDFs here'}
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Supports PDF documents up to 100MB per file. Automatic 500-char safety chunking applied.
            </span>
          </div>

          <button
            type="button"
            className="btn-violet"
            style={{ marginTop: '8px', pointerEvents: 'none' }}
          >
            <FileUp size={16} />
            <span>Select PDF Files</span>
          </button>
        </form>
      </div>

      {/* Indexed Document Repository Data Table */}
      <div className="ui-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
              Indexed Document Repository
            </h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Active papers available for RAG Q&A and Report Synthesis</span>
          </div>

          <span className="badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            Grounding Verified
          </span>
        </div>

        {documents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            No documents uploaded yet. Use the upload box above to ingest your policy papers.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Total Pages</th>
                  <th>Vector Chunks</th>
                  <th>Indexing Engine</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={18} style={{ color: '#a78bfa' }} />
                        <span style={{ fontWeight: '600', color: '#fff' }}>{doc.file_name}</span>
                      </div>
                    </td>
                    <td>{doc.total_pages || 1} Pages</td>
                    <td><span className="badge-cyan">{doc.chunks_count || 10} Chunks</span></td>
                    <td><span className="badge-purple">nvidia/nv-embedqa-e5-v5</span></td>
                    <td>
                      <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} />
                        Indexed
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => alert(`Viewing indexed metadata for: ${doc.file_name}`)}
                        className="btn-ghost-dark"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
