"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Product, Category, CreateProductDTO } from "@/types"
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

interface ProductFormProps {
  product?: Product
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateProductDTO) => void
}

export function ProductForm({ product, categories, open, onOpenChange, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductDTO>({
    sku: "",
    name: "",
    description: "",
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    maxStock: 100,
    categoryId: "",
    imageUrl: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        sku: product?.sku || "",
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        cost: product?.cost || 0,
        stock: product?.stock || 0,
        minStock: product?.minStock || 0,
        maxStock: product?.maxStock || 100,
        categoryId: product?.categoryId || "",
        imageUrl: product?.imageUrl || "",
      })
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleChange = (field: keyof CreateProductDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifica los datos del producto" : "Completa los datos para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="ELEC-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleChange("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Precio de venta</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => handleChange("cost", Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock actual</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock mínimo</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => handleChange("minStock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Stock máximo</Label>
              <Input
                id="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={(e) => handleChange("maxStock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de imagen</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{product ? "Guardar cambios" : "Crear producto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
