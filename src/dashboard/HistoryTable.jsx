import GlassCard from '../common/GlassCard'
import { formatDateTime } from '../utils/format'
import StatusPill from '../components/StatusPill'

const statusTone = {
  ok: 'ok',
  warn: 'warn',
  alarm: 'alarm',
}

export default function HistoryTable({
  data,
  isLoading,
  isError,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onJumpToPage,
}) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
            Historical Records
          </p>
          <h3 className="mt-2 text-lg font-display text-ink-50">
            Category history feed
          </h3>
        </div>
        <div className="text-xs text-ink-200">Total Records: {total}</div>
      </div>

      <div className="scada-table">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-ink-900/80 text-xs uppercase tracking-[0.3em] text-ink-300">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Reading</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Unit</th>
              <th className="px-5 py-3">Source PLC</th>
              <th className="px-5 py-3">Subcategory</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-5 py-6">
                  <div className="skeleton h-6 w-full" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="7" className="px-5 py-6 text-sm text-ink-200">
                  Unable to load historical records.
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-6 text-sm text-ink-200">
                  No records found for the selected filters.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 text-xs text-ink-200">
                    {formatDateTime(row.timestamp)}
                  </td>
                  <td className="px-5 py-3 text-ink-50">
                    {row.reading_name}
                  </td>
                  <td className="px-5 py-3 text-ink-50">{row.value}</td>
                  <td className="px-5 py-3 text-ink-200">{row.unit}</td>
                  <td className="px-5 py-3 text-ink-200">{row.source_plc}</td>
                  <td className="px-5 py-3 text-ink-200">{row.subcategory}</td>
                  <td className="px-5 py-3">
                    <StatusPill
                      label={row.status.toUpperCase()}
                      tone={statusTone[row.status] ?? 'ok'}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-ink-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onPageChange(Math.max(page - 1, 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          >
            Next
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            Page size
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="input-inline"
            >
              {[25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Jump to
            <input
              type="number"
              min="1"
              max={totalPages}
              className="input-inline w-20"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const value = Number(event.currentTarget.value)
                  if (Number.isFinite(value)) onJumpToPage(value)
                }
              }}
            />
          </label>
        </div>
      </div>
    </GlassCard>
  )
}
