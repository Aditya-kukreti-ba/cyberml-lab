import { useState } from 'react';
import { Shield, Link, Activity, Bug, UserX, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import { SCENARIOS } from '../data/scenarios.js';

const ICON_MAP = { Shield, Link, Activity, Bug, UserX };

const DIFFICULTY_COLORS = {
  Beginner:     { color: 'var(--accent-sage)',   bg: 'rgba(143,175,122,0.12)'  },
  Intermediate: { color: 'var(--accent-amber)',  bg: 'rgba(214,169,74,0.12)'  },
  Advanced:     { color: 'var(--danger)',         bg: 'rgba(184,74,74,0.12)'   },
};

const ALGO_LABELS = {
  logistic_regression: 'Logistic Regression',
  linear_regression:   'Linear Regression',
  svm:                 'SVM',
  decision_tree:       'Decision Tree',
  naive_bayes:         'Naive Bayes',
};

function ScenarioCard({ scenario }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[scenario.icon] || Shield;
  const difficulty = DIFFICULTY_COLORS[scenario.difficulty] || DIFFICULTY_COLORS.Beginner;

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Card header */}
      <div
        style={{ padding: 'var(--space-6)', cursor: 'pointer', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: `${scenario.color}18`, border: `1px solid ${scenario.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: scenario.color, flexShrink: 0 }}>
          <Icon size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
            <h4 style={{ margin: 0, color: scenario.color }}>{scenario.title}</h4>
            <span className="badge" style={{ background: `${scenario.color}15`, color: scenario.color, border: `1px solid ${scenario.color}30` }}>
              {scenario.badge}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: difficulty.bg, color: difficulty.color }}>
              {scenario.difficulty}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{scenario.summary}</p>
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {scenario.tags.map((tag) => (
              <span key={tag} style={{ fontSize: '10px', padding: '1px 7px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}>{tag}</span>
            ))}
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform var(--transition-base)', flexShrink: 0 }} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Context */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Context</p>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>{scenario.context}</p>
          </div>

          {/* Dataset & target */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(17,19,21,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 var(--space-1)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dataset</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>{scenario.dataset}</p>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(17,19,21,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 var(--space-1)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Column</p>
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{scenario.target}</code>
            </div>
          </div>

          {/* Recommended algorithms */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Recommended Algorithms</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {scenario.recommendedAlgorithms.map((algoId) => (
                <span
                  key={algoId}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    border: `1px solid ${algoId === scenario.primaryAlgorithm ? scenario.color : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: algoId === scenario.primaryAlgorithm ? 700 : 400,
                    color: algoId === scenario.primaryAlgorithm ? scenario.color : 'var(--text-secondary)',
                    background: algoId === scenario.primaryAlgorithm ? `${scenario.color}15` : 'transparent',
                  }}
                >
                  {algoId === scenario.primaryAlgorithm ? '★ ' : ''}{ALGO_LABELS[algoId] || algoId}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)', margin: 'var(--space-2) 0 0' }}>
              <strong style={{ color: 'var(--accent-amber)' }}>Why {ALGO_LABELS[scenario.primaryAlgorithm]}?</strong> {scenario.reasoning}
            </p>
          </div>

          {/* Step-by-step walkthrough */}
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
              <BookOpen size={12} style={{ display: 'inline', marginRight: 6 }} />Step-by-Step Workflow
            </p>
            {scenario.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${scenario.color}18`, border: `1px solid ${scenario.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: scenario.color, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Metrics to watch */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Key Metrics</p>
              {scenario.metrics.map((m) => (
                <div key={m} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'center' }}>
                  <CheckCircle size={12} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{m}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: 'var(--space-4)', background: `${scenario.color}08`, border: `1px solid ${scenario.color}20`, borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: scenario.color, margin: '0 0 var(--space-2)' }}>Real-World Impact</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{scenario.realWorldImpact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CyberScenarios() {
  return (
    <div className="page-enter">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Cybersecurity Scenarios</h2>
        <p>Guided walkthroughs showing how supervised learning is applied to real security challenges. Click a scenario to see the full workflow.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {SCENARIOS.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
