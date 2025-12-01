"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "warning" | "success" | "destructive"
  href?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, variant = "default", href }: StatsCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all",
        href && "cursor-pointer hover:border-primary/50 hover:shadow-lg",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "+" : ""}
              {trend.value}% desde el mes pasado
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "success" && "bg-success/10 text-success",
            variant === "destructive" && "bg-destructive/10 text-destructive",
            variant === "default" && "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
