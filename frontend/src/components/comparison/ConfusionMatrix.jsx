export default function ConfusionMatrix({ matrix, labels }) {
  if (!matrix || !labels || matrix.length === 0) return null;

  const max = Math.max(...matrix.flat());

  function cellColor(val) {
    const intensity = max > 0 ? val / max : 0;
    return `rgba(184, 115, 51, ${0.05 + intensity * 0.55})`;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
        <thead>
          <tr>
            <th style={{ padding: 'var(--space-2)', color: 'var(--text-muted)', fontWeight: 400, textAlign: 'center', fontSize: '10px' }}>
              Pred →
            </th>
            {labels.map((lbl) => (
              <th key={lbl} style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--accent-amber)', fontWeight: 600, textAlign: 'center', minWidth: 52 }}>
                {lbl}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--accent-copper)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {labels[i]}
              </td>
              {row.map((val, j) => (
                <td
                  key={j}
                  style={{
                    padding: 'var(--space-3)',
                    textAlign: 'center',
                    background: cellColor(val),
                    border: i === j ? '1px solid rgba(184,115,51,0.4)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: i === j ? 'var(--accent-amber)' : 'var(--text-secondary)',
                    fontWeight: i === j ? 700 : 400,
                  }}
                >
                  {val.toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 'var(--space-2)', margin: 'var(--space-2) 0 0' }}>
        Rows = Actual, Cols = Predicted. Diagonal = correct predictions.
      </p>
    </div>
  );
}
