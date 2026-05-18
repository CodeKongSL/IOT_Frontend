export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-ink-50">
      <div className="pointer-events-none absolute inset-0 opacity-50 scada-grid" />
      <div className="pointer-events-none absolute inset-0 scada-glow" />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
