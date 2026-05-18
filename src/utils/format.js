export const formatTimestamp = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], {
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
