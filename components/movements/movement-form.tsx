"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Product, CreateMovementDTO, MovementType } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MovementFormProps {
  products: Product[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateMovementDTO) => void
}

export function MovementForm({ products, open, onOpenChange, onSubmit }: MovementFormProps) {
  const [formData, setFormData] = useState<CreateMovementDTO>({
    type: "entrada",
    quantity: 0,
    productId: "",
    reason: "",
    reference: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        type: "entrada",
        quantity: 0,
        productId: "",
        reason: "",
        reference: "",
      })
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleChange = (field: keyof CreateMovementDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedProduct = products.find((p) => p.id === formData.productId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento</DialogTitle>
          <DialogDescription>Registra una entrada, salida o ajuste de inventario</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de movimiento</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value as MovementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
                <SelectItem value="ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productId">Producto</Label>
            <Select value={formData.productId} onValueChange={(value) => handleChange("productId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Stock actual: {selectedProduct.stock} | Mínimo: {selectedProduct.minStock}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity || ""}
              onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Describe el motivo del movimiento"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referencia (opcional)</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => handleChange("reference", e.target.value)}
              placeholder="PO-2024-001, SO-2024-045, etc."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
