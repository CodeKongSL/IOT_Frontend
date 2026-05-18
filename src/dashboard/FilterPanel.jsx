import GlassCard from '../common/GlassCard'

export default function FilterPanel({ filters, onChange, onApply, onReset, onExport }) {
  const update = (key) => (event) => {
    onChange({ [key]: event.target.value })
  }

  return (
    <GlassCard className="sticky top-28 flex flex-col gap-4 px-5 py-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
          Category Filters
        </p>
        <h3 className="mt-2 text-lg font-display text-ink-50">
          Precision Query Panel
        </h3>
      </div>

      <label className="input-shell flex-col items-start gap-1 rounded-2xl">
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
          Reading Name
        </span>
        <input
          type="text"
          value={filters.readingName}
          onChange={update('readingName')}
          className="w-full bg-transparent text-sm outline-none"
          placeholder="temperature_01"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="input-shell flex-col items-start gap-1 rounded-2xl">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Min Value
          </span>
          <input
            type="number"
            value={filters.minValue}
            onChange={update('minValue')}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="0"
          />
        </label>
        <label className="input-shell flex-col items-start gap-1 rounded-2xl">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Max Value
          </span>
          <input
            type="number"
            value={filters.maxValue}
            onChange={update('maxValue')}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="100"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="input-shell flex-col items-start gap-1 rounded-2xl">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Start Time
          </span>
          <input
            type="datetime-local"
            value={filters.startTime}
            onChange={update('startTime')}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <label className="input-shell flex-col items-start gap-1 rounded-2xl">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            End Time
          </span>
          <input
            type="datetime-local"
            value={filters.endTime}
            onChange={update('endTime')}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <label className="input-shell flex-col items-start gap-1 rounded-2xl">
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
          Range Adjust
        </span>
        <div className="flex w-full items-center gap-2 text-xs text-ink-200">
          <input
            type="range"
            min="0"
            max="100"
            value={filters.rangeLow}
            onChange={update('rangeLow')}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={filters.rangeHigh}
            onChange={update('rangeHigh')}
            className="w-full"
          />
        </div>
      </label>

      <div className="mt-2 flex flex-col gap-2">
        <button type="button" className="btn-primary" onClick={onApply}>
          Apply Filter
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="btn-ghost" onClick={onExport}>
          Export Results
        </button>
      </div>
    </GlassCard>
  )
}
