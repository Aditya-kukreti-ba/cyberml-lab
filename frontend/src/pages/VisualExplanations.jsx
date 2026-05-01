import { useState } from 'react';
import { Eye } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import AlgorithmVisual from '../components/visualizations/AlgorithmVisual.jsx';
import { ALGORITHMS } from '../data/algorithms.js';

const INSIGHTS = {
  logistic_regression: [
    'The sigmoid curve compresses any real number to a probability in [0, 1].',
    'The decision boundary is linear — a straight line (or hyperplane in higher dimensions).',
    'Points far from the boundary are classified with high confidence.',
    'The weight of each feature tells you its contribution to the log-odds of the prediction.',
  ],
  linear_regression: [
    'The line minimizes the sum of squared vertical distances from each point to the line.',
    'Each coefficient tells you: for a 1-unit increase in this feature, the target increases by this much.',
    'R² measures how much variance in the target is explained by the model (1.0 = perfect).',
    'Residuals (actual − predicted) should be randomly scattered — patterns indicate model problems.',
  ],
  svm: [
    'Only the "support vectors" (points closest to the boundary) define the model — other points are irrelevant.',
    'Maximizing margin reduces overfitting — wider margins generalize better.',
    'The RBF kernel maps data into infinite-dimensional space, allowing non-linear boundaries.',
    'Parameter C trades off margin width vs. training error — higher C fits training data more closely.',
  ],
  decision_tree: [
    'Each internal node asks a yes/no question about one feature.',
    'The tree greedily picks the question that best separates the classes at each step.',
    'Leaf nodes contain the final prediction — either a class label or a mean value.',
    'Overfitting happens when trees are too deep — max_depth is your primary control.',
  ],
  naive_bayes: [
    'The "naive" assumption is that all features are conditionally independent given the class.',
    'Despite this assumption rarely being true, the classifier is robust and often competitive.',
    'Each bell curve shows the probability distribution of one feature for one class.',
    'At prediction time, multiply all the individual probabilities together (or add log-probabilities).',
  ],
};

export default function VisualExplanations() {
  const [active, setActive] = useState(ALGORITHMS[0].id);
  const algo = ALGORITHMS.find((a) => a.id === active);

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Visual Algorithm Explanations</h2>
        <p>Interactive diagrams to build intuition for how each algorithm works — designed for learners.</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {ALGORITHMS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              border: `1px solid ${active === a.id ? a.color : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              background: active === a.id ? `${a.color}18` : 'transparent',
              color: active === a.id ? a.color : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: active === a.id ? 700 : 400,
              transition: 'all var(--transition-fast)',
            }}
          >
            {a.name}
          </button>
        ))}
      </div>

      {algo && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Diagram */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Eye size={18} style={{ color: algo.color }} />
              <h4 style={{ margin: 0, color: algo.color }}>{algo.name}</h4>
            </div>
            <AlgorithmVisual algorithm={algo.id} />
          </Card>

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Card>
              <h5 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Key Concepts</h5>
              {INSIGHTS[algo.id]?.map((insight, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-3)',
                    background: 'rgba(17,19,21,0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: `3px solid ${algo.color}`,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: algo.color, fontWeight: 700, flexShrink: 0, width: 20 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight}</span>
                </div>
              ))}
            </Card>

            <Card flat style={{ padding: 'var(--space-5)' }}>
              <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>How It Works</h5>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>{algo.howItWorks}</p>
            </Card>

            <Card flat style={{ padding: 'var(--space-5)' }}>
              <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-copper)' }}>Cybersecurity Applications</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {algo.cybersecurityUse.map((use) => (
                  <span key={use} className="badge badge-copper">{use}</span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
