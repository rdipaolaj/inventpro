"use client"

import type { Product } from "@/types"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const router = useRouter()

  const handleViewAll = () => {
    router.push("/productos?stockStatus=low")
  }

  const handleViewProduct = (productId: string) => {
    router.push(`/productos?search=${productId}`)
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <AlertTriangle className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Stock Saludable</h3>
            <p className="text-sm text-muted-foreground">Todos los productos tienen stock adecuado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5">
      <div className="p-6 border-b border-warning/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Alerta de Stock Bajo</h3>
            <p className="text-sm text-muted-foreground">{products.length} producto(s) necesitan reposición</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-warning/20">
        {products.slice(0, 5).map((product) => (
          <div
            key={product.id}
            onClick={() => handleViewProduct(product.sku)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-warning/10 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-destructive">
                {product.stock} / {product.minStock}
              </p>
              <p className="text-xs text-muted-foreground">actual / mínimo</p>
            </div>
          </div>
        ))}
      </div>
      {products.length > 5 && (
        <div className="p-4 border-t border-warning/20">
          <Button
            variant="outline"
            className="w-full border-warning/30 text-warning hover:bg-warning/10 bg-transparent"
            onClick={handleViewAll}
          >
            Ver todos ({products.length})
          </Button>
        </div>
      )}
    </div>
  )
}
