"use client"

import { useState, useEffect } from "react"
import type { ProductFilters as ProductFiltersType, Category } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"

interface ProductFiltersProps {
  categories: Category[]
  filters: ProductFiltersType
  onFiltersChange: (filters: ProductFiltersType) => void
}

export function ProductFilters({ categories, filters, onFiltersChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search || "")

  useEffect(() => {
    setSearchValue(filters.search || "")
  }, [filters.search])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onFiltersChange({ ...filters, search: value })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      categoryId: value === "all" ? undefined : value,
    })
  }

  const handleStockStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      stockStatus: value === "all" ? undefined : (value as ProductFiltersType["stockStatus"]),
    })
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({})
  }

  const hasActiveFilters = filters.search || filters.categoryId || filters.stockStatus

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        {/* Mobile filter toggle */}
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="sm:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>

        {/* Desktop filters */}
        <div className="hidden sm:flex items-center gap-3">
          <Select value={filters.categoryId || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-44 bg-secondary border-0">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.stockStatus || "all"} onValueChange={handleStockStatusChange}>
            <SelectTrigger className="w-36 bg-secondary border-0">
              <SelectValue placeholder="Estado stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el stock</SelectItem>
              <SelectItem value="low">Stock bajo</SelectItem>
              <SelectItem value="normal">Stock normal</SelectItem>
              <SelectItem value="high">Stock alto</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Mobile filters panel */}
      {isOpen && (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary sm:hidden">
          <Select value={filters.categoryId || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-card border-0">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.stockStatus || "all"} onValueChange={handleStockStatusChange}>
            <SelectTrigger className="bg-card border-0">
              <SelectValue placeholder="Estado stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el stock</SelectItem>
              <SelectItem value="low">Stock bajo</SelectItem>
              <SelectItem value="normal">Stock normal</SelectItem>
              <SelectItem value="high">Stock alto</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
