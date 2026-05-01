import { useState } from 'react';

// ─── Layout constants ────────────────────────────────────────────────────────
const NODE_W = 136;
const NODE_H = 66;
const H_GAP  = 20;   // horizontal gap between sibling subtrees
const V_GAP  = 60;   // vertical gap between levels
const UNIT   = NODE_W + H_GAP;

// Class colour palette (index 0 = negative/normal, 1 = positive/attack, …)
const CLASS_COLORS = ['#8FAF7A', '#B84A4A', '#7E6BAE', '#D6A94A', '#B87333'];

// ─── Tree helpers ────────────────────────────────────────────────────────────

function countLeaves(node) {
  if (!node || node.leaf) return 1;
  return countLeaves(node.left) + countLeaves(node.right);
}

/**
 * Compute (cx, cy, path) for every node in the truncated tree.
 * cx is the horizontal centre in SVG coords; cy is the top-y of the node box.
 */
function buildLayout(node, depth = 0, offset = 0, path = 'r') {
  if (!node) return [];
  const leaves = countLeaves(node);
  const cx = (offset + leaves / 2) * UNIT;
  const cy = depth * (NODE_H + V_GAP);
  const result = [{ node, cx, cy, path }];
  if (!node.leaf) {
    const ll = countLeaves(node.left);
    result.push(...buildLayout(node.left,  depth + 1, offset,      path + 'L'));
    result.push(...buildLayout(node.right, depth + 1, offset + ll, path + 'R'));
  }
  return result;
}

/**
 * Return a copy of the tree truncated to maxDepth levels.
 * Nodes cut off early are marked {leaf:true, truncated:true}.
 */
function truncateTree(node, depth, maxDepth) {
  if (!node) return null;
  if (node.leaf) return node;
  if (depth >= maxDepth) {
    // Show as leaf with existing metadata
    return { ...node, leaf: true, truncated: true };
  }
  return {
    ...node,
    left:  truncateTree(node.left,  depth + 1, maxDepth),
    right: truncateTree(node.right, depth + 1, maxDepth),
  };
}

/** Return the actual depth of the raw tree (before display truncation). */
function treeDepth(node) {
  if (!node || node.leaf) return 0;
  return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
}

// ─── SVG sub-components ──────────────────────────────────────────────────────

function InternalNode({ cx, cy }) {
  return (
    <rect
      x={cx - NODE_W / 2} y={cy}
      width={NODE_W} height={NODE_H}
      rx={7}
      fill="rgba(22,24,28,0.97)"
      stroke="rgba(184,115,51,0.65)"
      strokeWidth={1.6}
    />
  );
}

function LeafNode({ cx, cy, color, truncated }) {
  return (
    <rect
      x={cx - NODE_W / 2} y={cy}
      width={NODE_W} height={NODE_H}
      rx={7}
      fill={`${color}18`}
      stroke={truncated ? 'rgba(130,130,130,0.35)' : color}
      strokeWidth={truncated ? 1 : 1.6}
      strokeDasharray={truncated ? '5 3' : undefined}
    />
  );
}

function NodeContent({ cx, cy, node, isClassification }) {
  const half = NODE_W / 2;

  if (node.leaf) {
    const color = CLASS_COLORS[(node.class_idx ?? 0) % CLASS_COLORS.length];

    if (node.truncated) {
      return (
        <text x={cx} y={cy + NODE_H / 2 + 4} textAnchor="middle"
          fontSize={13} fill="rgba(160,160,160,0.55)" fontFamily="monospace">
          • • •
        </text>
      );
    }

    const labelLine = isClassification
      ? `Class: ${node.class_label}`
      : `val = ${node.class_label}`;
    const distLine = Array.isArray(node.value) ? `[${node.value.join(', ')}]` : '';

    return (
      <>
        <text x={cx} y={cy + 19} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={color} fontFamily="sans-serif">{labelLine}</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fontSize={10}
          fill="rgba(200,200,200,0.65)" fontFamily="monospace">n = {node.samples}</text>
        {distLine && (
          <text x={cx} y={cy + 52} textAnchor="middle" fontSize={9}
            fill="rgba(140,140,140,0.6)" fontFamily="monospace">{distLine}</text>
        )}
      </>
    );
  }

  // Internal node
  const feat = node.feature.length > 15 ? node.feature.slice(0, 14) + '…' : node.feature;

  return (
    <>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="#D6A94A" fontFamily="sans-serif">{feat}</text>
      <text x={cx} y={cy + 35} textAnchor="middle" fontSize={11}
        fill="rgba(230,230,230,0.9)" fontFamily="monospace">≤ {node.threshold}</text>
      <text x={cx} y={cy + 51} textAnchor="middle" fontSize={9}
        fill="rgba(140,140,140,0.65)" fontFamily="monospace">
        n={node.samples}  gini={node.impurity?.toFixed(3)}
      </text>
    </>
  );
}

