"use client"

import type { CategoryStock } from "@/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useRouter } from "next/navigation"

interface CategoryChartProps {
  data: CategoryStock[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const router = useRouter()

  const chartData = data.map((item) => ({
    name: item.category.name,
    value: item.totalStock,
    color: item.category.color,
    id: item.category.id,
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/productos?categoryId=${categoryId}`)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-card-foreground">Stock por Categoría</h3>
        <p className="text-sm text-muted-foreground">Distribución del inventario actual</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(entry.id)}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "oklch(0.95 0 0)" }}
              labelStyle={{ color: "oklch(0.95 0 0)" }}
            />
            <Legend formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div
            key={item.category.id}
            onClick={() => handleCategoryClick(item.category.id)}
            className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors -mx-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.category.color }} />
              <span className="text-muted-foreground">{item.category.name}</span>
            </div>
            <span className="font-medium text-card-foreground">{formatCurrency(item.totalValue)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
