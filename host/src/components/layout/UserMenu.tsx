import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const UserMenu: React.FC = () => {
  const { state, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!state.isAuthenticated || !state.user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '#dc3545';
      case 'manager':
        return '#fd7e14';
      case 'developer':
        return '#20c997';
      case 'designer':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="user-menu">
      <div className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="user-avatar">
          {getInitials(state.user.firstName, state.user.lastName)}
        </div>
        <div className="user-info">
          <div className="user-name">
            {state.user.firstName} {state.user.lastName}
          </div>
          <div className="user-role" style={{ color: getRoleColor(state.user.role) }}>
            {state.user.role}
          </div>
        </div>
        <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7,10L12,15L17,10H7Z"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-item" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z"/>
            </svg>
            Sign Out
          </div>
        </div>
      )}

      <style>{`
        .user-menu {
          position: relative;
          margin-top: auto;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-menu-trigger:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color) 0%, #2c5aa0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          margin-right: 12px;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .dropdown-arrow {
          color: rgba(255, 255, 255, 0.7);
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-arrow svg {
          width: 16px;
          height: 16px;
        }

        .user-menu-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-bottom: 8px;
          overflow: hidden;
          z-index: 1000;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .user-menu-item:hover {
          background-color: #f8f9fa;
        }

        .user-menu-item svg {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: #dc3545;
        }

        @media (max-width: 768px) {
          .user-menu-trigger {
            padding: 12px 16px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
            margin-right: 8px;
          }

          .user-name {
            font-size: 0.8rem;
          }

          .user-role {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
