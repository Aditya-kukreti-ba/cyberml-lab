import { Brain, TrendingUp, GitBranch, Cpu, Filter } from 'lucide-react';

const ALGORITHMS = [
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    icon: TrendingUp,
    type: 'classification',
    color: '#B87333',
    desc: 'Probabilistic linear classifier. Fast and interpretable.',
    complexity: 'Low',
  },
  {
    id: 'linear_regression',
    name: 'Linear Regression',
    icon: TrendingUp,
    type: 'regression',
    color: '#D6A94A',
    desc: 'Fits a linear relationship between features and target.',
    complexity: 'Low',
  },
  {
    id: 'svm',
    name: 'Support Vector Machine',
    icon: Filter,
    type: 'both',
    color: '#7E6BAE',
    desc: 'Finds the optimal decision boundary with maximum margin.',
    complexity: 'High',
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree',
    icon: GitBranch,
    type: 'both',
    color: '#8FAF7A',
    desc: 'Hierarchical rule-based model. Fully interpretable.',
    complexity: 'Medium',
  },
  {
    id: 'naive_bayes',
    name: 'Naive Bayes',
    icon: Brain,
    type: 'classification',
    color: '#B84A4A',
    desc: 'Probabilistic classifier based on Bayes theorem.',
    complexity: 'Low',
  },
];

export default function AlgorithmSelector({ problemType, selected, onSelect }) {
  const visible = ALGORITHMS.filter(
    (a) => a.type === 'both' || a.type === problemType
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {visible.map((algo) => {
        const Icon = algo.icon;
        const isSelected = selected === algo.id;
        return (
          <div
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              border: `1px solid ${isSelected ? algo.color : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: isSelected ? `${algo.color}14` : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: `${algo.color}22`,
                border: `1px solid ${algo.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: algo.color,
                flexShrink: 0,
              }}
            >
              <Icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: isSelected ? algo.color : 'var(--text-primary)' }}>
                  {algo.name}
                </span>
                <span className="badge" style={{ fontSize: '10px', padding: '1px 6px', background: `${algo.color}18`, color: algo.color, border: `1px solid ${algo.color}33` }}>
                  {algo.complexity} complexity
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{algo.desc}</p>
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${isSelected ? algo.color : 'var(--border-default)'}`,
                background: isSelected ? algo.color : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSelected && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
