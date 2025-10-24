import React, { useState, useEffect, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { allNav } from './nav';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  section?: string;
}

interface RemoteConfig {
  name: string;
  version: string;
  navigation: NavigationItem[];
  routes: string[];
}

const DynamicNavigation: React.FC = () => {
  const [remoteNavItems, setRemoteNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRemoteConfig = async () => {
      try {
        setLoading(true);

        // Fetch navigation items from JSON server instead of remote module
        const response = await fetch('http://localhost:3001/allNav');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const navigationItems = await response.json();

        setRemoteNavItems(navigationItems);
        setError(null);
      } catch (err) {
        console.error('Failed to load remote navigation config:', err);
        setError('Failed to load remote navigation');
        // Fallback to default items if remote config fails
        setRemoteNavItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadRemoteConfig();
  }, []);

  const hostNavItems: any[] = allNav;

  const renderIcon = (icon: string | React.ReactElement) => {
    if (typeof icon === 'string') {
      return <div style={{ width: '24px', height: '24px' }} dangerouslySetInnerHTML={{ __html: icon }} />;
    }
    return icon;
  };

  if (loading) {
    return (
      <div className="nav-section">
        <div className="nav-section-title">Loading Navigation...</div>
        <div className="nav-item" style={{ opacity: 0.6 }}>
          <div className="nav-text">Loading remote navigation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Remote navigation error:', error);
  }

  return (
    <>
      {/* Host Navigation Section */}
      <div className="nav-section">
        <div className="nav-section-title">Host Navigation</div>
        {hostNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-icon">{renderIcon(item.icon)}</div>
            <div className="nav-text">{item.label}</div>
          </NavLink>
        ))}
      </div>

      {/* Remote Navigation Section */}
      {remoteNavItems.length > 0 && (
        <div className="nav-section">
          <div className="nav-section-title">Remote Navigation</div>
          {remoteNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-icon">{renderIcon(item.icon)}</div>
              <div className="nav-text">{item.label}</div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default DynamicNavigation;
