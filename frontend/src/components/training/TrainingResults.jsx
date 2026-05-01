import { CheckCircle, Clock, Database, Layers } from 'lucide-react';
import ConfusionMatrix from '../comparison/ConfusionMatrix.jsx';
import ROCCurve from '../comparison/ROCCurve.jsx';
import ResidualsPlot from '../comparison/ResidualsPlot.jsx';
import PredVsActual from '../comparison/PredVsActual.jsx';
import DecisionTreeViz from './DecisionTreeViz.jsx';

const ALGORITHM_LABELS = {
  logistic_regression: 'Logistic Regression',
  linear_regression: 'Linear Regression',
  svm: 'Support Vector Machine',
  decision_tree: 'Decision Tree',
  naive_bayes: 'Naive Bayes',
};

export default function TrainingResults({ result }) {
  if (!result) return null;

  const { algorithm, problem_type, training_time_seconds, train_samples, test_samples,
    feature_count, classification_metrics: cm, regression_metrics: rm, feature_importances,
    tree_structure } = result;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <CheckCircle size={20} style={{ color: 'var(--accent-sage)' }} />
        <h4 style={{ margin: 0, color: 'var(--accent-sage)' }}>
          {ALGORITHM_LABELS[algorithm] || algorithm} — Training Complete
        </h4>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
        {[
          { icon: Clock, label: 'Training Time', value: `${training_time_seconds.toFixed(3)}s`, color: 'var(--accent-amber)' },
          { icon: Database, label: 'Train Samples', value: train_samples.toLocaleString(), color: 'var(--accent-sage)' },
          { icon: Database, label: 'Test Samples', value: test_samples.toLocaleString(), color: 'var(--accent-purple)' },
          { icon: Layers, label: 'Features', value: feature_count, color: 'var(--accent-copper)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="metric-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Icon size={14} style={{ color }} />
              <span className="metric-label">{label}</span>
            </div>
            <span className="metric-value" style={{ fontSize: 'var(--text-xl)', color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Classification metrics */}
      {cm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="metrics-row">
            {[
              { key: 'accuracy', label: 'Accuracy' },
              { key: 'precision', label: 'Precision' },
              { key: 'recall', label: 'Recall' },
              { key: 'f1_score', label: 'F1 Score' },
            ].map(({ key, label }) => (
              <div key={key} className="metric-card">
                <span className="metric-label">{label}</span>
                <span className="metric-value">{(cm[key] * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="results-row">
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
                Confusion Matrix
              </p>
              <ConfusionMatrix matrix={cm.confusion_matrix} labels={cm.confusion_matrix_labels} />
            </div>
            {cm.roc_fpr && (
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
                  ROC Curve (AUC = {cm.roc_auc?.toFixed(3)})
                </p>
                <ROCCurve fpr={cm.roc_fpr} tpr={cm.roc_tpr} auc={cm.roc_auc} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regression metrics */}
      {rm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="metrics-row">
            {[
              { key: 'mae', label: 'MAE' },
              { key: 'mse', label: 'MSE' },
              { key: 'rmse', label: 'RMSE' },
              { key: 'r2', label: 'R²' },
            ].map(({ key, label }) => (
              <div key={key} className="metric-card">
                <span className="metric-label">{label}</span>
                <span className="metric-value" style={{ fontSize: 'var(--text-xl)' }}>
                  {rm[key].toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          <div className="results-row">
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
                Predicted vs. Actual
              </p>
              <PredVsActual predictions={rm.predictions} actuals={rm.actuals} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
                Residuals Plot
              </p>
              <ResidualsPlot predictions={rm.predictions} residuals={rm.residuals} />
            </div>
          </div>
        </div>
      )}

      {/* Decision Tree: show actual tree structure */}
      {algorithm === 'decision_tree' && tree_structure && (
        <div>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
            Decision Tree Structure
          </p>
          <DecisionTreeViz
            treeData={tree_structure}
            isClassification={problem_type === 'classification'}
          />
        </div>
      )}

      {/* Feature importances — shown for all algorithms that return them (Decision Tree shows bars below tree too) */}
      {feature_importances && Object.keys(feature_importances).length > 0 && (
        <div>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
            Feature Importances
          </p>
          {Object.entries(feature_importances)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([feat, imp]) => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', width: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {feat}
                </span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${(imp * 100).toFixed(1)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-copper), var(--accent-amber))', borderRadius: 'var(--radius-full)' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', width: 44, textAlign: 'right' }}>
                  {(imp * 100).toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
