"use client"

import type { Product } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  if (!product) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const stockStatus =
    product.stock < product.minStock
      ? { label: "Stock bajo", color: "text-destructive" }
      : product.stock > product.maxStock * 0.8
        ? { label: "Stock alto", color: "text-success" }
        : { label: "Stock normal", color: "text-muted-foreground" }

  const margin = ((product.price - product.cost) / product.price) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Producto</DialogTitle>
          <DialogDescription>Información completa del producto</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image and basic info */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=96&width=96&query=product"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground">{product.name}</h3>
              <code className="text-xs bg-secondary px-2 py-1 rounded">{product.sku}</code>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: product.category?.color,
                    color: product.category?.color,
                  }}
                >
                  {product.category?.name || "Sin categoría"}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          <Separator />

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium mb-3">Precios</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Costo</p>
                <p className="font-semibold">{formatCurrency(product.cost)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Precio venta</p>
                <p className="font-semibold">{formatCurrency(product.price)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Margen</p>
                <p className="font-semibold text-success">{margin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock */}
          <div>
            <h4 className="text-sm font-medium mb-3">Inventario</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Stock actual</p>
                <p className={cn("font-semibold", stockStatus.color)}>{product.stock}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Mínimo</p>
                <p className="font-semibold">{product.minStock}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Máximo</p>
                <p className="font-semibold">{product.maxStock}</p>
              </div>
            </div>
            <p className={cn("text-sm mt-2", stockStatus.color)}>{stockStatus.label}</p>
          </div>

          <Separator />

          {/* Value */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor en inventario</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(product.stock * product.cost)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado</span>
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
