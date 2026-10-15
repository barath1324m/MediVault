import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="mobile-nav-toggle" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <Menu size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Welcome, {user?.name?.split(' ')[0] || 'Patient'}</span>
            <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
              <ShieldCheck size={12} /> Secure
            </span>
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Personal Medical Record Management
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/visits/new" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>Add Visit</span>
        </Link>
      </div>
    </header>
  );
}
