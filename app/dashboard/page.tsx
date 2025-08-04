"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton" // contoh skeleton component

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [inventory, setInventory] = useState<any[]>([])
  const [loadingInventory, setLoadingInventory] = useState(true)

  // States untuk tiap card
  const [totalItems, setTotalItems] = useState<number | null>(null)
  const [totalValue, setTotalValue] = useState<number | null>(null)
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null)
  const [lowStockItems, setLowStockItems] = useState<number | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [pieData, setPieData] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true)
      try {
        const res = await fetch("/api/inventory/summary")
        const data = await res.json()
        setInventory(data)
        setLoadingInventory(false)
      } catch (error) {
        console.error("Failed to load inventory:", error)
        setLoadingInventory(false)
      }
    }

    fetchInventory()
  }, [])

  // Proses data tiap bagian secara terpisah setelah inventory siap
  useEffect(() => {
    if (!loadingInventory && inventory.length > 0) {
      const safeInventory = Array.isArray(inventory) ? inventory : []

      // Total Items
      setTotalItems(safeInventory.reduce((sum, item) => sum + (item.quantity || 0), 0))

      // Total Value
      setTotalValue(
        safeInventory.reduce(
          (sum, item) => sum + (item.quantity || 0) * (parseFloat(item.unitPrice || 0)),
          0,
        ),
      )

      // Categories Count
      const categoryData = safeInventory.reduce((acc: Record<string, number>, item) => {
        const cat = item.category?.name || "Unknown"
        acc[cat] = (acc[cat] || 0) + (item.quantity || 0)
        return acc
      }, {})
      setCategoriesCount(Object.keys(categoryData).length)

      // Low Stock Items
      setLowStockItems(safeInventory.filter((item) => item.quantity < 10).length)

      // Chart data
      setChartData(
        Object.entries(categoryData).map(([category, quantity]) => ({
          category,
          quantity,
        })),
      )

      setPieData(
        Object.entries(categoryData).map(([category, quantity]) => ({
          name: category,
          value: quantity,
        })),
      )
    }
  }, [loadingInventory, inventory])

  if (isLoading) return <div>Loading user...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's your inventory overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Items Card */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {totalItems === null ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {inventory.length} products
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Value Card */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {totalValue === null ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Inventory worth</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Categories Count Card */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {categoriesCount === null ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{categoriesCount}</div>
                  <p className="text-xs text-muted-foreground">Different categories</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Items Card */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {lowStockItems === null ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Items below 10 units</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Items by Category</CardTitle>
              <CardDescription>Distribution of inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Percentage breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your inventory efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/inventory/add">Add New Item</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/inventory">View All Items</Link>
              </Button>
              {user.role === "ADMIN" && (
                <Button variant="outline" asChild>
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/settings">Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
