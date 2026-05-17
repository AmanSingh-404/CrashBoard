import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cb_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// if token expires, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cb_token')
      localStorage.removeItem('cb_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api