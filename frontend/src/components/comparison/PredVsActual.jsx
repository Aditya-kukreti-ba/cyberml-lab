import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function PredVsActual({ predictions, actuals, color = '#8FAF7A' }) {
  if (!predictions || !actuals || predictions.length === 0) return null;

  const data = actuals.map((act, i) => ({
    actual: parseFloat(act.toFixed(4)),
    predicted: parseFloat(predictions[i].toFixed(4)),
  }));

  const allVals = [...actuals, ...predictions];
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,175,122,0.1)" />
          <XAxis dataKey="actual" type="number" name="Actual" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} domain={[minVal, maxVal]} label={{ value: 'Actual', position: 'insideBottom', offset: -6, fill: 'var(--text-muted)', fontSize: 10 }} />
          <YAxis dataKey="predicted" type="number" name="Predicted" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} domain={[minVal, maxVal]} label={{ value: 'Predicted', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 11 }}
            formatter={(val) => val.toFixed(4)}
          />
          <ReferenceLine
            segment={[{ x: minVal, y: minVal }, { x: maxVal, y: maxVal }]}
            stroke="var(--accent-copper)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Scatter data={data} fill={color} fillOpacity={0.7} r={3} />
        </ScatterChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-1)' }}>
        Points along the diagonal line indicate perfect prediction.
      </p>
    </div>
  );
}
