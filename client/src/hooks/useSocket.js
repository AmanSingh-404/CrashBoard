import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useErrorStore from '../store/errorStore'

const SOCKET_URL = 'http://localhost:5000'

export default function useSocket(projectId) {
  const socketRef    = useRef(null)
  const addLiveError = useErrorStore(s => s.addLiveError)

  useEffect(() => {
    if (!projectId) return

    // connect to Socket.io server
    socketRef.current = io(SOCKET_URL)

    // join this project's room
    socketRef.current.emit('join_project', projectId)
    console.log(`⚡ Joined project room: ${projectId}`)

    // listen for new errors broadcast by the ingest endpoint
    socketRef.current.on('new_error', ({ error }) => {
      console.log('🚨 Live error received:', error.type)
      addLiveError(error)
    })

    // listen for status updates
    socketRef.current.on('error_updated', ({ errorId, status }) => {
      useErrorStore.getState().updateErrorStatus(errorId, status)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [projectId])

  return socketRef.current
}