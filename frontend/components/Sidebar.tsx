'use client';

import React from 'react';
import { 
  Layers, 
  MessageSquareText, 
  FileCheck2, 
  BarChart3, 
  Cpu, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: 'vault' | 'chat' | 'report' | 'analytics';
  setActiveView: (view: 'vault' | 'chat' | 'report' | 'analytics') => void;
  documentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  documentCount
}) => {
  const navItems = [
    {
      id: 'vault',
      label: 'Document Vault',
      icon: Layers,
      count: documentCount,
      desc: 'Batch Ingest 20-50+ PDFs'
    },
    {
      id: 'chat',
      label: 'Policy Q&A Canvas',
      icon: MessageSquareText,
      count: 'Strict',
      desc: 'Multi-Doc RAG Search'
    },
    {
      id: 'report',
      label: 'LangGraph Studio',
      icon: FileCheck2,
      count: 'Multi-Agent',
      desc: 'Autonomous Report Briefs'
    },
    {
      id: 'analytics',
      label: 'Citation Explorer',
      icon: BarChart3,
      count: 'Metrics',
      desc: 'Coverage & Compliance'
    }
  ];

  return (
    <aside className="sidebar-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '6px' }}>
          Workspace Views
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} style={{ color: isActive ? '#a78bfa' : '#64748b' }} />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '600', display: 'block', color: isActive ? '#fff' : '#cbd5e1' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <span className={isActive ? 'badge-purple' : 'badge-cyan'} style={{ fontSize: '11px' }}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c4b5fd', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
            <Cpu size={15} />
            <span>NVIDIA NIM Engine</span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, leading: '1.4' }}>
            Llama 3.1 70B & Embeddings QA-4 endpoints active.
          </p>
        </div>

        <div style={{ display: 'flex', items: 'center', justify: 'space-between', padding: '0 6px', fontSize: '13px', color: '#64748b' }}>
          <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Settings size={15} />
            <span>Settings</span>
          </button>
          <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <HelpCircle size={15} />
            <span>Docs</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
