import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ROCCurve({ fpr, tpr, auc, label = '', color = '#B87333' }) {
  if (!fpr || !tpr || fpr.length === 0) return null;

  // ROC curve data — sorted by FPR (sklearn already returns it sorted)
  const rocData = fpr.map((x, i) => ({
    fpr: parseFloat(x.toFixed(4)),
    tpr: parseFloat(tpr[i].toFixed(4)),
  }));

  // Diagonal baseline (random classifier)
  const diagData = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart margin={{ top: 8, right: 16, bottom: 20, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,115,51,0.1)" />
          <XAxis
            dataKey="fpr"
            type="number"
            domain={[0, 1]}
            tickCount={6}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickLine={false}
            label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 10 }}
          />
          <YAxis
            dataKey="tpr"
            type="number"
            domain={[0, 1]}
            tickCount={6}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickLine={false}
            label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10, fill: 'var(--text-muted)', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 11 }}
            labelStyle={{ color: 'var(--text-muted)' }}
            formatter={(val, name) => [val.toFixed(3), name]}
          />
          {/* Diagonal baseline — random classifier */}
          <Line
            data={diagData}
            type="linear"
            dataKey="tpr"
            stroke="rgba(150,150,150,0.5)"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="Random"
            isAnimationActive={false}
          />
          {/* ROC curve */}
          <Line
            data={rocData}
            type="monotone"
            dataKey="tpr"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            name={label || 'ROC'}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {auc !== undefined && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)', textAlign: 'center' }}>
          AUC = <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{auc.toFixed(4)}</span>
        </p>
      )}
    </div>
  );
}
