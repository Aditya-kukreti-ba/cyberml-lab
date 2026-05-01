import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';

const HYPERPARAMS = {
  logistic_regression: [
    { key: 'C', label: 'Regularization (C)', type: 'number', default: 1.0, min: 0.01, max: 100, step: 0.1, desc: 'Inverse of regularization strength. Larger = less regularization.' },
    { key: 'max_iter', label: 'Max Iterations', type: 'number', default: 1000, min: 100, max: 5000, step: 100, desc: 'Max iterations for solver convergence.' },
  ],
  linear_regression: [
    { key: 'fit_intercept', label: 'Fit Intercept', type: 'boolean', default: true, desc: 'Whether to calculate the intercept for this model.' },
  ],
  svm: [
    { key: 'kernel', label: 'Kernel', type: 'select', default: 'rbf', options: ['linear', 'rbf', 'poly', 'sigmoid'], desc: 'Kernel function for the SVM.' },
    { key: 'C', label: 'Regularization (C)', type: 'number', default: 1.0, min: 0.01, max: 100, step: 0.1, desc: 'Penalty parameter C of the error term.' },
  ],
  decision_tree: [
    { key: 'max_depth', label: 'Max Depth', type: 'number', default: 5, min: 1, max: 30, step: 1, desc: 'Max depth of the tree. Leave empty for unlimited.' },
    { key: 'min_samples_split', label: 'Min Samples Split', type: 'number', default: 2, min: 2, max: 50, step: 1, desc: 'Min samples required to split an internal node.' },
    { key: 'criterion', label: 'Criterion', type: 'select', default: 'gini', options: ['gini', 'entropy'], desc: 'Function to measure split quality.' },
  ],
  naive_bayes: [
    { key: 'var_smoothing', label: 'Var Smoothing', type: 'number', default: 1e-9, min: 1e-12, max: 1e-5, step: 1e-10, desc: 'Stability of calculations (Laplace smoothing).' },
  ],
};

export default function TrainingControls({ algorithm, onChange }) {
  const params = HYPERPARAMS[algorithm] || [];
  const [values, setValues] = useState(
    () => Object.fromEntries(params.map((p) => [p.key, p.default]))
  );

  useEffect(() => {
    const defaults = Object.fromEntries(params.map((p) => [p.key, p.default]));
    setValues(defaults);
    onChange?.(defaults);
  }, [algorithm]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(key, raw) {
    const param = params.find((p) => p.key === key);
    let value = raw;
    if (param?.type === 'number') value = Number(raw);
    if (param?.type === 'boolean') value = raw === 'true' || raw === true;
    const next = { ...values, [key]: value };
    setValues(next);
    onChange?.(next);
  }

  if (params.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        No configurable hyperparameters for this algorithm.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        <Sliders size={14} />
        <span>Adjust hyperparameters (optional)</span>
      </div>
      {params.map((param) => (
        <div key={param.key} className="form-group">
          <label className="form-label">{param.label}</label>
          {param.type === 'select' ? (
            <select
              className="form-select"
              value={values[param.key]}
              onChange={(e) => update(param.key, e.target.value)}
            >
              {param.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : param.type === 'boolean' ? (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {['true', 'false'].map((v) => (
                <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <input
                    type="radio"
                    name={param.key}
                    checked={String(values[param.key]) === v}
                    onChange={() => update(param.key, v === 'true')}
                    style={{ accentColor: 'var(--accent-copper)' }}
                  />
                  {v}
                </label>
              ))}
            </div>
          ) : (
            <input
              type="number"
              className="form-input"
              value={values[param.key]}
              min={param.min}
              max={param.max}
              step={param.step}
              onChange={(e) => update(param.key, e.target.value)}
            />
          )}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{param.desc}</p>
        </div>
      ))}
    </div>
  );
}
