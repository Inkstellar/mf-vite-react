import React from 'react';
import { Outlet, NavLink, Route, Routes } from 'react-router-dom';
import '../../design-system.css';
import { allnav } from '../../config/nav';
import Portfolio from '../../pages/Portfolio';
import Services from '../../pages/Services';
import Users from '../../pages/Users';
import NotFound from '../../pages/NotFound';
 
const RemoteLayout: React.FC = () => {
  const remoteNavItems = allnav;
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            Remote App
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
            Module Services
          </p>
        </div>
        <nav className="nav-menu">
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
                <div className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <div className="nav-text">{item.label}</div>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
      <main className="main-content">
        <div className="page-container fade-in">
        <Routes>
				<Route path="/services" element={<Services />} />
				<Route path="/portfolio" element={<Portfolio />} />
				<Route path="/users" element={<Users />} />
				{/* Default redirect for remote */}
        <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </main>
    </div>
  );
};

export default RemoteLayout;
