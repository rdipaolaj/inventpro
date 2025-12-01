"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Category, CreateCategoryDTO } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CategoryFormProps {
  category?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCategoryDTO) => void
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
]

export function CategoryForm({ category, open, onOpenChange, onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryDTO>({
    name: "",
    description: "",
    color: PRESET_COLORS[0],
  })

  // Reset form when category changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: category?.name || "",
        description: category?.description || "",
        color: category?.color || PRESET_COLORS[0],
      })
    }
  }, [category, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          <DialogDescription>
            {category ? "Modifica los datos de la categoría" : "Crea una nueva categoría para organizar productos"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Electrónica"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción de la categoría"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    formData.color === color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{category ? "Guardar cambios" : "Crear categoría"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
