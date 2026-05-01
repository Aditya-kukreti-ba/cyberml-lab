import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Cpu, Eye } from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms.js';
import AlgorithmVisual from '../components/visualizations/AlgorithmVisual.jsx';

function ComplexityBadge({ level }) {
  const colors = { Low: 'var(--accent-sage)', Medium: 'var(--accent-amber)', High: 'var(--danger)' };
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: colors[level] || 'var(--text-muted)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: `1px solid ${colors[level]}44`, background: `${colors[level]}15` }}>
      {level}
    </span>
  );
}

function AlgorithmCard({ algo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="glass-card"
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header */}
      <div style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: `${algo.color}18`, border: `1px solid ${algo.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: algo.color, flexShrink: 0, fontSize: 22 }}>
          {algo.type === 'both' ? '⟷' : algo.type === 'classification' ? '◆' : '◇'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
            <h4 style={{ margin: 0, color: algo.color, fontSize: 'var(--text-lg)' }}>{algo.name}</h4>
            <span className="badge" style={{ background: `${algo.color}18`, color: algo.color, border: `1px solid ${algo.color}33` }}>
              {algo.type === 'both' ? 'Classification + Regression' : algo.type.charAt(0).toUpperCase() + algo.type.slice(1)}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontStyle: 'italic' }}>{algo.tagline}</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <Cpu size={12} /> Complexity: <ComplexityBadge level={algo.complexity} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <Clock size={12} /> Speed: <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{algo.trainingSpeed}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <Eye size={12} /> Interpretable: <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{algo.interpretability}</span>
            </div>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div onClick={(e) => e.stopPropagation()} style={{ padding: '0 var(--space-6) var(--space-6)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Visual diagram */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Visual Concept</p>
            <AlgorithmVisual algorithm={algo.id} />
          </div>

          {/* Description */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Description</p>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>{algo.description}</p>
          </div>

          {/* How it works */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>How It Works</p>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>{algo.howItWorks}</p>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-sage)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Strengths</p>
              {algo.strengths.map((s) => (
                <div key={s} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent-sage)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Weaknesses</p>
              {algo.weaknesses.map((w) => (
                <div key={w} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <XCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cybersecurity use cases */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-copper)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Cybersecurity Applications</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {algo.cybersecurityUse.map((use) => (
                <span key={use} className="badge badge-copper">{use}</span>
              ))}
            </div>
          </div>

          {/* When to use / avoid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(143,175,122,0.08)', border: '1px solid rgba(143,175,122,0.2)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-sage)', margin: '0 0 var(--space-2)' }}>✓ Use When</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{algo.whenToUse}</p>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--danger-muted)', border: '1px solid rgba(184,74,74,0.2)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--danger)', margin: '0 0 var(--space-2)' }}>✗ Avoid When</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{algo.whenToAvoid}</p>
            </div>
          </div>

          {/* Hyperparameters */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Key Hyperparameters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {algo.hyperparameters.map((hp) => (
                <div key={hp.name} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(17,19,21,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent-amber)', minWidth: 80 }}>{hp.name}</code>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{hp.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlgorithmOverview() {
  return (
    <div className="page-enter">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Algorithm Overview</h2>
        <p>Click any algorithm card to expand its full description, visual diagram, strengths, weaknesses, and cybersecurity applications.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {ALGORITHMS.map((algo) => (
          <AlgorithmCard key={algo.id} algo={algo} />
        ))}
      </div>
    </div>
  );
}
