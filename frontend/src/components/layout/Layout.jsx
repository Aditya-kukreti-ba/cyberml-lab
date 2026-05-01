import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
      />

      {/* Main content shifts right by sidebar width */}
      <div
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left var(--transition-base)',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <TopBar onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main
          style={{
            flex: 1,
            padding: 'var(--space-6) var(--space-8)',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            overflowX: 'hidden',
          }}
          className="page-enter"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
