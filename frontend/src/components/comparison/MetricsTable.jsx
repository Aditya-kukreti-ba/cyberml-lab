import { Trophy, TrendingUp } from 'lucide-react';

const ALGO_LABELS = {
  logistic_regression: 'Logistic Regression',
  linear_regression: 'Linear Regression',
  svm: 'SVM',
  decision_tree: 'Decision Tree',
  naive_bayes: 'Naive Bayes',
};

export default function MetricsTable({ results, problemType }) {
  if (!results || results.length === 0) return null;

  const isClass = problemType === 'classification';

  const metrics = isClass
    ? ['accuracy', 'precision', 'recall', 'f1_score']
    : ['mae', 'mse', 'rmse', 'r2'];

  const metricLabels = isClass
    ? { accuracy: 'Accuracy', precision: 'Precision', recall: 'Recall', f1_score: 'F1 Score' }
    : { mae: 'MAE', mse: 'MSE', rmse: 'RMSE', r2: 'R²' };

  function getValue(result, metric) {
    const src = isClass ? result.classification_metrics : result.regression_metrics;
    return src?.[metric] ?? null;
  }

  function getBest(metric) {
    const vals = results.map((r) => ({ algo: r.algorithm, val: getValue(r, metric) })).filter((x) => x.val !== null);
    if (vals.length === 0) return null;
    const lowerBetter = ['mae', 'mse', 'rmse'].includes(metric);
    return lowerBetter
      ? vals.reduce((a, b) => (a.val < b.val ? a : b)).algo
      : vals.reduce((a, b) => (a.val > b.val ? a : b)).algo;
  }

  const bests = Object.fromEntries(metrics.map((m) => [m, getBest(m)]));

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Train Time</th>
            {metrics.map((m) => (
              <th key={m}>{metricLabels[m]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.filter((r) => r.success).map((result) => (
            <tr key={result.algorithm}>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                {ALGO_LABELS[result.algorithm] || result.algorithm}
              </td>
              <td>{result.training_time_seconds.toFixed(3)}s</td>
              {metrics.map((metric) => {
                const val = getValue(result, metric);
                const isBest = bests[metric] === result.algorithm;
                const isPercent = isClass;
                return (
                  <td key={metric}>
                    <span style={{ color: isBest ? 'var(--accent-amber)' : 'var(--text-secondary)', fontWeight: isBest ? 700 : 400 }}>
                      {val !== null ? (isPercent ? `${(val * 100).toFixed(2)}%` : val.toFixed(4)) : '—'}
                    </span>
                    {isBest && <Trophy size={12} style={{ color: 'var(--accent-amber)', marginLeft: 4 }} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
