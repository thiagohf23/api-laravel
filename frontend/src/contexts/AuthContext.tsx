import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import client from '../api/client'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    client.get('/user')
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  async function login(email: string, password: string) {
    const res = await client.post('/login', { email, password })
    const newToken = res.data.token
    localStorage.setItem('auth_token', newToken)
    setToken(newToken)
    setUser(res.data.user)
  }

  async function logout() {
    try {
      await client.post('/logout')
    } catch {
      // Ignora erro se o token já expirou
    }
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
