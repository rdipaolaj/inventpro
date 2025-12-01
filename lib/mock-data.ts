import type { User, Category, Product, StockMovement, Supplier, DashboardStats } from "@/types"

// ============================================
// USUARIOS DE PRUEBA
// ============================================

export const mockUsers: User[] = [
  {
    id: "usr_001",
    email: "admin@inventario.com",
    name: "Carlos Mendoza",
    role: "admin",
    avatar: "/admin-avatar-professional.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "usr_002",
    email: "manager@inventario.com",
    name: "María García",
    role: "manager",
    avatar: "/manager-avatar-woman.jpg",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "usr_003",
    email: "empleado@inventario.com",
    name: "Juan Pérez",
    role: "employee",
    avatar: "/employee-avatar-man.jpg",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-09-28"),
  },
]

// ============================================
// CATEGORÍAS DE PRUEBA
// ============================================

export const mockCategories: Category[] = [
  {
    id: "cat_001",
    name: "Electrónica",
    description: "Dispositivos electrónicos y accesorios",
    color: "#3B82F6",
    productCount: 45,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "cat_002",
    name: "Oficina",
    description: "Material y mobiliario de oficina",
    color: "#10B981",
    productCount: 32,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "cat_003",
    name: "Herramientas",
    description: "Herramientas manuales y eléctricas",
    color: "#F59E0B",
    productCount: 28,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-09-20"),
  },
  {
    id: "cat_004",
    name: "Limpieza",
    description: "Productos y equipos de limpieza",
    color: "#8B5CF6",
    productCount: 15,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-08-10"),
  },
  {
    id: "cat_005",
    name: "Seguridad",
    description: "Equipos de protección y seguridad",
    color: "#EF4444",
    productCount: 22,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-11-05"),
  },
]

// ============================================
// PRODUCTOS DE PRUEBA
// ============================================

