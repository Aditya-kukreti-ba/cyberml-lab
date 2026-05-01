export default function Loader({ message = 'Loading...', size = 'md' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-12)',
        color: 'var(--text-muted)',
      }}
    >
      <div className={`spinner spinner-${size}`} />
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>{message}</p>
    </div>
  );
}
