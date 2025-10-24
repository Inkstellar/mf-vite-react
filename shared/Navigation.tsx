import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavigationProps {
  type?: 'host' | 'remote';
}

const Navigation: React.FC<NavigationProps> = ({ type = 'host' }) => {
  const location = useLocation();

  const hostNavItems = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
    },
    {
      path: '/about',
      label: 'About',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
    },
  ];

  const remoteNavItems = [
    {
      path: '/services',
      label: 'Services',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
    },
    {
      path: '/portfolio',
      label: 'Portfolio',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      ),
    },
  ];

  const navItems = type === 'host' ? hostNavItems : remoteNavItems;

  return (
    <nav className="nav-menu">
      <div className="nav-section">
        <div className="nav-section-title">
          {type === 'host' ? 'Host Navigation' : 'Remote Navigation'}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-text">{item.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
