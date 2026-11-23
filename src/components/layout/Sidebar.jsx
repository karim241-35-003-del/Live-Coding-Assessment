import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  LogOut,
  Wrench,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/new-complaint',
      label: 'New Customer',
      icon: UserPlus,
      badge: 'Registration'
    },
    {
      to: '/customers',
      label: 'Customer Records',
      icon: Users
    },
    {
      to: '/complaints',
      label: 'Complaint History',
      icon: ClipboardList
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar no-print ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand-box">
          <div className="sidebar-brand-icon">
            <Wrench size={22} />
          </div>
          <div className="sidebar-brand-info">
            <span className="brand-name">Jamal's Care</span>
            <span className="brand-module">Fault & Complaint Intake</span>
          </div>
        </div>

        <div className="sidebar-nav-container">
          <div className="nav-section-label">MAIN MENU</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={19} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="nav-section-label">SYSTEM INFO</div>
          <div className="sidebar-info-card">
            <div className="info-card-header">
              <span className="indicator-online"></span>
              <strong>Station #01 - Active</strong>
            </div>
            <p className="info-card-text">
              Appliance Diagnostic Intake & Customer Service Terminal
            </p>
            <div className="info-card-user">
              Logged in as: <strong>{user?.email || 'admin@jamal.com'}</strong>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-sidebar-logout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
