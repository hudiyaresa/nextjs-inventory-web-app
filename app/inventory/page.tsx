"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Save, X } from "lucide-react"

type Category = { id: string; name: string }
type InventoryItem = {
  id: string
  itemName: string
  brand: string
  category: Category
  categoryId: string
  source: string
  quantity: number
  expiryDate: string | null
  unitPrice?: number | null
  description?: string
}

export default function InventoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<InventoryItem> & { categoryId?: string }>({})
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    fetch("/api/inventory")
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error)

    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error)
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) router.push("/signin")
  }, [isLoading, user, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  const filtered = items.filter((item) =>
    (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || item.category.id === selectedCategory)
  )

  function handleEdit(item: InventoryItem) {
    setEditingItemId(item.id)
    setEditFormData({
      ...item,
      categoryId: item.category.id,
      expiryDate: item.expiryDate ? item.expiryDate.substring(0, 10) : null,
    })
  }
  function cancelEdit() { setEditingItemId(null); setEditFormData({}) }
  function handleInputChange(field: keyof typeof editFormData, val: any) {
    setEditFormData((prev) => ({ ...prev, [field]: val }))
  }
  async function saveEdit() {
    if (!editingItemId) return
    if (!editFormData.itemName || !editFormData.brand || !editFormData.categoryId) {
      toast({ variant: "destructive", title: "Validation Error", description: "Name, Brand, Category required." })
      return
    }
    const body = {
      itemName: editFormData.itemName,
      brand: editFormData.brand,
      categoryId: editFormData.categoryId,
      quantity: Number(editFormData.quantity),
      unitPrice: editFormData.unitPrice != null ? Number(editFormData.unitPrice) : null,
      expiryDate: editFormData.expiryDate || null,
      source: editFormData.source || "",
      description: editFormData.description || "",
    }
    const res = await fetch(`/api/inventory/${editingItemId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
    if (!res.ok) {
      toast({ variant: "destructive", title: "Update failed", description: "Could not save item." })
      return
    }
    const updated: InventoryItem = await res.json()
    setItems((prev) => prev.map((it) => it.id === editingItemId ? updated : it))
    cancelEdit()
    toast({ title: "Item updated", description: "Changes saved successfully." })
  }

  async function confirmDelete() {
    if (!deleteTargetId) return
    const res = await fetch(`/api/inventory/${deleteTargetId}`, { method: "DELETE" })
    if (!res.ok) {
      toast({ variant: "destructive", title: "Delete failed", description: "Could not remove item." })
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== deleteTargetId))
    setDeleteTargetId(null)
    toast({ variant: "destructive", title: "Item deleted", description: "Deleted successfully." })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Filters + Add */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Button asChild><Link href="/inventory/add"><Plus className="mr-2 h-4 w-4" />Add Item</Link></Button>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
          <CardContent className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Items ({filtered.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Item</TableHead><TableHead>Brand</TableHead><TableHead>Category</TableHead>
                  <TableHead>Qty</TableHead><TableHead>Price</TableHead><TableHead>Source</TableHead>
                  <TableHead>Expiry</TableHead><TableHead>Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      {editingItemId === item.id ? (
                        <>
                          <TableCell><Input value={editFormData.itemName || ""} onChange={(e) => handleInputChange("itemName", e.target.value)} /></TableCell>
                          <TableCell><Input value={editFormData.brand || ""} onChange={(e) => handleInputChange("brand", e.target.value)} /></TableCell>
                          <TableCell>
                            <Select value={editFormData.categoryId || ""} onValueChange={(v) => handleInputChange("categoryId", v)}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                              <SelectContent>
                                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell><Input type="number" min="0" value={editFormData.quantity?.toString() || "0"} onChange={(e) => handleInputChange("quantity", Number(e.target.value))} /></TableCell>
                          <TableCell><Input type="number" step="0.01" min="0" value={editFormData.unitPrice?.toString() || ""} onChange={(e) => handleInputChange("unitPrice", Number(e.target.value))} /></TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell><Input type="date" value={editFormData.expiryDate || ""} onChange={(e) => handleInputChange("expiryDate", e.target.value)} /></TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={saveEdit}><Save className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell><Badge variant="secondary">{item.category.name}</Badge></TableCell>
                          <TableCell><span className={item.quantity < 10 ? "text-red-500 font-medium" : ""}>{item.quantity}</span></TableCell>
                          <TableCell>{item.unitPrice != null ? `$${item.unitPrice}` : "N/A"}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{item.source.toLowerCase()}</Badge></TableCell>
                          <TableCell>{!item.expiryDate || item.expiryDate.startsWith("9999") ? "No expiry" : item.expiryDate.substring(0, 10)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => setDeleteTargetId(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                                    <AlertDialogDescription>Are you sure you want to delete this item?</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
