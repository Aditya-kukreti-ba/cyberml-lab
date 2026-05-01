import { useLocation, Link } from 'react-router-dom';
import { Menu, Home, ChevronRight } from 'lucide-react';

const PAGE_TITLES = {
  '/algorithms': { title: 'Algorithm Overview', subtitle: 'Explore 5 supervised learning algorithms' },
  '/dataset':    { title: 'Dataset Lab',         subtitle: 'Load, preview, and configure your data' },
  '/train':      { title: 'Model Training',       subtitle: 'Select an algorithm and train your model' },
  '/compare':    { title: 'Comparison Dashboard', subtitle: 'Side-by-side model performance analysis' },
  '/visuals':    { title: 'Visual Explanations',  subtitle: 'Interactive algorithm concept diagrams' },
  '/scenarios':  { title: 'Cyber Scenarios',      subtitle: 'Real-world cybersecurity use cases' },
};

export default function TopBar({ onMenuToggle }) {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'CyberML Lab', subtitle: '' };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        height: 'var(--topbar-height)',
        background: 'rgba(17, 19, 21, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        zIndex: 50,
        gap: 'var(--space-4)',
      }}
    >
      {/* Left: mobile menu + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuToggle}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Home size={14} />
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            {page.title}
          </span>
        </nav>
      </div>

      {/* Right: subtitle */}
      {page.subtitle && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {page.subtitle}
        </span>
      )}
    </header>
  );
}
