"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/toast-provider"
import { User, Bell, Shield, Database, Loader2 } from "lucide-react"

function ConfiguracionContent() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  // Profile state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [savingProfile, setSavingProfile] = useState(false)

  // Notification settings
  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailySummary: false,
    newMovements: true,
  })

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)

    try {
      await updateProfile({ name, email })
      showToast("Perfil actualizado correctamente", "success")
    } catch {
      showToast("Error al actualizar el perfil", "error")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveNotifications = () => {
    // Simular guardado
    showToast("Preferencias de notificación guardadas", "success")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.new !== passwords.confirm) {
      showToast("Las contraseñas no coinciden", "error")
      return
    }

    if (passwords.new.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    setSavingPassword(true)

    // Simular cambio de contraseña
    await new Promise((resolve) => setTimeout(resolve, 1000))

    showToast("Contraseña actualizada correctamente", "success")
    setPasswords({ current: "", new: "", confirm: "" })
    setSavingPassword(false)
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "manager":
        return "Gerente"
      case "employee":
        return "Empleado"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Configuración" description="Administra tu cuenta y preferencias" />
        <main className="p-4 lg:p-6 space-y-6 max-w-4xl">
          {/* Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Perfil de Usuario</CardTitle>
                  <CardDescription>Información personal y credenciales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={getRoleName(user?.role || "")} disabled />
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura las alertas del sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Alerta de stock bajo</p>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificación cuando un producto llegue al stock mínimo
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, lowStock: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Resumen diario</p>
                  <p className="text-sm text-muted-foreground">Recibir un resumen de movimientos al final del día</p>
                </div>
                <Switch
                  checked={notifications.dailySummary}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dailySummary: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Nuevos movimientos</p>
                  <p className="text-sm text-muted-foreground">Notificar cuando otros usuarios registren movimientos</p>
                </div>
                <Switch
                  checked={notifications.newMovements}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newMovements: checked }))}
                />
              </div>
              <Button variant="outline" onClick={handleSaveNotifications}>
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Protege tu cuenta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" variant="outline" disabled={savingPassword}>
                  {savingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>Datos técnicos y conexión</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Versión</p>
                  <p className="font-medium text-card-foreground">InvenPro v1.0.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Base de datos</p>
                  <p className="font-medium text-card-foreground">PostgreSQL (AWS RDS)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última sincronización</p>
                  <p className="font-medium text-card-foreground">Hace 5 minutos</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className="font-medium text-success">Conectado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default function ConfiguracionPage() {
  return (
    <AuthGuard>
      <ConfiguracionContent />
    </AuthGuard>
  )
}
