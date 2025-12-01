"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface HeaderProps {
  title: string
  description?: string
}

const mockNotifications = [
  {
    id: "1",
    title: "Stock bajo: Teclado Mecánico RGB",
    description: "El producto tiene solo 8 unidades disponibles",
    time: "Hace 5 min",
    read: false,
    type: "warning" as const,
  },
  {
    id: "2",
    title: "Stock bajo: Escritorio Ajustable",
    description: "El producto tiene solo 3 unidades disponibles",
    time: "Hace 15 min",
    read: false,
    type: "warning" as const,
  },
  {
    id: "3",
    title: "Nuevo movimiento registrado",
    description: "María García registró una entrada de 50 monitores",
    time: "Hace 1 hora",
    read: true,
    type: "info" as const,
  },
]

export function Header({ title, description }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
        <div className="lg:pl-0 pl-12">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 bg-secondary border-0"
            />
          </form>

          <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationsOpen(true)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name || "Usuario"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/configuracion" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracion" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Notificaciones</DialogTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Marcar todo como leído
                </Button>
              )}
            </div>
            <DialogDescription>Tienes {unreadCount} notificación(es) sin leer</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay notificaciones</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        notification.type === "warning" && "bg-warning",
                        notification.type === "info" && "bg-primary",
                        notification.read && "opacity-0",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
