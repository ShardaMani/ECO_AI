'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Database, Cpu, Search, Bell, User } from 'lucide-react';

interface NavbarProps {
  documentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ documentCount }) => {
  return (
    <header className="navbar-container">
      {/* Brand & Workspace Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(124,58,237,0.4)'
          }}>
            <Sparkles size={19} />
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
              EcoResearch <span style={{ color: '#a78bfa' }}>AI</span>
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '-2px 0 0 0' }}>
              Policy & Sustainability Workspace
            </span>
          </div>
        </div>

        <div className="badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} />
          <span>Active Vault: {documentCount} Papers</span>
        </div>
      </div>

      {/* Global Search Bar Form */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '320px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search papers, policies, regulations..."
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Right Badges & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={13} />
          <span>NVIDIA NIM Llama-3.1 70B</span>
        </div>

        <div className="badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} />
          <span>100% Citation Audit Active</span>
        </div>

        <button style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Bell size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '600',
            fontSize: '13px'
          }}>
            <User size={17} />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', margin: 0 }}>Policy Advisor</p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Sustainability Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
};
