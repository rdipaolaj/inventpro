"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { MovementForm } from "@/components/movements/movement-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/toast-provider"
import { inventoryService } from "@/lib/services/inventory-service"
import type { StockMovement, Product, CreateMovementDTO } from "@/types"
import { Plus, ArrowDownCircle, ArrowUpCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockProducts } from "@/lib/mock-data"

function MovimientosContent() {
  const { showToast } = useToast()
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [formOpen, setFormOpen] = useState(false)

  const loadMovements = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getMovements(currentPage, 10)
      setMovements(data.items)
      setTotalPages(data.totalPages)
      setProducts(mockProducts)
    } catch (error) {
      console.error("Error loading movements:", error)
      showToast("Error al cargar movimientos", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovements()
  }, [currentPage])

  const handleSubmit = async (data: CreateMovementDTO) => {
    try {
      await inventoryService.createMovement(data)
      showToast("Movimiento registrado correctamente", "success")
      loadMovements()
    } catch (error) {
      console.error("Error creating movement:", error)
      const message = error instanceof Error ? error.message : "Error al registrar movimiento"
      showToast(message, "error")
    }
  }

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Movimientos" description="Historial de entradas, salidas y ajustes" />
        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Mostrando {movements.length} movimiento(s)</p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Movimiento
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-card animate-pulse" />
              ))}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">No hay movimientos</p>
              <p className="text-sm text-muted-foreground mb-4">Registra tu primer movimiento de inventario</p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar movimiento
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Tipo</TableHead>
                      <TableHead className="text-muted-foreground">Producto</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Motivo</TableHead>
                      <TableHead className="text-muted-foreground hidden lg:table-cell">Referencia</TableHead>
                      <TableHead className="text-muted-foreground text-right">Cantidad</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id} className="border-border hover:bg-secondary/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            <Badge
                              variant="outline"
                              className={cn(
                                movement.type === "entrada" && "border-success/30 text-success",
                                movement.type === "salida" && "border-destructive/30 text-destructive",
                                movement.type === "ajuste" && "border-warning/30 text-warning",
                              )}
                            >
                              {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{movement.product?.name || "Producto"}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{movement.reason}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {movement.reference ? (
                            <code className="text-xs bg-secondary px-2 py-1 rounded">{movement.reference}</code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-semibold",
                              movement.type === "entrada" && "text-success",
                              movement.type === "salida" && "text-destructive",
                              movement.type === "ajuste" && "text-warning",
                            )}
                          >
                            {movement.type === "salida" ? "-" : "+"}
                            {Math.abs(movement.quantity)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {formatDate(movement.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Anterior</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <span className="hidden sm:inline mr-1">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <MovementForm products={products} open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} />
    </div>
  )
}

export default function MovimientosPage() {
  return (
    <AuthGuard>
      <MovimientosContent />
    </AuthGuard>
  )
}
