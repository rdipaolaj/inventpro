import type {
  Product,
  Category,
  StockMovement,
  Supplier,
  ProductFilters,
  CreateProductDTO,
  UpdateProductDTO,
  CreateCategoryDTO,
  CreateMovementDTO,
  PaginatedResponse,
  DashboardStats,
} from "@/types"
import {
  mockProducts,
  mockCategories,
  mockMovements,
  mockSuppliers,
  mockUsers,
  getAllProductsWithCategories,
  getAllMovementsWithRelations,
} from "@/lib/mock-data"

// Simula delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const inventoryService = {
  // ==========================================
  // PRODUCTOS
  // ==========================================

  async getProducts(filters?: ProductFilters, page = 1, pageSize = 10): Promise<PaginatedResponse<Product>> {
    await delay(300)

    let products = getAllProductsWithCategories()

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase()
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search),
        )
      }

      if (filters.categoryId) {
        products = products.filter((p) => p.categoryId === filters.categoryId)
      }

      if (filters.stockStatus && filters.stockStatus !== "all") {
        products = products.filter((p) => {
          if (filters.stockStatus === "low") return p.stock < p.minStock
          if (filters.stockStatus === "high") return p.stock > p.maxStock * 0.8
          return p.stock >= p.minStock && p.stock <= p.maxStock * 0.8
        })
      }

      if (filters.isActive !== undefined) {
        products = products.filter((p) => p.isActive === filters.isActive)
      }
    }

    const total = products.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const items = products.slice(start, start + pageSize)

    return { items, total, page, pageSize, totalPages }
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(200)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) return null
    return {
      ...product,
      category: mockCategories.find((c) => c.id === product.categoryId),
    }
  },

  async createProduct(data: CreateProductDTO): Promise<Product> {
    await delay(400)
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product | null> {
    await delay(400)
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return null
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date(),
    }
    return mockProducts[index]
  },

  async deleteProduct(id: string): Promise<boolean> {
    await delay(300)
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return false
    mockProducts.splice(index, 1)
    return true
  },

  // ==========================================
  // CATEGORÍAS
  // ==========================================

  async getCategories(): Promise<Category[]> {
    await delay(200)
    return mockCategories.map((cat) => ({
      ...cat,
      productCount: mockProducts.filter((p) => p.categoryId === cat.id).length,
    }))
  },

  async getCategoryById(id: string): Promise<Category | null> {
    await delay(200)
    return mockCategories.find((c) => c.id === id) || null
  },

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    await delay(400)
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      ...data,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCategories.push(newCategory)
    return newCategory
  },

  async updateCategory(id: string, data: Partial<CreateCategoryDTO>): Promise<Category | null> {
    await delay(400)
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return null
    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
      updatedAt: new Date(),
    }
    return mockCategories[index]
  },

  async deleteCategory(id: string): Promise<boolean> {
    await delay(300)
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return false
    mockCategories.splice(index, 1)
    return true
  },

  // ==========================================
  // MOVIMIENTOS
  // ==========================================

  async getMovements(page = 1, pageSize = 10): Promise<PaginatedResponse<StockMovement>> {
    await delay(300)

    const movements = getAllMovementsWithRelations().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const total = movements.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const items = movements.slice(start, start + pageSize)

    return { items, total, page, pageSize, totalPages }
  },

  async createMovement(data: CreateMovementDTO): Promise<StockMovement> {
    await delay(400)

    const product = mockProducts.find((p) => p.id === data.productId)
    if (!product) throw new Error("Producto no encontrado")

    // Actualizar stock del producto
    if (data.type === "entrada") {
      product.stock += data.quantity
    } else if (data.type === "salida") {
      if (product.stock < data.quantity) {
        throw new Error("Stock insuficiente")
      }
      product.stock -= data.quantity
    } else {
      product.stock += data.quantity
    }

    const newMovement: StockMovement = {
      id: `mov_${Date.now()}`,
      ...data,
      userId: mockUsers[0].id,
      createdAt: new Date(),
    }

    mockMovements.unshift(newMovement)
    return {
      ...newMovement,
      product,
      user: mockUsers[0],
    }
  },

  // ==========================================
  // PROVEEDORES
  // ==========================================

  async getSuppliers(): Promise<Supplier[]> {
    await delay(200)
    return [...mockSuppliers]
  },

  async createSupplier(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> {
    await delay(400)
    const newSupplier: Supplier = {
      id: `sup_${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSuppliers.push(newSupplier)
    return newSupplier
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier | null> {
    await delay(400)
    const index = mockSuppliers.findIndex((s) => s.id === id)
    if (index === -1) return null
    mockSuppliers[index] = {
      ...mockSuppliers[index],
      ...data,
      updatedAt: new Date(),
    }
    return mockSuppliers[index]
  },

  async deleteSupplier(id: string): Promise<boolean> {
    await delay(300)
    const index = mockSuppliers.findIndex((s) => s.id === id)
    if (index === -1) return false
    mockSuppliers.splice(index, 1)
    return true
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400)

    const products = mockProducts
    const lowStockProducts = products.filter((p) => p.stock < p.minStock)
    const totalValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0)

    const movementsWithRelations = getAllMovementsWithRelations()

    // Calcular productos con más movimientos
    const productMovementCount: Record<string, number> = {}
    movementsWithRelations.forEach((m) => {
      productMovementCount[m.productId] = (productMovementCount[m.productId] || 0) + 1
    })

    const topProducts = products
      .map((p) => ({
        ...p,
        category: mockCategories.find((c) => c.id === p.categoryId),
        totalMovements: productMovementCount[p.id] || 0,
        lastMovementDate: movementsWithRelations.find((m) => m.productId === p.id)?.createdAt,
      }))
      .sort((a, b) => b.totalMovements - a.totalMovements)
      .slice(0, 5)

    return {
      totalProducts: products.length,
      totalCategories: mockCategories.length,
      lowStockProducts: lowStockProducts.length,
      totalStockValue: totalValue,
      recentMovements: movementsWithRelations.slice(0, 5),
      topProducts,
      stockByCategory: mockCategories.map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id)
        return {
          category: cat,
          totalProducts: catProducts.length,
          totalStock: catProducts.reduce((acc, p) => acc + p.stock, 0),
          totalValue: catProducts.reduce((acc, p) => acc + p.stock * p.cost, 0),
        }
      }),
    }
  },
}
