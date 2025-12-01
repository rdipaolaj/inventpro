"use client"

import type { Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Package } from "lucide-react"

interface CategoryCardProps {
  category: Category
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Package className="h-6 w-6" style={{ color: category.color }} />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete?.(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h3 className="font-semibold text-card-foreground mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Productos</span>
        <span className="font-semibold text-card-foreground">{category.productCount}</span>
      </div>
    </div>
  )
}
