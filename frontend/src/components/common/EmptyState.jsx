import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-16)',
        textAlign: 'center',
      }}
    >
      {Icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(184, 115, 51, 0.08)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-copper)',
          }}
        >
          <Icon size={28} />
        </div>
      )}
      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: 'var(--text-sm)', maxWidth: 360, margin: '0 auto' }}>{description}</p>
        )}
      </div>
      {actionLabel && (actionTo || onAction) && (
        actionTo ? (
          <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
        ) : (
          <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
        )
      )}
    </div>
  );
}
