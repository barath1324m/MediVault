import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, PlusCircle, HeartPulse, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand-header">
          <div className="brand-icon-box">
            <HeartPulse size={24} />
          </div>
          <div>
            <div className="brand-title">MediVault</div>
            <div className="brand-subtitle">Health Tracker</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/visits"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <History size={20} />
            <span>Medical History</span>
          </NavLink>

          <NavLink
            to="/visits/new"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <PlusCircle size={20} />
            <span>Add Medical Visit</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="user-info-text">
              <div className="user-name" title={user?.name}>{user?.name || 'Patient'}</div>
              <div className="user-email" title={user?.email}>{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="logout-icon-btn"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
