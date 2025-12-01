"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentMovements } from "@/components/dashboard/recent-movements"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { inventoryService } from "@/lib/services/inventory-service"
import type { DashboardStats, Product } from "@/types"
import { Package, FolderTree, AlertTriangle, DollarSign } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardStats = await inventoryService.getDashboardStats()
        setStats(dashboardStats)
        setLowStockProducts(mockProducts.filter((p) => p.stock < p.minStock))
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-64">
          <Header title="Dashboard" description="Cargando..." />
          <main className="p-4 lg:p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-card" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Dashboard" description="Resumen general del inventario" />
        <main className="p-4 lg:p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Productos"
              value={stats?.totalProducts || 0}
              icon={Package}
              trend={{ value: 12, isPositive: true }}
              href="/productos"
            />
            <StatsCard
              title="Categorías"
              value={stats?.totalCategories || 0}
              icon={FolderTree}
              variant="success"
              href="/categorias"
            />
            <StatsCard
              title="Stock Bajo"
              value={stats?.lowStockProducts || 0}
              icon={AlertTriangle}
              variant={(stats?.lowStockProducts || 0) > 0 ? "warning" : "success"}
              description="Productos por debajo del mínimo"
              href="/productos?stockStatus=low"
            />
            <StatsCard
              title="Valor del Inventario"
              value={formatCurrency(stats?.totalStockValue || 0)}
              icon={DollarSign}
              trend={{ value: 8.5, isPositive: true }}
              href="/productos"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <RecentMovements movements={stats?.recentMovements || []} />
            </div>
            <div className="space-y-6">
              <LowStockAlert products={lowStockProducts} />
              <CategoryChart data={stats?.stockByCategory || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
