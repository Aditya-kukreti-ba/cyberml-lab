import './AlgorithmVisual.css';

/* ── Helper: seeded pseudo-random for deterministic point positions ── */
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function LogisticRegressionVisual() {
  const rng = seeded(42);
  const classA = Array.from({ length: 20 }, () => ({ x: 80 + rng() * 100, y: 180 + rng() * 120 }));
  const classB = Array.from({ length: 20 }, () => ({ x: 220 + rng() * 100, y: 60 + rng() * 120 }));
  return (
    <svg viewBox="0 0 380 280" className="algo-visual-svg">
      {classA.map((p, i) => <circle key={`a${i}`} className="vis-point" cx={p.x} cy={p.y} r={5} fill="#B87333" fillOpacity={0.75} />)}
      {classB.map((p, i) => <circle key={`b${i}`} className="vis-point" cx={p.x} cy={p.y} r={5} fill="#7E6BAE" fillOpacity={0.75} />)}
      <line className="vis-line" x1={60} y1={240} x2={330} y2={40} stroke="#D6A94A" strokeWidth={2.5} />
      <text className="vis-label" x={194} y={270} fill="#A89F91" fontSize={11} textAnchor="middle">Decision boundary</text>
      <text x={80} y={268} fill="#B87333" fontSize={10} className="vis-label">Class A</text>
      <text x={290} y={24} fill="#7E6BAE" fontSize={10} className="vis-label">Class B</text>
    </svg>
  );
}

function LinearRegressionVisual() {
  const rng = seeded(7);
  const points = Array.from({ length: 25 }, (_, i) => ({
    x: 40 + i * 12,
    y: 240 - (i * 7 + rng() * 40 - 20),
  }));
  return (
    <svg viewBox="0 0 380 280" className="algo-visual-svg">
      <line x1={30} y1={250} x2={30} y2={20} stroke="var(--border-default)" strokeWidth={1} />
      <line x1={30} y1={250} x2={360} y2={250} stroke="var(--border-default)" strokeWidth={1} />
      {points.map((p, i) => <circle key={i} className="vis-point" cx={p.x} cy={p.y} r={4.5} fill="#8FAF7A" fillOpacity={0.8} />)}
      <line className="vis-line" x1={40} y1={235} x2={340} y2={55} stroke="#B87333" strokeWidth={2.5} />
      <text className="vis-label" x={190} y={275} fill="#A89F91" fontSize={11} textAnchor="middle">Best-fit regression line</text>
    </svg>
  );
}

function SVMVisual() {
  const rng = seeded(13);
  const classA = Array.from({ length: 14 }, () => ({ x: 60 + rng() * 110, y: 60 + rng() * 100 }));
  const classB = Array.from({ length: 14 }, () => ({ x: 200 + rng() * 110, y: 140 + rng() * 100 }));
  return (
    <svg viewBox="0 0 380 280" className="algo-visual-svg">
      {classA.map((p, i) => <circle key={`a${i}`} className="svm-point" cx={p.x} cy={p.y} r={5} fill="#B87333" fillOpacity={0.75} />)}
      {classB.map((p, i) => <circle key={`b${i}`} className="svm-point" cx={p.x} cy={p.y} r={5} fill="#7E6BAE" fillOpacity={0.75} />)}
      {/* Margin lines */}
      <line className="svm-margin" x1={50} y1={210} x2={300} y2={60} stroke="#D6A94A" strokeWidth={1} strokeDasharray="6 3" strokeOpacity={0.5} />
      <line className="svm-margin" x1={90} y1={230} x2={340} y2={80} stroke="#D6A94A" strokeWidth={1} strokeDasharray="6 3" strokeOpacity={0.5} />
      {/* Decision boundary */}
      <line className="svm-boundary" x1={70} y1={220} x2={320} y2={70} stroke="#D6A94A" strokeWidth={2.5} />
      {/* Support vectors */}
      <circle cx={130} cy={180} r={8} fill="none" stroke="#B87333" strokeWidth={2} />
      <circle cx={240} cy={100} r={8} fill="none" stroke="#7E6BAE" strokeWidth={2} />
      <text className="vis-label" x={190} y={270} fill="#A89F91" fontSize={11} textAnchor="middle">Max-margin hyperplane</text>
    </svg>
  );
}

