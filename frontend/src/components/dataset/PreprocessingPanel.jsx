import { useState } from 'react';
import { Settings2, SplitSquareHorizontal } from 'lucide-react';

const MISSING_OPTIONS = [
  { value: 'mean',   label: 'Mean fill',   desc: 'Replace with column mean (numerical only)' },
  { value: 'median', label: 'Median fill',  desc: 'Replace with column median (numerical only)' },
  { value: 'mode',   label: 'Mode fill',    desc: 'Replace with most frequent value' },
  { value: 'drop',   label: 'Drop rows',    desc: 'Remove rows with any missing value' },
];

const ENCODING_OPTIONS = [
  { value: 'label',  label: 'Label Encoding', desc: 'Converts categories to integers (0, 1, 2…)' },
  { value: 'onehot', label: 'One-Hot',         desc: 'Creates a binary column per category' },
];

const SCALING_OPTIONS = [
  { value: 'standard', label: 'Standard (Z-score)', desc: 'Mean=0, Std=1 — best for most algorithms' },
  { value: 'minmax',   label: 'Min-Max',            desc: 'Scales to [0, 1] range' },
  { value: 'none',     label: 'None',               desc: 'No scaling applied' },
];

export default function PreprocessingPanel({ onChange }) {
  const [config, setConfig] = useState({
    missing_strategy: 'mean',
    encoding_method: 'label',
    scaling_method: 'standard',
    test_size: 0.2,
  });

  function update(key, value) {
    const next = { ...config, [key]: value };
    setConfig(next);
    onChange?.(next);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Missing values */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings2 size={14} style={{ color: 'var(--accent-copper)' }} />
          Missing Value Strategy
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {MISSING_OPTIONS.map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="missing"
                value={opt.value}
                checked={config.missing_strategy === opt.value}
                onChange={() => update('missing_strategy', opt.value)}
                style={{ marginTop: 3, accentColor: 'var(--accent-copper)' }}
              />
              <div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: config.missing_strategy === opt.value ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                  {opt.label}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Encoding */}
      <div className="form-group">
        <label className="form-label">Categorical Encoding</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {ENCODING_OPTIONS.map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="encoding"
                value={opt.value}
                checked={config.encoding_method === opt.value}
                onChange={() => update('encoding_method', opt.value)}
                style={{ marginTop: 3, accentColor: 'var(--accent-copper)' }}
              />
              <div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: config.encoding_method === opt.value ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                  {opt.label}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Scaling */}
      <div className="form-group">
        <label className="form-label">Feature Scaling</label>
        <select
          className="form-select"
          value={config.scaling_method}
          onChange={(e) => update('scaling_method', e.target.value)}
        >
          {SCALING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label} — {opt.desc}</option>
          ))}
        </select>
      </div>

      {/* Train/test split */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <SplitSquareHorizontal size={14} style={{ color: 'var(--accent-copper)' }} />
          Train / Test Split
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <input
            type="range"
            className="form-range"
            min={10}
            max={40}
            step={5}
            value={Math.round(config.test_size * 100)}
            onChange={(e) => update('test_size', Number(e.target.value) / 100)}
            style={{ flex: 1 }}
          />
          <div style={{ textAlign: 'right', minWidth: 120 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--accent-sage)' }}>
              {Math.round((1 - config.test_size) * 100)}% train
            </span>
            <span style={{ color: 'var(--text-muted)', margin: '0 var(--space-1)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--accent-amber)' }}>
              {Math.round(config.test_size * 100)}% test
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
