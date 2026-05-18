const toneMap = {
  ok: 'status-pill status-ok',
  warn: 'status-pill status-warn',
  alarm: 'status-pill status-alarm',
}

export default function StatusPill({ label, tone = 'ok' }) {
  const classes = toneMap[tone] ?? toneMap.ok
  return <span className={classes}>{label}</span>
}
