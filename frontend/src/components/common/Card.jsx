export default function Card({ children, className = '', flat = false, style = {}, onClick }) {
  const baseClass = flat ? 'glass-card-flat' : 'glass-card';
  return (
    <div
      className={`${baseClass} ${className}`}
      style={{ padding: 'var(--space-6)', ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
