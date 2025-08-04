"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Save, X } from "lucide-react"

type InventoryItem = {
  id: string
  itemName: string
  brand: string
  category: { id: string; name: string }
  categoryId: string
  source: string
  quantity: number
  description?: string
  expiryDate: string | null
  unitPrice?: number | null
}

export default function InventoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<InventoryItem> & { categoryId?: string }>({})

  const categories = items
    .reduce((acc, item) => {
      acc[item.category.id] = item.category.name
      return acc
    }, {} as Record<string, string>)
  const categoryList = Object.entries(categories).map(([id, name]) => ({ id, name }))

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data: InventoryItem[]) => setItems(data))
      .catch((err) => console.error("Failed to fetch inventory:", err))
  }, [user])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  function handleEditClick(item: InventoryItem) {
    setEditingItemId(item.id)
    setEditFormData({ ...item, categoryId: item.category.id })
  }

  function handleCancelEdit() {
    setEditingItemId(null)
    setEditFormData({})
  }

  function handleInputChange(field: keyof typeof editFormData, value: string | number) {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSaveEdit() {
    if (!editingItemId) return
    const body = {
      ...editFormData,
      quantity: Number(editFormData.quantity),
      unitPrice: editFormData.unitPrice ? Number(editFormData.unitPrice) : null,
      expiryDate: editFormData.expiryDate || null,
    }
    const res = await fetch(`/api/inventory/${editingItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) return alert("Failed to update item")
    const updated: InventoryItem = await res.json()
    setItems((prev) => prev.map((it) => (it.id === editingItemId ? updated : it)))
    setEditingItemId(null)
    setEditFormData({})
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Delete this item?")) return
    const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" })
    if (!res.ok) return alert("Failed to delete item")
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
          </div>
          <Button asChild>
            <Link href="/inventory/add"><Plus className="mr-2 h-4 w-4" />Add Item</Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Items ({filteredItems.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      {editingItemId === item.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editFormData.itemName || ""}
                              onChange={(e) => handleInputChange("itemName", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editFormData.brand || ""}
                              onChange={(e) => handleInputChange("brand", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editFormData.categoryId || ""}
                              onValueChange={(v) => handleInputChange("categoryId", v)}
                            >
                              {categoryList.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={editFormData.quantity?.toString() || "0"}
                              onChange={(e) => handleInputChange("quantity", Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editFormData.unitPrice?.toString() || ""}
                              onChange={(e) => handleInputChange("unitPrice", Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={editFormData.expiryDate?.startsWith("9999") ? "" : editFormData.expiryDate?.substring(0, 10) || ""}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={handleSaveEdit}><Save className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category.name}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={item.quantity < 10 ? "text-red-500 font-medium" : ""}>
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell>{item.unitPrice != null ? `$${item.unitPrice}` : "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{item.source.toLowerCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            {!item.expiryDate || item.expiryDate.startsWith("9999")
                              ? "No expiry"
                              : item.expiryDate.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
