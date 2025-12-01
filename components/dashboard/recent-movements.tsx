"use client"

import type { StockMovement } from "@/types"
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface RecentMovementsProps {
  movements: StockMovement[]
}

export function RecentMovements({ movements }: RecentMovementsProps) {
  const router = useRouter()

  const getMovementIcon = (type: StockMovement["type"]) => {
    switch (type) {
      case "entrada":
        return <ArrowDownCircle className="h-4 w-4 text-success" />
      case "salida":
        return <ArrowUpCircle className="h-4 w-4 text-destructive" />
      case "ajuste":
        return <RefreshCw className="h-4 w-4 text-warning" />
    }
  }

  const getMovementLabel = (type: StockMovement["type"]) => {
    switch (type) {
      case "entrada":
        return "Entrada"
      case "salida":
        return "Salida"
      case "ajuste":
        return "Ajuste"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleViewAll = () => {
    router.push("/movimientos")
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">Movimientos Recientes</h3>
          <p className="text-sm text-muted-foreground">Últimas operaciones de inventario</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          Ver todos
        </Button>
      </div>
      <div className="divide-y divide-border">
        {movements.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No hay movimientos recientes</div>
        ) : (
          movements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {getMovementIcon(movement.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{movement.product?.name || "Producto"}</p>
                  <p className="text-xs text-muted-foreground">
                    {getMovementLabel(movement.type)} - {movement.reason}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    movement.type === "entrada" && "text-success",
                    movement.type === "salida" && "text-destructive",
                    movement.type === "ajuste" && "text-warning",
                  )}
                >
                  {movement.type === "salida" ? "-" : "+"}
                  {Math.abs(movement.quantity)} uds
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(movement.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
