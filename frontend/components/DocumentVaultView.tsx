'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Layers, Search, Filter, Loader2, Sparkles, AlertCircle, Eye } from 'lucide-react';

interface DocumentVaultViewProps {
  documents: Array<{ file_name: string; total_pages: number; chunks_count: number }>;
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  onUpload,
  isUploading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

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

  const filteredDocs = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalPages = documents.reduce((acc, d) => acc + d.total_pages, 0);
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks_count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Box */}
      <div className="ui-box" style={{ borderLeft: '4px solid #7c3aed', display: 'flex', alignItems: 'center', justify: 'space-between', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Layers size={15} />
            <span>Multi-Document Vault & Ingestion Pipeline</span>
          </div>
          <h1 style={{ fontSize: '23px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
            Sustainability Research Repository
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', maxWidth: '700px', lineHeight: '1.5' }}>
            Batch upload up to 50+ dense policy PDFs (IPCC AR6, UN SDGs, EU CSRD, US IRA). All documents are parsed into page-numbered vector chunks for fine-grained citation tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Papers Loaded</span>
            <span style={{ fontSize: '19px', fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{documents.length}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Vectors Indexed</span>
            <span style={{ fontSize: '19px', fontWeight: '700', color: '#38bdf8', fontFamily: 'monospace' }}>{totalChunks}</span>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Form Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="ui-box"
        style={{
          border: dragActive ? '2px dashed #7c3aed' : '2px dashed rgba(255,255,255,0.15)',
          background: dragActive ? 'rgba(124, 58, 237, 0.08)' : 'rgba(15, 23, 42, 0.5)',
          textAlign: 'center',
          padding: '40px 20px',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          id="file-upload-input"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
        <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.2) 100%)',
            border: '1px solid rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a78bfa'
          }}>
            {isUploading ? <Loader2 size={28} className="animate-spin" /> : <Upload size={28} />}
          </div>

          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
              {isUploading ? 'Extracting Text & Generating Vectors...' : 'Drag & Drop 20 to 50+ PDF Research Papers'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Supports IPCC Reports, Environmental Directives, ESG Frameworks (PDF up to 50MB)
            </p>
          </div>

          <button className="btn-violet" style={{ marginTop: '8px' }}>
            <Sparkles size={15} />
            <span>Select Local Research PDFs</span>
          </button>
        </label>
      </div>

      {/* Documents Data Table Box */}
      <div className="ui-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', items: 'center', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: 0 }} className="font-heading">
              Indexed Document Repository
            </h2>
            <span className="badge-purple">{filteredDocs.length} Documents</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '230px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by title..."
                className="form-input"
                style={{ paddingLeft: '32px', height: '36px', fontSize: '13px' }}
              />
            </div>
            <button className="btn-ghost-dark" style={{ fontSize: '13px' }}>
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            <AlertCircle size={26} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>No documents found in repository.</p>
            <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Drag and drop research papers into the upload box above to begin indexing.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Category</th>
                  <th>Total Pages</th>
                  <th>Indexed Chunks</th>
                  <th>Citation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={17} style={{ color: '#a78bfa', flexShrink: 0 }} />
                        <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>{doc.file_name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>Sustainability Policy</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{doc.total_pages} Pages</td>
                    <td style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '13px' }}>{doc.chunks_count} Vectors</td>
                    <td>
                      <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} />
                        Ready
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-ghost-dark" style={{ padding: '5px 9px', fontSize: '12px' }}>
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </div>
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
