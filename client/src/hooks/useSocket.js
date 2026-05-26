import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useErrorStore from '../store/errorStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export default function useSocket(projectId) {
  const socketRef    = useRef(null)
  const addLiveError = useErrorStore(s => s.addLiveError)

  useEffect(() => {
    if (!projectId) return
    socketRef.current = io(SOCKET_URL)
    socketRef.current.emit('join_project', projectId)

    socketRef.current.on('new_error', ({ error }) => {
      addLiveError(error)
    })
    socketRef.current.on('error_updated', ({ errorId, status }) => {
      useErrorStore.getState().updateErrorStatus(errorId, status)
    })

    return () => socketRef.current?.disconnect()
  }, [projectId])

  return socketRef.current
}