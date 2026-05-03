import { TOKEN_KEY } from '../api/client'

export function useAdminAuth() {
  const token = localStorage.getItem(TOKEN_KEY)
  const isAuthenticated = !!token

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
  }

  return { isAuthenticated, logout }
}
