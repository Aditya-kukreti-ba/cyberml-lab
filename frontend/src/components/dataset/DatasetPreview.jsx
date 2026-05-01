import { useState } from 'react';
import { Table, Hash, Tag } from 'lucide-react';

export default function DatasetPreview({ datasetInfo }) {
  const [showAll, setShowAll] = useState(false);

  if (!datasetInfo) return null;

  const { name, rows, columns, column_info, preview } = datasetInfo;
  const displayedColumns = showAll ? column_info : column_info.slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <Table size={16} />
          <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>
        </div>
        <span className="badge badge-copper">{rows.toLocaleString()} rows</span>
        <span className="badge badge-categorical">{columns} columns</span>
        <span className="badge badge-numerical">
          {column_info.filter(c => c.kind === 'numerical').length} numerical
        </span>
        <span className="badge badge-categorical" style={{ background: 'rgba(126,107,174,0.15)', color: 'var(--accent-purple)' }}>
          {column_info.filter(c => c.kind === 'categorical').length} categorical
        </span>
      </div>

      {/* Column info cards */}
      <div>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
          Column Summary
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
          {displayedColumns.map((col) => (
            <div
              key={col.name}
              style={{
                background: 'rgba(17,19,21,0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {col.name}
                </span>
                {col.kind === 'numerical'
                  ? <Hash size={12} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
                  : <Tag size={12} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                }
              </div>
              <span className={`badge ${col.kind === 'numerical' ? 'badge-numerical' : 'badge-categorical'}`} style={{ alignSelf: 'flex-start' }}>
                {col.kind}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>{col.unique_count} unique</span>
                {col.missing_count > 0 && <span style={{ color: 'var(--danger)' }}>{col.missing_count} missing</span>}
              </div>
            </div>
          ))}
        </div>
        {column_info.length > 8 && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 'var(--space-2)' }}
            onClick={() => setShowAll(v => !v)}
          >
            {showAll ? `Show less` : `Show all ${column_info.length} columns`}
          </button>
        )}
      </div>

      {/* Data preview table */}
      {preview && preview.length > 0 && (
        <div>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
            Data Preview (first 10 rows)
          </p>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(preview[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val === null ? <span style={{ color: 'var(--text-muted)' }}>null</span> : String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
