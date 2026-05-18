import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function AllErrors() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/dashboard') }, [])
  return null
}