export const mockProducts: Product[] = [
  {
    id: "prod_001",
    sku: "ELEC-001",
    name: 'Monitor LED 24"',
    description: "Monitor LED Full HD de 24 pulgadas con panel IPS",
    price: 299.99,
    cost: 180.0,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    categoryId: "cat_001",
    imageUrl: "/computer-monitor-led.jpg",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "prod_002",
    sku: "ELEC-002",
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches Cherry MX e iluminación RGB",
    price: 129.99,
    cost: 75.0,
    stock: 8,
    minStock: 15,
    maxStock: 80,
    categoryId: "cat_001",
    imageUrl: "/mechanical-keyboard-rgb.jpg",
    isActive: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-10-28"),
  },
  {
    id: "prod_003",
    sku: "ELEC-003",
    name: "Mouse Inalámbrico",
    description: "Mouse ergonómico inalámbrico con sensor óptico de alta precisión",
    price: 49.99,
    cost: 22.0,
    stock: 120,
    minStock: 20,
    maxStock: 150,
    categoryId: "cat_001",
    imageUrl: "/wireless-mouse-ergonomic.jpg",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-11-02"),
  },
  {
    id: "prod_004",
    sku: "OFIC-001",
    name: "Silla Ergonómica",
    description: "Silla de oficina ergonómica con soporte lumbar ajustable",
    price: 450.0,
    cost: 280.0,
    stock: 12,
    minStock: 5,
    maxStock: 30,
    categoryId: "cat_002",
    imageUrl: "/ergonomic-office-chair.png",
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "prod_005",
    sku: "OFIC-002",
    name: "Escritorio Ajustable",
    description: "Escritorio con altura ajustable eléctrico standing desk",
    price: 699.99,
    cost: 420.0,
    stock: 3,
    minStock: 5,
    maxStock: 20,
    categoryId: "cat_002",
    imageUrl: "/adjustable-standing-desk.png",
    isActive: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-09-30"),
  },
  {
    id: "prod_006",
    sku: "HERR-001",
    name: "Taladro Percutor",
    description: "Taladro percutor inalámbrico 20V con batería incluida",
    price: 189.99,
    cost: 110.0,
    stock: 25,
    minStock: 8,
    maxStock: 50,
    categoryId: "cat_003",
    imageUrl: "/cordless-drill-power-tool.jpg",
    isActive: true,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "prod_007",
    sku: "HERR-002",
    name: "Set Destornilladores",
    description: "Set de 32 destornilladores de precisión profesional",
    price: 45.99,
    cost: 18.0,
    stock: 65,
    minStock: 20,
    maxStock: 100,
    categoryId: "cat_003",
    imageUrl: "/screwdriver-set-professional.jpg",
    isActive: true,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-10-10"),
  },
  {
    id: "prod_008",
    sku: "LIMP-001",
    name: "Aspiradora Industrial",
    description: "Aspiradora industrial de alta potencia 2000W",
    price: 320.0,
    cost: 195.0,
    stock: 7,
    minStock: 3,
    maxStock: 15,
    categoryId: "cat_004",
    imageUrl: "/industrial-vacuum-cleaner.jpg",
    isActive: true,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-10-25"),
  },
  {
    id: "prod_009",
    sku: "SEG-001",
    name: "Casco de Seguridad",
    description: "Casco de seguridad industrial certificado EN 397",
    price: 35.99,
    cost: 12.0,
    stock: 150,
    minStock: 50,
    maxStock: 200,
    categoryId: "cat_005",
    imageUrl: "/safety-helmet-industrial.jpg",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-11-03"),
  },
  {
    id: "prod_010",
    sku: "SEG-002",
    name: "Guantes de Protección",
    description: "Guantes de protección anticorte nivel 5",
    price: 24.99,
    cost: 8.5,
    stock: 2,
    minStock: 30,
    maxStock: 100,
    categoryId: "cat_005",
    imageUrl: "/cut-resistant-gloves.jpg",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: "prod_011",
    sku: "ELEC-004",
    name: "Webcam HD 1080p",
    description: "Webcam profesional Full HD con micrófono integrado",
    price: 89.99,
    cost: 45.0,
    stock: 35,
    minStock: 10,
    maxStock: 60,
    categoryId: "cat_001",
    imageUrl: "/hd-webcam-professional.jpg",
    isActive: true,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "prod_012",
    sku: "OFIC-003",
    name: "Archivador Metálico",
    description: "Archivador de 4 cajones con cerradura de seguridad",
    price: 249.99,
    cost: 150.0,
    stock: 18,
    minStock: 5,
    maxStock: 25,
    categoryId: "cat_002",
    imageUrl: "/metal-filing-cabinet.jpg",
    isActive: true,
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-09-15"),
  },
]

// ============================================
// MOVIMIENTOS DE PRUEBA
// ============================================

export const mockMovements: StockMovement[] = [
  {
    id: "mov_001",
    type: "entrada",
    quantity: 50,
    productId: "prod_001",
    userId: "usr_001",
    reason: "Compra a proveedor",
    reference: "PO-2024-001",
    createdAt: new Date("2024-11-01T10:30:00"),
  },
  {
    id: "mov_002",
    type: "salida",
    quantity: 5,
    productId: "prod_001",
    userId: "usr_002",
    reason: "Venta a cliente",
    reference: "SO-2024-045",
    createdAt: new Date("2024-11-01T14:15:00"),
  },
  {
    id: "mov_003",
    type: "entrada",
    quantity: 100,
    productId: "prod_009",
    userId: "usr_001",
    reason: "Reposición de stock",
    reference: "PO-2024-002",
    createdAt: new Date("2024-11-02T09:00:00"),
  },
  {
    id: "mov_004",
    type: "ajuste",
    quantity: -3,
    productId: "prod_004",
    userId: "usr_003",
    reason: "Ajuste por inventario físico",
    createdAt: new Date("2024-11-02T16:45:00"),
  },
  {
    id: "mov_005",
    type: "salida",
    quantity: 20,
    productId: "prod_003",
    userId: "usr_002",
    reason: "Venta mayorista",
    reference: "SO-2024-046",
    createdAt: new Date("2024-11-03T11:20:00"),
  },
  {
    id: "mov_006",
    type: "entrada",
    quantity: 30,
    productId: "prod_002",
    userId: "usr_001",
    reason: "Compra urgente",
    reference: "PO-2024-003",
    createdAt: new Date("2024-11-03T15:30:00"),
  },
  {
    id: "mov_007",
    type: "salida",
    quantity: 10,
    productId: "prod_006",
    userId: "usr_002",
    reason: "Venta a cliente",
    reference: "SO-2024-047",
    createdAt: new Date("2024-11-04T10:00:00"),
  },
  {
    id: "mov_008",
    type: "ajuste",
    quantity: 5,
    productId: "prod_007",
    userId: "usr_001",
    reason: "Corrección de error de conteo",
    createdAt: new Date("2024-11-04T14:00:00"),
  },
]

