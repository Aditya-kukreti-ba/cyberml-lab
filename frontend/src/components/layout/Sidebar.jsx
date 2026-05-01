import { NavLink } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Database, Brain, BarChart2,
  Eye, Target, ChevronLeft, ChevronRight, Cpu
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Algorithms', icon: Brain, to: '/algorithms', section: 'Learn' },
  { label: 'Dataset Lab', icon: Database, to: '/dataset', section: 'Experiment' },
  { label: 'Train Model', icon: Cpu, to: '/train', section: 'Experiment' },
  { label: 'Compare', icon: BarChart2, to: '/compare', section: 'Experiment' },
  { label: 'Visuals', icon: Eye, to: '/visuals', section: 'Explore' },
  { label: 'Scenarios', icon: Target, to: '/scenarios', section: 'Explore' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const sections = [...new Set(NAV_ITEMS.map((i) => i.section))];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Shield size={18} />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">CyberML Lab</span>
            <span className="sidebar-logo-tagline">v1.0.0</span>
          </div>
        </NavLink>
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {NAV_ITEMS.filter((i) => i.section === section).map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                title={collapsed ? label : undefined}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">AI-Powered Cybersecurity ML</div>
      </div>
    </aside>
  );
}
