"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { categories } from "@/lib/inventory-data"
import { Search, Plus, Edit, Trash2, Save, X } from "lucide-react"
import Link from "next/link"

type InventoryItem = {
  id: string
  itemName: string
  brand: string
  category: string
  source: string
  quantity: number
  description?: string
  expiryDate: string
  unitPrice?: number
}

export default function InventoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // States
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<InventoryItem>>({})

  // Auth check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  // Fetch inventory items from API
  useEffect(() => {
    if (!user) return
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data: InventoryItem[]) => setItems(data))
      .catch((err) => console.error("Failed to fetch inventory:", err))
  }, [user])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  // Filtering logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handlers
  function handleEditClick(item: InventoryItem) {
    setEditingItemId(item.id)
    setEditFormData({ ...item })
  }

  function handleCancelEdit() {
    setEditingItemId(null)
    setEditFormData({})
  }

  function handleInputChange(field: keyof InventoryItem, value: string | number) {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSaveEdit() {
    if (!editingItemId) return

    try {
      const res = await fetch(`/api/inventory/${editingItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      if (!res.ok) throw new Error("Failed to update item")

      const updatedItem = await res.json()
      setItems((prev) =>
        prev.map((item) => (item.id === editingItemId ? updatedItem : item))
      )
      setEditingItemId(null)
      setEditFormData({})
    } catch (error) {
      console.error(error)
      alert("Failed to update item")
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete item")

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to delete item")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your inventory items, update quantities, and track changes.
            </p>
          </div>
          <Button asChild>
            <Link href="/inventory/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or brands..."
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Items ({filteredItems.length})</CardTitle>
            <CardDescription>Complete list of your inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      {/* If editing this row, show inputs */}
                      {editingItemId === item.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editFormData.itemName || ""}
                              onChange={(e) =>
                                handleInputChange("itemName", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editFormData.brand || ""}
                              onChange={(e) =>
                                handleInputChange("brand", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editFormData.category || ""}
                              onValueChange={(value) =>
                                handleInputChange("category", value)
                              }
                            >
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              value={editFormData.quantity || 0}
                              onChange={(e) =>
                                handleInputChange("quantity", Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              value={editFormData.unitPrice || 0}
                              onChange={(e) =>
                                handleInputChange("unitPrice", Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={
                                editFormData.expiryDate
                                  ? editFormData.expiryDate.substring(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange("expiryDate", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSaveEdit}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{item.itemName}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={item.quantity < 10 ? "text-red-500 font-medium" : ""}
                            >
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.unitPrice ? `$${item.unitPrice}` : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.expiryDate === "9999-12-31"
                              ? "No expiry"
                              : item.expiryDate.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