// ============================================
// PROVEEDORES DE PRUEBA
// ============================================

export const mockSuppliers: Supplier[] = [
  {
    id: "sup_001",
    name: "TechDistributor S.A.",
    email: "ventas@techdist.com",
    phone: "+34 91 123 4567",
    address: "Calle Industrial 123, Madrid",
    contactPerson: "Ana López",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "sup_002",
    name: "Oficinas Pro",
    email: "contacto@oficinaspro.es",
    phone: "+34 93 234 5678",
    address: "Av. Diagonal 456, Barcelona",
    contactPerson: "Pedro Martín",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-09-20"),
  },
  {
    id: "sup_003",
    name: "Herramientas Express",
    email: "pedidos@herrexpress.com",
    phone: "+34 96 345 6789",
    address: "Polígono Norte 78, Valencia",
    contactPerson: "Luis Fernández",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-11-01"),
  },
]

// ============================================
// ESTADÍSTICAS DEL DASHBOARD
// ============================================

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  totalCategories: mockCategories.length,
  lowStockProducts: mockProducts.filter((p) => p.stock < p.minStock).length,
  totalStockValue: mockProducts.reduce((acc, p) => acc + p.stock * p.cost, 0),
  recentMovements: mockMovements.slice(0, 5),
  topProducts: mockProducts.slice(0, 5).map((p) => ({
    ...p,
    totalMovements: Math.floor(Math.random() * 50) + 10,
    lastMovementDate: new Date(),
  })),
  stockByCategory: mockCategories.map((cat) => ({
    category: cat,
    totalProducts: mockProducts.filter((p) => p.categoryId === cat.id).length,
    totalStock: mockProducts.filter((p) => p.categoryId === cat.id).reduce((acc, p) => acc + p.stock, 0),
    totalValue: mockProducts.filter((p) => p.categoryId === cat.id).reduce((acc, p) => acc + p.stock * p.cost, 0),
  })),
}

// ============================================
// HELPERS PARA DATOS
// ============================================

export function getProductWithCategory(productId: string): Product | undefined {
  const product = mockProducts.find((p) => p.id === productId)
  if (product) {
    return {
      ...product,
      category: mockCategories.find((c) => c.id === product.categoryId),
    }
  }
  return undefined
}

export function getMovementWithRelations(movementId: string): StockMovement | undefined {
  const movement = mockMovements.find((m) => m.id === movementId)
  if (movement) {
    return {
      ...movement,
      product: mockProducts.find((p) => p.id === movement.productId),
      user: mockUsers.find((u) => u.id === movement.userId),
    }
  }
  return undefined
}

export function getAllMovementsWithRelations(): StockMovement[] {
  return mockMovements.map((movement) => ({
    ...movement,
    product: mockProducts.find((p) => p.id === movement.productId),
    user: mockUsers.find((u) => u.id === movement.userId),
  }))
}

export function getAllProductsWithCategories(): Product[] {
  return mockProducts.map((product) => ({
    ...product,
    category: mockCategories.find((c) => c.id === product.categoryId),
  }))
}
