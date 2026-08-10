'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DocumentVaultView } from '../components/DocumentVaultView';
import { PolicyChatView } from '../components/PolicyChatView';
import { ReportStudioView } from '../components/ReportStudioView';
import { AnalyticsView } from '../components/AnalyticsView';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Home() {
  const [activeView, setActiveView] = useState<'vault' | 'chat' | 'report' | 'analytics'>('vault');
  const [documents, setDocuments] = useState<Array<{ file_name: string; total_pages: number; chunks_count: number }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/list`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.log('Backend server not connected yet.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        await fetchDocuments();
      } else {
        alert('Failed to upload files. Please check backend logs.');
      }
    } catch (e) {
      alert(`Error uploading files. Make sure the backend server is running on ${API_BASE_URL}.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar documentCount={documents.length} />

      {/* Main Workspace (Sidebar + Workspace Canvas) */}
      <div className="workspace-layout">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          documentCount={documents.length}
        />

        {/* Right Main Content Canvas */}
        <main className="main-content">
          {activeView === 'vault' && (
            <DocumentVaultView
              documents={documents}
              onUpload={handleUpload}
              isUploading={isUploading}
            />
          )}

          {activeView === 'chat' && (
            <PolicyChatView documents={documents} />
          )}

          {activeView === 'report' && (
            <ReportStudioView documents={documents} />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView documents={documents} />
          )}
        </main>
      </div>
    </div>
  );
}
