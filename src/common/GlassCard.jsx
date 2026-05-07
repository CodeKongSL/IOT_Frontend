export default function GlassCard({ children, className = '' }) {
  return <div className={`glass-panel ${className}`}>{children}</div>
}
