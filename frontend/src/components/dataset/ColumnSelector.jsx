import { useState } from 'react';
import { Target, Layers, Hash, Tag, AlertCircle } from 'lucide-react';

export default function ColumnSelector({ columnInfo, onSelectionChange }) {
  const [targetColumn, setTargetColumn] = useState('');
  const [featureColumns, setFeatureColumns] = useState([]);
  const [problemType, setProblemType] = useState('classification');

  function handleTargetChange(col) {
    setTargetColumn(col);
    const newFeatures = featureColumns.filter((c) => c !== col);
    setFeatureColumns(newFeatures);
    notify(col, newFeatures, problemType);
  }

  function toggleFeature(col) {
    if (col === targetColumn) return;
    const updated = featureColumns.includes(col)
      ? featureColumns.filter((c) => c !== col)
      : [...featureColumns, col];
    setFeatureColumns(updated);
    notify(targetColumn, updated, problemType);
  }

  function selectAllFeatures() {
    const all = columnInfo.filter((c) => c.name !== targetColumn).map((c) => c.name);
    setFeatureColumns(all);
    notify(targetColumn, all, problemType);
  }

  function handleProblemChange(type) {
    setProblemType(type);
    notify(targetColumn, featureColumns, type);
  }

  function notify(target, features, type) {
    onSelectionChange?.({ targetColumn: target, featureColumns: features, problemType: type });
  }

  const validSelection = targetColumn && featureColumns.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Problem type */}
      <div className="form-group">
        <label className="form-label">Problem Type</label>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {['classification', 'regression'].map((type) => (
            <button
              key={type}
              onClick={() => handleProblemChange(type)}
              style={{
                flex: 1,
                padding: 'var(--space-3)',
                border: `1px solid ${problemType === type ? 'var(--accent-copper)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                background: problemType === type ? 'rgba(184,115,51,0.12)' : 'transparent',
                color: problemType === type ? 'var(--accent-amber)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                transition: 'all var(--transition-fast)',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)', margin: 0 }}>
          {problemType === 'classification'
            ? 'Predicts a category (e.g., normal vs. attack)'
            : 'Predicts a continuous value (e.g., risk score)'}
        </p>
      </div>

      {/* Target column */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Target size={14} style={{ color: 'var(--accent-copper)' }} />
          Target Column (what to predict)
        </label>
        <select
          className="form-select"
          value={targetColumn}
          onChange={(e) => handleTargetChange(e.target.value)}
        >
          <option value="">— Select target column —</option>
          {columnInfo.map((col) => (
            <option key={col.name} value={col.name}>
              {col.name} ({col.kind})
            </option>
          ))}
        </select>
      </div>

      {/* Feature columns */}
      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}>
            <Layers size={14} style={{ color: 'var(--accent-copper)' }} />
            Feature Columns ({featureColumns.length} selected)
          </label>
          <button className="btn btn-ghost btn-sm" onClick={selectAllFeatures} disabled={!targetColumn}>
            Select All
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-2)', maxHeight: 240, overflowY: 'auto', padding: 'var(--space-1)' }}>
          {columnInfo.map((col) => {
            const isTarget = col.name === targetColumn;
            const isSelected = featureColumns.includes(col.name);
            return (
              <div
                key={col.name}
                onClick={() => !isTarget && toggleFeature(col.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: `1px solid ${isTarget ? 'var(--accent-copper)' : isSelected ? 'var(--accent-sage)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: isTarget ? 'default' : 'pointer',
                  background: isTarget ? 'rgba(184,115,51,0.08)' : isSelected ? 'rgba(143,175,122,0.08)' : 'transparent',
                  opacity: isTarget ? 0.6 : 1,
                  transition: 'all var(--transition-fast)',
                  fontSize: 'var(--text-xs)',
                }}
              >
                {col.kind === 'numerical'
                  ? <Hash size={11} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
                  : <Tag size={11} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                }
                <span style={{ color: isTarget ? 'var(--accent-copper)' : isSelected ? 'var(--accent-sage)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {col.name}
                  {isTarget && ' ★'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {!validSelection && targetColumn && (
        <div className="alert alert-warning">
          <AlertCircle size={16} />
          <span>Select at least one feature column to continue.</span>
        </div>
      )}
    </div>
  );
}