function DecisionTreeVisual() {
  const nodes = [
    { id: 'root', x: 190, y: 30, label: 'src_bytes > 1000?', w: 130 },
    { id: 'l1', x: 90, y: 100, label: 'count > 200?', w: 100 },
    { id: 'r1', x: 290, y: 100, label: 'same_srv > 0.8?', w: 110 },
    { id: 'll', x: 40, y: 175, label: 'Normal', w: 60, leaf: true, color: '#8FAF7A' },
    { id: 'lr', x: 140, y: 175, label: 'Attack', w: 60, leaf: true, color: '#B84A4A' },
    { id: 'rl', x: 240, y: 175, label: 'Attack', w: 60, leaf: true, color: '#B84A4A' },
    { id: 'rr', x: 340, y: 175, label: 'Normal', w: 60, leaf: true, color: '#8FAF7A' },
  ];
  const edges = [
    ['root', 'l1', 'Yes'], ['root', 'r1', 'No'],
    ['l1', 'll', 'Yes'], ['l1', 'lr', 'No'],
    ['r1', 'rl', 'Yes'], ['r1', 'rr', 'No'],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 380 230" className="algo-visual-svg">
      {edges.map(([from, to, lbl], i) => {
        const f = byId[from]; const t = byId[to];
        const midX = (f.x + t.x) / 2; const midY = (f.y + t.y) / 2;
        return (
          <g key={i}>
            <line className="tree-edge" style={{ animationDelay: `${i * 0.1}s` }} x1={f.x} y1={f.y + 16} x2={t.x} y2={t.y - 16} stroke="var(--border-default)" strokeWidth={1.5} />
            <text x={midX + 4} y={midY} fill="var(--text-muted)" fontSize={9}>{lbl}</text>
          </g>
        );
      })}
      {nodes.map((node) => (
        <g key={node.id} className="tree-node" transform={`translate(${node.x},${node.y})`}>
          <rect x={-node.w / 2} y={-16} width={node.w} height={32} rx={6}
            fill={node.leaf ? `${node.color}22` : 'rgba(184,115,51,0.1)'}
            stroke={node.leaf ? node.color : 'var(--accent-copper)'}
            strokeWidth={1.5}
          />
          <text y={5} textAnchor="middle" fill={node.leaf ? node.color : 'var(--text-primary)'} fontSize={node.leaf ? 11 : 9} fontWeight={node.leaf ? 700 : 400}>
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function NaiveBayesVisual() {
  function gaussian(x, mu, sigma) {
    return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2)) / (sigma * Math.sqrt(2 * Math.PI));
  }
  function curve(mu, sigma, color, label) {
    const xs = Array.from({ length: 80 }, (_, i) => -3 + i * 0.1);
    const ys = xs.map((x) => gaussian(x, mu, sigma));
    const maxY = Math.max(...ys);
    const pts = xs.map((x, i) => `${80 + x * 45},${220 - (ys[i] / maxY) * 160}`).join(' ');
    return (
      <g key={label}>
        <polyline className="nb-bell" points={pts} fill="none" stroke={color} strokeWidth={2.5} />
        <text x={80 + mu * 45} y={30} fill={color} fontSize={11} textAnchor="middle" className="vis-label">{label}</text>
      </g>
    );
  }
  return (
    <svg viewBox="0 0 380 250" className="algo-visual-svg">
      <line x1={30} y1={220} x2={350} y2={220} stroke="var(--border-default)" strokeWidth={1} />
      {curve(-0.8, 0.7, '#B87333', 'Normal')}
      {curve(0.9, 0.8, '#7E6BAE', 'Attack')}
      <text x={190} y={245} fill="var(--text-muted)" fontSize={11} textAnchor="middle" className="vis-label">
        P(class | features) ∝ P(features | class) × P(class)
      </text>
    </svg>
  );
}

const VISUALS = {
  logistic_regression: LogisticRegressionVisual,
  linear_regression:   LinearRegressionVisual,
  svm:                 SVMVisual,
  decision_tree:       DecisionTreeVisual,
  naive_bayes:         NaiveBayesVisual,
};

export default function AlgorithmVisual({ algorithm }) {
  const Visual = VISUALS[algorithm];
  if (!Visual) return null;
  return (
    <div className="algo-visual-container">
      <Visual />
    </div>
  );
}
