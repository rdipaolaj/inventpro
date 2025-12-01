// ============================================
// INTERFACES PRINCIPALES - MAPEO PARA BACKEND
// ============================================

// Usuario del sistema
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = "admin" | "manager" | "employee"

// Categoría de productos
export interface Category {
  id: string
  name: string
  description: string
  color: string
  productCount: number
  createdAt: Date
  updatedAt: Date
}

// Producto principal
export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  cost: number
  stock: number
  minStock: number
  maxStock: number
  categoryId: string
  category?: Category
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Movimiento de inventario
export interface StockMovement {
  id: string
  type: MovementType
  quantity: number
  productId: string
  product?: Product
  userId: string
  user?: User
  reason: string
  reference?: string
  createdAt: Date
}

export type MovementType = "entrada" | "salida" | "ajuste"

// Proveedor
export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================
// DTOs - DATA TRANSFER OBJECTS PARA API
// ============================================

export interface CreateProductDTO {
  sku: string
  name: string
  description: string
  price: number
  cost: number
  stock: number
  minStock: number
  maxStock: number
  categoryId: string
  imageUrl?: string
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  isActive?: boolean
}

export interface CreateCategoryDTO {
  name: string
  description: string
  color: string
}

export interface CreateMovementDTO {
  type: MovementType
  quantity: number
  productId: string
  reason: string
  reference?: string
}

// ============================================
// TIPOS DE RESPUESTA API
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

export interface ProductFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  stockStatus?: "all" | "low" | "normal" | "high"
  isActive?: boolean
}

export interface MovementFilters {
  type?: MovementType
  productId?: string
  userId?: string
  startDate?: Date
  endDate?: Date
}

// ============================================
// ESTADÍSTICAS DASHBOARD
// ============================================

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  lowStockProducts: number
  totalStockValue: number
  recentMovements: StockMovement[]
  topProducts: ProductWithStats[]
  stockByCategory: CategoryStock[]
}

export interface ProductWithStats extends Product {
  totalMovements: number
  lastMovementDate?: Date
}

export interface CategoryStock {
  category: Category
  totalProducts: number
  totalStock: number
  totalValue: number
}
