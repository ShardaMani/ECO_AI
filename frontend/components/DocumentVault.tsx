'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Layers, Loader2 } from 'lucide-react';

interface DocumentVaultProps {
  documents: Array<{ file_name: string; total_pages: number; chunks_count: number }>;
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
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

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-medium tracking-tight text-white font-geist">
          Multi-Document Vault
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Batch upload up to 50+ research papers, climate benchmarks, or policy frameworks. Automatically indexed with fine-grained page & paragraph citations.
        </p>
      </div>

      {/* Batch Ingestion Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-10 text-center transition-all cursor-pointer rounded-3xl ${
          dragActive ? 'border-violet-500 bg-violet-500/10' : 'hover:border-white/30'
        }`}
        style={{
          backgroundColor: 'rgba(212, 212, 212, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1.5px dashed rgba(229, 229, 229, 0.2)'
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
        <label htmlFor="file-upload-input" className="cursor-pointer block space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white shadow-inner">
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
            ) : (
              <Upload className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-white">
              {isUploading ? 'Processing & Indexing Papers...' : 'Drop 20 to 50+ PDF Research Papers Here'}
            </p>
            <p className="text-xs text-gray-400">
              Supports IPCC reports, UN SDGs, National Policy Frameworks (Max 50MB per file)
            </p>
          </div>
          <div className="pt-2">
            <span className="pill-btn-white text-xs">
              Browse Local Files
            </span>
          </div>
        </label>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Indexed Resource Vault ({documents.length})</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">Page & Paragraph Markers Ready</span>
        </div>

        {documents.length === 0 ? (
          <div 
            className="p-8 text-center text-gray-500 text-sm rounded-2xl"
            style={{
              backgroundColor: '#161616',
              border: '1px solid rgba(229, 229, 229, 0.12)'
            }}
          >
            No papers uploaded yet. Drag and drop research PDFs above to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between rounded-2xl transition-all hover:border-white/30"
                style={{
                  backgroundColor: '#161616',
                  border: '1px solid rgba(229, 229, 229, 0.12)'
                }}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{doc.file_name}</p>
                    <p className="text-xs text-gray-400">
                      {doc.total_pages} Pages · {doc.chunks_count} Vectors Indexed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Indexed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
