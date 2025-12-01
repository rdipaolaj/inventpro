"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/layout/auth-guard"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/toast-provider"
import { inventoryService } from "@/lib/services/inventory-service"
import type { Supplier } from "@/types"
import { Plus, MoreHorizontal, Pencil, Trash2, Mail, Phone } from "lucide-react"

interface CreateSupplierDTO {
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  isActive: boolean
}

function ProveedoresContent() {
  const { showToast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>()

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Error loading suppliers:", error)
      showToast("Error al cargar proveedores", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  const handleCreate = () => {
    setEditingSupplier(undefined)
    setFormOpen(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormOpen(true)
  }

  const handleDelete = async (supplier: Supplier) => {
    if (confirm(`¿Eliminar el proveedor "${supplier.name}"?`)) {
      try {
        await inventoryService.deleteSupplier(supplier.id)
        showToast("Proveedor eliminado correctamente", "success")
        loadSuppliers()
      } catch (error) {
        console.error("Error deleting supplier:", error)
        showToast("Error al eliminar el proveedor", "error")
      }
    }
  }

  const handleSubmit = async (data: CreateSupplierDTO) => {
    try {
      if (editingSupplier) {
        await inventoryService.updateSupplier(editingSupplier.id, data)
        showToast("Proveedor actualizado correctamente", "success")
      } else {
        await inventoryService.createSupplier(data)
        showToast("Proveedor creado correctamente", "success")
      }
      loadSuppliers()
    } catch (error) {
      console.error("Error saving supplier:", error)
      showToast("Error al guardar el proveedor", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title="Proveedores" description="Gestiona tus proveedores y contactos" />
        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{suppliers.length} proveedor(es) registrado(s)</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-card animate-pulse" />
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">No hay proveedores</p>
              <p className="text-sm text-muted-foreground mb-4">Registra tu primer proveedor</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear proveedor
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground">Proveedor</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Contacto</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Teléfono</TableHead>
                    <TableHead className="text-muted-foreground text-center">Estado</TableHead>
                    <TableHead className="text-muted-foreground w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="border-border hover:bg-secondary/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground truncate md:hidden">{supplier.contactPerson}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {supplier.contactPerson}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <a
                          href={`mailto:${supplier.email}`}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </a>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <a
                          href={`tel:${supplier.phone}`}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={supplier.isActive ? "default" : "secondary"}
                          className={supplier.isActive ? "bg-success/10 text-success border-success/20" : ""}
                        >
                          {supplier.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(supplier)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>

      <SupplierForm supplier={editingSupplier} open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} />
    </div>
  )
}

export default function ProveedoresPage() {
  return (
    <AuthGuard>
      <ProveedoresContent />
    </AuthGuard>
  )
}
