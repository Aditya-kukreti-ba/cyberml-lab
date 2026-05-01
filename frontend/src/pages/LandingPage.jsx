import { Link } from 'react-router-dom';
import { Shield, Brain, BarChart2, Database, Eye, Target, ArrowRight, Cpu, TrendingUp, GitBranch, Filter } from 'lucide-react';

const FEATURES = [
  { icon: Database, title: 'Real Datasets', desc: 'Built-in NSL-KDD, phishing URL, and network anomaly datasets — plus upload your own CSV.' },
  { icon: Brain, title: '5 Algorithms', desc: 'Logistic Regression, Linear Regression, SVM, Decision Tree, and Naive Bayes — all real scikit-learn implementations.' },
  { icon: BarChart2, title: 'Side-by-Side Comparison', desc: 'Train multiple models simultaneously and compare accuracy, F1, AUC-ROC, and regression metrics in one dashboard.' },
  { icon: Eye, title: 'Visual Explanations', desc: 'Interactive SVG diagrams that illustrate how each algorithm works — designed for learners.' },
  { icon: Target, title: 'Cyber Scenarios', desc: 'Guided walkthroughs for intrusion detection, phishing classification, anomaly scoring, and more.' },
  { icon: Shield, title: 'Security-First Design', desc: 'All datasets, scenarios, and examples are grounded in real cybersecurity workflows and threat models.' },
];

const ALGO_PREVIEW = [
  { id: 'logistic_regression', name: 'Logistic Regression', icon: TrendingUp, color: '#B87333', type: 'Classification' },
  { id: 'linear_regression',  name: 'Linear Regression',   icon: TrendingUp, color: '#D6A94A', type: 'Regression'     },
  { id: 'svm',                name: 'SVM',                  icon: Filter,     color: '#7E6BAE', type: 'Both'           },
  { id: 'decision_tree',      name: 'Decision Tree',        icon: GitBranch,  color: '#8FAF7A', type: 'Both'           },
  { id: 'naive_bayes',        name: 'Naive Bayes',          icon: Brain,      color: '#B84A4A', type: 'Classification' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800 }} className="page-enter">
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-amber)', background: 'rgba(184,115,51,0.08)', letterSpacing: '0.06em' }}>
            <Shield size={14} />
            AI-POWERED CYBERSECURITY ML LAB
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 'var(--space-6)', letterSpacing: '-0.03em' }}>
            Train & Compare{' '}
            <span className="gradient-text">Supervised Learning</span>
            <br />
            on Real Cyber Datasets
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto var(--space-10)', lineHeight: 1.7 }}>
            An interactive lab for exploring classical ML algorithms on cybersecurity datasets.
            Upload your CSV, configure preprocessing, train models, and compare performance — no code required.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dataset" className="btn btn-primary btn-lg">
              Start Experiment <ArrowRight size={18} />
            </Link>
            <Link to="/algorithms" className="btn btn-secondary btn-lg">
              Explore Algorithms
            </Link>
            <Link to="/scenarios" className="btn btn-ghost btn-lg">
              View Scenarios
            </Link>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'center', marginTop: 'var(--space-16)', flexWrap: 'wrap' }}>
            {[
              { val: '5', label: 'Algorithms' },
              { val: '3', label: 'Built-in Datasets' },
              { val: '3K', label: 'Training Rows' },
              { val: '∞', label: 'Your CSVs' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>{val}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 'var(--space-1)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Algorithm Preview ───────────────────────────────── */}
      <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'rgba(17,19,21,0.5)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            Five Algorithms. One Unified Lab.
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto var(--space-10)' }}>
            From probabilistic classifiers to max-margin hyperplanes — all backed by real scikit-learn implementations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {ALGO_PREVIEW.map(({ id, name, icon: Icon, color, type }) => (
              <Link key={id} to="/algorithms" style={{ textDecoration: 'none' }}>
                <div
                  className="glass-card"
                  style={{ padding: 'var(--space-5)', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${color}1a`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{name}</div>
                    <span className="badge" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: '10px' }}>{type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────── */}
      <section style={{ padding: 'var(--space-16) var(--space-8)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            Everything You Need in One Lab
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto var(--space-10)' }}>
            Designed for cybersecurity students, practitioners, and researchers who want to learn ML hands-on.
          </p>
          <div className="grid-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(184,115,51,0.1)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-copper)', marginBottom: 'var(--space-4)' }}>
                  <Icon size={22} />
                </div>
                <h5 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>{title}</h5>
                <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'rgba(184,115,51,0.05)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Train Your First Model?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
            Load the built-in NSL-KDD intrusion detection dataset in one click and have a trained classifier with metrics in under 30 seconds.
          </p>
          <Link to="/dataset" className="btn btn-primary btn-lg">
            Open Dataset Lab <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ padding: 'var(--space-8)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--accent-copper), var(--accent-amber))', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={14} style={{ color: 'var(--text-inverse)' }} />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>CyberML Lab</span>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
          AI-Powered Cybersecurity Machine Learning Laboratory · Built with FastAPI + React
        </p>
      </footer>
    </div>
  );
}
