"use client"

import type { Product } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onView?: (product: Product) => void
}

export function ProductTable({ products, onEdit, onDelete, onView }: ProductTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const getStockStatus = (product: Product) => {
    if (product.stock < product.minStock) {
      return { label: "Bajo", variant: "destructive" as const }
    }
    if (product.stock > product.maxStock * 0.8) {
      return { label: "Alto", variant: "default" as const }
    }
    return { label: "Normal", variant: "secondary" as const }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Producto</TableHead>
            <TableHead className="text-muted-foreground hidden md:table-cell">SKU</TableHead>
            <TableHead className="text-muted-foreground hidden lg:table-cell">Categoría</TableHead>
            <TableHead className="text-muted-foreground text-right">Precio</TableHead>
            <TableHead className="text-muted-foreground text-center">Stock</TableHead>
            <TableHead className="text-muted-foreground text-center hidden sm:table-cell">Estado</TableHead>
            <TableHead className="text-muted-foreground w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product)
            return (
              <TableRow key={product.id} className="border-border hover:bg-secondary/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={product.imageUrl || "/placeholder.svg?height=40&width=40&query=product"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-card-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate md:hidden">{product.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <code className="text-xs bg-secondary px-2 py-1 rounded">{product.sku}</code>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: product.category?.color,
                      color: product.category?.color,
                    }}
                  >
                    {product.category?.name || "Sin categoría"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-semibold",
                      product.stock < product.minStock && "text-destructive",
                      product.stock >= product.minStock && "text-card-foreground",
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  <Badge
                    variant={stockStatus.variant}
                    className={cn(
                      stockStatus.variant === "destructive" &&
                        "bg-destructive/10 text-destructive border-destructive/20",
                      stockStatus.variant === "default" && "bg-success/10 text-success border-success/20",
                      stockStatus.variant === "secondary" && "bg-secondary text-muted-foreground",
                    )}
                  >
                    {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(product)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(product)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(product)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
