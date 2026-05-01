import { useState } from 'react';
import { BarChart2, Play, AlertCircle, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import MetricsTable from '../components/comparison/MetricsTable.jsx';
import ConfusionMatrix from '../components/comparison/ConfusionMatrix.jsx';
import ROCCurve from '../components/comparison/ROCCurve.jsx';
import ResidualsPlot from '../components/comparison/ResidualsPlot.jsx';
import PredVsActual from '../components/comparison/PredVsActual.jsx';
import { useDataset } from '../hooks/useDataset.js';
import { compareModels } from '../api/client.js';

const ALGO_OPTIONS = [
  { id: 'logistic_regression', label: 'Logistic Regression', type: 'classification' },
  { id: 'linear_regression',   label: 'Linear Regression',   type: 'regression'     },
  { id: 'svm',                 label: 'SVM',                  type: 'both'           },
  { id: 'decision_tree',       label: 'Decision Tree',        type: 'both'           },
  { id: 'naive_bayes',         label: 'Naive Bayes',          type: 'classification' },
];

const ALGO_COLORS = {
  logistic_regression: '#B87333',
  linear_regression:   '#D6A94A',
  svm:                 '#7E6BAE',
  decision_tree:       '#8FAF7A',
  naive_bayes:         '#B84A4A',
};

export default function ComparisonDashboard() {
  const dataset = useDataset();
  const [selected, setSelected] = useState(new Set());
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const available = ALGO_OPTIONS.filter(
    (a) => a.type === 'both' || a.type === dataset.problemType
  );

  function toggleAlgo(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleCompare() {
    if (!dataset.isReady || selected.size === 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await compareModels({
        dataset_id: dataset.datasetId,
        target_column: dataset.targetColumn,
        feature_columns: dataset.featureColumns,
        algorithms: [...selected],
        problem_type: dataset.problemType,
        ...dataset.preprocessingConfig,
      });
      setResults(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function buildBarData() {
    if (!results) return [];
    const isClass = results.problem_type === 'classification';
    return results.results
      .filter((r) => r.success)
      .map((r) => {
        const m = isClass ? r.classification_metrics : r.regression_metrics;
        const label = r.algorithm.replace(/_/g, ' ');
        return isClass
          ? { name: label, Accuracy: +(m?.accuracy * 100).toFixed(1), Precision: +(m?.precision * 100).toFixed(1), Recall: +(m?.recall * 100).toFixed(1), 'F1 Score': +(m?.f1_score * 100).toFixed(1) }
          : { name: label, MAE: +m?.mae.toFixed(4), RMSE: +m?.rmse.toFixed(4), 'R²': +m?.r2.toFixed(4) };
      });
  }

  if (!dataset.isReady) {
    return (
      <div className="page-enter">
        <EmptyState
          icon={BarChart2}
          title="No Dataset Configured"
          description="Go to Dataset Lab first to load a dataset and configure your columns."
          actionLabel="Open Dataset Lab"
          actionTo="/dataset"
        />
      </div>
    );
  }

  const barData = buildBarData();
  const successfulResults = results?.results?.filter((r) => r.success) || [];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Config panel */}
      <Card>
        <h3 className="section-title" style={{ marginBottom: 'var(--space-5)' }}>
          <BarChart2 size={20} style={{ color: 'var(--accent-copper)' }} /> Select Algorithms to Compare
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          {available.map((algo) => {
            const isOn = selected.has(algo.id);
            const color = ALGO_COLORS[algo.id];
            return (
              <button
                key={algo.id}
                onClick={() => toggleAlgo(algo.id)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  border: `1px solid ${isOn ? color : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-full)',
                  background: isOn ? `${color}18` : 'transparent',
                  color: isOn ? color : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isOn ? 700 : 400,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {isOn && '✓ '}{algo.label}
              </button>
            );
          })}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCompare}
          disabled={selected.size === 0 || loading}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          {loading ? <><div className="spinner spinner-sm" /> Comparing...</> : <><Play size={16} /> Compare {selected.size} Algorithm{selected.size !== 1 ? 's' : ''}</>}
        </button>
      </Card>

      {error && <div className="alert alert-danger"><AlertCircle size={16} /><span>{error}</span></div>}
      {loading && <Loader message="Training all selected algorithms..." size="lg" />}

      {!loading && results && successfulResults.length > 0 && (
        <>
          {/* Metrics table */}
          <Card>
            <h3 className="section-title" style={{ marginBottom: 'var(--space-5)' }}>
              <Trophy size={20} style={{ color: 'var(--accent-copper)' }} /> Performance Comparison
            </h3>
            <MetricsTable results={successfulResults} problemType={results.problem_type} />
          </Card>

          {/* Bar chart */}
          {barData.length > 0 && (
            <Card>
              <h4 style={{ marginBottom: 'var(--space-5)' }}>Metrics Bar Chart</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,115,51,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                  {results.problem_type === 'classification'
                    ? ['Accuracy', 'Precision', 'Recall', 'F1 Score'].map((key, i) => (
                        <Bar key={key} dataKey={key} fill={['#B87333', '#D6A94A', '#8FAF7A', '#7E6BAE'][i]} radius={[4, 4, 0, 0]} />
                      ))
                    : ['MAE', 'RMSE', 'R²'].map((key, i) => (
                        <Bar key={key} dataKey={key} fill={['#B84A4A', '#D6A94A', '#8FAF7A'][i]} radius={[4, 4, 0, 0]} />
                      ))
                  }
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Per-model charts */}
          {results.problem_type === 'classification' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 'var(--space-6)' }}>
              {successfulResults.map((r) => r.classification_metrics && (
                <Card key={r.algorithm} style={{ minWidth: 0 }}>
                  <h4 style={{ marginBottom: 'var(--space-4)', color: ALGO_COLORS[r.algorithm] }}>
                    {r.algorithm.replace(/_/g, ' ')}
                  </h4>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Confusion Matrix</p>
                    <ConfusionMatrix matrix={r.classification_metrics.confusion_matrix} labels={r.classification_metrics.confusion_matrix_labels} />
                  </div>
                  {r.classification_metrics.roc_fpr && (
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>ROC Curve</p>
                      <ROCCurve fpr={r.classification_metrics.roc_fpr} tpr={r.classification_metrics.roc_tpr} auc={r.classification_metrics.roc_auc} color={ALGO_COLORS[r.algorithm]} label={r.algorithm} />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 'var(--space-6)' }}>
              {successfulResults.map((r) => r.regression_metrics && (
                <Card key={r.algorithm} style={{ minWidth: 0 }}>
                  <h4 style={{ marginBottom: 'var(--space-4)', color: ALGO_COLORS[r.algorithm] }}>
                    {r.algorithm.replace(/_/g, ' ')}
                  </h4>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Predicted vs. Actual</p>
                    <PredVsActual predictions={r.regression_metrics.predictions} actuals={r.regression_metrics.actuals} color={ALGO_COLORS[r.algorithm]} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Residuals</p>
                    <ResidualsPlot predictions={r.regression_metrics.predictions} residuals={r.regression_metrics.residuals} color={ALGO_COLORS[r.algorithm]} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
