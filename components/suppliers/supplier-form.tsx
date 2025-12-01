"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Supplier } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateSupplierDTO {
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  isActive: boolean
}

interface SupplierFormProps {
  supplier?: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateSupplierDTO) => void
}

export function SupplierForm({ supplier, open, onOpenChange, onSubmit }: SupplierFormProps) {
  const [formData, setFormData] = useState<CreateSupplierDTO>({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    isActive: true,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: supplier?.name || "",
        email: supplier?.email || "",
        phone: supplier?.phone || "",
        address: supplier?.address || "",
        contactPerson: supplier?.contactPerson || "",
        isActive: supplier?.isActive ?? true,
      })
    }
  }, [supplier, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            {supplier ? "Modifica los datos del proveedor" : "Registra un nuevo proveedor en el sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la empresa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: TechDistributor S.A."
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Persona de contacto</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+34 91 123 4567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contacto@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Dirección completa"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="font-medium text-sm">Estado activo</p>
              <p className="text-xs text-muted-foreground">El proveedor puede recibir pedidos</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{supplier ? "Guardar cambios" : "Crear proveedor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
