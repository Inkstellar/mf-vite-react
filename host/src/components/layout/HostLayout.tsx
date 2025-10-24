import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import DynamicNavigation from './DynamicNavigation';
import UserMenu from './UserMenu';
import ProtectedRoute from '../../auth/ProtectedRoute';
import { useAuth } from '../../auth/AuthContext';
import '../../design-system.css';
import Home from '../../pages/Home';
import About from '../../pages/About';
import Admin from '../../pages/Admin';
import NotFound from '../../pages/NotFound';
import Login from '../../auth/Login';
import Register from '../../auth/Register';
import Activation from '../../auth/Activation';
import ForgetPassword from '../../auth/ForgetPassword';



// Lazy load remote routes
const RemoteServices = lazy(() =>
  // @ts-ignore
  import('remote/Services').then(module => ({ default: module.default }))
);

const RemotePortfolio = lazy(() =>
  // @ts-ignore
  import('remote/Portfolio').then(module => ({ default: module.default }))
);

const RemoteUsers = lazy(() =>
  // @ts-ignore
  import('remote/Users').then(module => ({ default: module.default }))
);
const HostLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            Host App
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
            Module Federation Demo
          </p>
        </div>
        <nav className="nav-menu">
          <DynamicNavigation />
        </nav>
        <UserMenu />
      </aside>
      <main className="main-content">
        <div className="page-container fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            {/* Authentication routes - only accessible when not authenticated */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />
            <Route path="/activate" element={<Activation />} />
            <Route path="/forgot-password" element={
              <ProtectedRoute requireAuth={false}>
                <ForgetPassword />
              </ProtectedRoute>
            } />
            {/* Federated routes from remote */}
            <Route path="/services" element={
              <Suspense fallback={<div className="loading">Loading remote services...</div>}>
                <RemoteServices />
              </Suspense>
            } />
            <Route path="/portfolio" element={
              <Suspense fallback={<div className="loading">Loading remote portfolio...</div>}>
                <RemotePortfolio />
              </Suspense>
            } />
             <Route path="/users" element={
              <Suspense fallback={<div className="loading">Loading remote users...</div>}>
                <RemoteUsers />
              </Suspense>
            } />
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default HostLayout;