function Edge({ x1, y1, x2, y2, label, color }) {
  // Cubic bezier: leave parent straight down, arrive at child straight down
  const my = (y1 + y2) / 2;
  const d  = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  const lx = x1 + (x2 - x1) * 0.28 + (label === '≤' ? -10 : 10);
  const ly = y1 + (y2 - y1) * 0.28;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
      <text x={lx} y={ly} textAnchor="middle" fontSize={9}
        fill={color} fontFamily="monospace" fontWeight={700}>{label}</text>
    </g>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DecisionTreeViz({ treeData, isClassification = true }) {
  const rawDepth   = treeDepth(treeData);
  const initDepth  = Math.min(3, rawDepth);
  const [maxDepth, setMaxDepth] = useState(initDepth);

  if (!treeData) return null;

  const display   = truncateTree(treeData, 0, maxDepth);
  const items     = buildLayout(display);
  const posMap    = Object.fromEntries(items.map(it => [it.path, it]));

  const totalLeaves = countLeaves(display);
  const svgW = Math.max(totalLeaves * UNIT, NODE_W + 40);
  const svgH = (maxDepth + 1) * (NODE_H + V_GAP) - V_GAP + 16;

  // Build edges
  const edges = items
    .filter(({ node }) => !node.leaf)
    .flatMap(({ node, cx, cy, path }) => {
      const lp = posMap[path + 'L'];
      const rp = posMap[path + 'R'];
      return [
        lp && { x1: cx, y1: cy + NODE_H, x2: lp.cx, y2: lp.cy, label: '≤', color: 'rgba(143,175,122,0.6)' },
        rp && { x1: cx, y1: cy + NODE_H, x2: rp.cx, y2: rp.cy, label: '>',  color: 'rgba(184,115,51,0.6)'  },
      ].filter(Boolean);
    });

  const depthOptions = Array.from({ length: Math.min(rawDepth, 4) }, (_, i) => i + 1);
  const hasTruncated = rawDepth > maxDepth;

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Depth:
        </span>
        {depthOptions.map(d => (
          <button
            key={d}
            onClick={() => setMaxDepth(d)}
            style={{
              padding: '3px 11px',
              border: `1px solid ${maxDepth === d ? 'var(--accent-copper)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              background: maxDepth === d ? 'rgba(184,115,51,0.15)' : 'transparent',
              color: maxDepth === d ? 'var(--accent-copper)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: maxDepth === d ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {d}
          </button>
        ))}
        {hasTruncated && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            tree is {rawDepth} levels deep — dashed nodes are truncated
          </span>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-5)', marginBottom: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <LegendItem color="rgba(184,115,51,0.65)" bg="rgba(22,24,28,0.97)" label="Split node" />
        {isClassification && CLASS_COLORS.slice(0, 2).map((c, i) => (
          <LegendItem key={i} color={c} bg={`${c}18`} label={`Class ${i}`} />
        ))}
        <EdgeLegend color="rgba(143,175,122,0.7)" label="≤ (left / True)" />
        <EdgeLegend color="rgba(184,115,51,0.7)"  label="> (right / False)" />
      </div>

      {/* Scrollable SVG */}
      <div style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(10,11,13,0.7)',
        padding: '14px 10px',
      }}>
        <svg width={svgW} height={svgH} style={{ display: 'block' }}>
          {/* Edges first (drawn behind nodes) */}
          {edges.map((e, i) => <Edge key={i} {...e} />)}

          {/* Nodes */}
          {items.map(({ node, cx, cy, path }) => {
            const color = CLASS_COLORS[(node.class_idx ?? 0) % CLASS_COLORS.length];
            return (
              <g key={path}>
                {node.leaf
                  ? <LeafNode cx={cx} cy={cy} color={color} truncated={node.truncated} />
                  : <InternalNode cx={cx} cy={cy} />
                }
                <NodeContent cx={cx} cy={cy} node={node} isClassification={isClassification} />
              </g>
            );
          })}
        </svg>
      </div>

      <p style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 'var(--space-2)', textAlign: 'center' }}>
        Left branch = condition True (≤ threshold) · Right branch = condition False (&gt; threshold)
        {rawDepth > 4 && ' · Tree capped at 4 levels for export'}
      </p>
    </div>
  );
}

// Small helper sub-components for the legend
function LegendItem({ color, bg, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 13, height: 13, borderRadius: 3, background: bg, border: `1.5px solid ${color}`, flexShrink: 0 }} />
      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function EdgeLegend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width={22} height={10} style={{ flexShrink: 0 }}>
        <line x1={0} y1={5} x2={22} y2={5} stroke={color} strokeWidth={1.5} />
      </svg>
      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}
