import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function ResidualsPlot({ predictions, residuals, color = '#7E6BAE' }) {
  if (!predictions || !residuals || predictions.length === 0) return null;

  const data = predictions.map((pred, i) => ({
    predicted: parseFloat(pred.toFixed(4)),
    residual: parseFloat(residuals[i].toFixed(4)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,107,174,0.12)" />
        <XAxis dataKey="predicted" type="number" name="Predicted" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} label={{ value: 'Predicted', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 10 }} />
        <YAxis dataKey="residual" type="number" name="Residual" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} label={{ value: 'Residual', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 11 }}
          formatter={(val) => val.toFixed(4)}
        />
        <ReferenceLine y={0} stroke="var(--accent-copper)" strokeDasharray="4 4" strokeWidth={1.5} />
        <Scatter data={data} fill={color} fillOpacity={0.65} r={3} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
