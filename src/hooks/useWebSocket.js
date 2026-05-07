import { useCallback, useEffect, useRef, useState } from 'react'

export function useWebSocket(url, options = {}) {
  const [status, setStatus] = useState('idle')
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)
  const reconnectTimer = useRef(null)

  const { reconnectInterval = 3000, shouldReconnect = true } = options

  const cleanup = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    cleanup()
    setStatus('connecting')

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      setStatus('open')
      setError(null)
    }

    socket.onmessage = (event) => {
      setLastMessage(event.data)
    }

    socket.onerror = () => {
      setStatus('error')
      setError('WebSocket error')
    }

    socket.onclose = () => {
      setStatus('closed')
      if (shouldReconnect) {
        reconnectTimer.current = setTimeout(connect, reconnectInterval)
      }
    }
  }, [cleanup, reconnectInterval, shouldReconnect, url])

  useEffect(() => {
    connect()
    return cleanup
  }, [connect, cleanup])

  const send = useCallback((payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(payload)
    }
  }, [])

  return { status, lastMessage, error, send, reconnect: connect }
}
