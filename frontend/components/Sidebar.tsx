'use client';

import React from 'react';
import { Database, MessageSquare, FileText, BarChart3, Shield, ArrowUpRight } from 'lucide-react';

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
  const menuItems = [
    {
      id: 'vault',
      label: 'Document Vault',
      icon: Database,
      badge: `${documentCount} Active`,
      description: 'Ingest 20-50+ papers'
    },
    {
      id: 'chat',
      label: 'Policy Q&A Canvas',
      icon: MessageSquare,
      badge: 'Citation RAG',
      description: 'Interactive evidence query'
    },
    {
      id: 'report',
      label: 'LangGraph Studio',
      icon: FileText,
      badge: 'Parallel 60s',
      description: 'Multi-agent report compiler'
    },
    {
      id: 'analytics',
      label: 'Corpus Analytics',
      icon: BarChart3,
      badge: 'Telemetry',
      description: 'Vector density metrics'
    }
  ];

  return (
    <aside className="sidebar-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workspace Modules
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} style={{ color: isActive ? '#a78bfa' : '#94a3b8' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600', display: 'block', color: isActive ? '#fff' : '#cbd5e1' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {item.description}
                  </span>
                </div>
              </div>

              <span className={isActive ? 'badge-purple' : 'badge-cyan'} style={{ fontSize: '11px', padding: '2px 8px' }}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Info Card */}
      <div className="ui-box" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(15, 23, 42, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: '600' }}>
          <Shield size={14} />
          <span>Universal Citation Mandate</span>
        </div>
        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>
          100% of LLM outputs are audited against vector store chunks with verified inline source tags [Doc, p. X].
        </p>
      </div>
    </aside>
  );
};
