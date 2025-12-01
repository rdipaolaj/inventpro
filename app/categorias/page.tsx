"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { CategoryCard } from "@/components/categories/category-card"
import { CategoryForm } from "@/components/categories/category-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"
import { inventoryService } from "@/lib/services/inventory-service"
import type { Category, CreateCategoryDTO } from "@/types"
import { Plus } from "lucide-react"

function CategoriasContent() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      showToast("Error al cargar categorías", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreate = () => {
    setEditingCategory(undefined)
    setFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (confirm(`¿Eliminar la categoría "${category.name}"? Los productos asociados quedarán sin categoría.`)) {
      try {
        await inventoryService.deleteCategory(category.id)
        showToast("Categoría eliminada correctamente", "success")
        loadCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        showToast("Error al eliminar la categoría", "error")
      }
    }
  }

  const handleSubmit = async (data: CreateCategoryDTO) => {
    try {
      if (editingCategory) {
        await inventoryService.updateCategory(editingCategory.id, data)
        showToast("Categoría actualizada correctamente", "success")
      } else {
        await inventoryService.createCategory(data)
        showToast("Categoría creada correctamente", "success")
      }
      loadCategories()
    } catch (error) {
      console.error("Error saving category:", error)
      showToast("Error al guardar la categoría", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Categorías" description="Organiza tus productos por categorías" />
        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{categories.length} categoría(s) en total</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">No hay categorías</p>
              <p className="text-sm text-muted-foreground mb-4">Crea categorías para organizar tus productos</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear categoría
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CategoryForm category={editingCategory} open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} />
    </div>
  )
}

export default function CategoriasPage() {
  return (
    <AuthGuard>
      <CategoriasContent />
    </AuthGuard>
  )
}
