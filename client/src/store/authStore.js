import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // load user from localStorage on startup
  user:  JSON.parse(localStorage.getItem('cb_user') || 'null'),
  token: localStorage.getItem('cb_token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('cb_user',  JSON.stringify(user))
    localStorage.setItem('cb_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('cb_user')
    localStorage.removeItem('cb_token')
    set({ user: null, token: null })
  },
}))

export default useAuthStore