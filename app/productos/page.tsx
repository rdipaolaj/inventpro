"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { ProductTable } from "@/components/products/product-table"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductForm } from "@/components/products/product-form"
import { ProductDetailModal } from "@/components/products/product-detail-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"
import { inventoryService } from "@/lib/services/inventory-service"
import type { Product, Category, ProductFilters as ProductFiltersType, CreateProductDTO } from "@/types"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

function ProductosContent() {
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProductFiltersType>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const search = searchParams.get("search")
    const stockStatus = searchParams.get("stockStatus")
    const categoryId = searchParams.get("categoryId")

    if (search || stockStatus || categoryId) {
      const newFilters: ProductFiltersType = {}
      if (search) newFilters.search = search
      if (stockStatus) newFilters.stockStatus = stockStatus as ProductFiltersType["stockStatus"]
      if (categoryId) newFilters.categoryId = categoryId
      setFilters(newFilters)
    }
  }, [searchParams])

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        inventoryService.getProducts(filters, currentPage, 8),
        inventoryService.getCategories(),
      ])
      setProducts(productsRes.items)
      setTotalPages(productsRes.totalPages)
      setCategories(categoriesRes)
    } catch (error) {
      console.error("Error loading products:", error)
      showToast("Error al cargar productos", "error")
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, showToast])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleView = (product: Product) => {
    setViewingProduct(product)
    setDetailOpen(true)
  }

  const handleCreate = () => {
    setEditingProduct(undefined)
    setFormOpen(true)
  }

  const handleSubmit = async (data: CreateProductDTO) => {
    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, data)
        showToast("Producto actualizado correctamente", "success")
      } else {
        await inventoryService.createProduct(data)
        showToast("Producto creado correctamente", "success")
      }
      loadProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      showToast("Error al guardar el producto", "error")
    }
  }

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Eliminar "${product.name}"?`)) {
      try {
        await inventoryService.deleteProduct(product.id)
        showToast("Producto eliminado correctamente", "success")
        loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        showToast("Error al eliminar el producto", "error")
      }
    }
  }

  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Productos" description="Gestiona el catálogo de productos" />
        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <ProductFilters categories={categories} filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
            <Button onClick={handleCreate} className="sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-card animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">No se encontraron productos</p>
              <p className="text-sm text-muted-foreground mb-4">
                Prueba ajustando los filtros o crea un nuevo producto
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear producto
              </Button>
            </div>
          ) : (
            <>
              <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
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

      <ProductForm
        product={editingProduct}
        categories={categories}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <ProductDetailModal product={viewingProduct} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}

function ProductosPageContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductosContent />
    </Suspense>
  )
}

export default function ProductosPage() {
  return (
    <AuthGuard>
      <ProductosPageContent />
    </AuthGuard>
  )
}
