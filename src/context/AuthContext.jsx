import { createContext, useContext, useState } from 'react'
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '../lib/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  function login(u) {
    setCurrentUser(u)
    setUser(u)
  }

  function logout() {
    clearCurrentUser()
    setUser(null)
  }

  function refresh() {
    setUser(getCurrentUser())
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
