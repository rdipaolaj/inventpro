"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales de prueba
const TEST_CREDENTIALS = [
  { email: "admin@inventario.com", password: "admin123", userId: "usr_001" },
  { email: "manager@inventario.com", password: "manager123", userId: "usr_002" },
  { email: "empleado@inventario.com", password: "empleado123", userId: "usr_003" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("inventario_user")
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch {
        localStorage.removeItem("inventario_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    const credential = TEST_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    )

    if (!credential) {
      setIsLoading(false)
      return { success: false, error: "Credenciales inválidas. Intenta con admin@inventario.com / admin123" }
    }

    const foundUser = mockUsers.find((u) => u.id === credential.userId)
    if (!foundUser) {
      setIsLoading(false)
      return { success: false, error: "Usuario no encontrado" }
    }

    setUser(foundUser)
    localStorage.setItem("inventario_user", JSON.stringify(foundUser))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("inventario_user")
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...data, updatedAt: new Date() }
    setUser(updatedUser)
    localStorage.setItem("inventario_user", JSON.stringify(updatedUser))

    // También actualizar en mockUsers
    const index = mockUsers.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      mockUsers[index] = updatedUser
    }

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
