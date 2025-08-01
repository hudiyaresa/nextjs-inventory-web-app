"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Shield, Users, UserCheck, UserX } from "lucide-react"

// Mock users data (in a real app, this would come from an API)
const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin" as const,
    status: "active" as const,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "user1",
    email: "user@example.com",
    role: "user" as const,
    status: "active" as const,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    username: "john_doe",
    email: "john@example.com",
    role: "user" as const,
    status: "inactive" as const,
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    username: "jane_smith",
    email: "jane@example.com",
    role: "user" as const,
    status: "active" as const,
    createdAt: "2024-01-04T00:00:00Z",
  },
]

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState(mockUsers)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)),
    )

    const targetUser = users.find((u) => u.id === userId)
    const newStatus = targetUser?.status === "active" ? "inactive" : "active"

    toast({
      title: "User Status Updated",
      description: `User has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const inactiveUsers = users.filter((u) => u.status === "inactive").length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <p className="text-muted-foreground">Manage user accounts, roles, and activation status.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Can access the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveUsers}</div>
              <p className="text-xs text-muted-foreground">Blocked from access</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and their access permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.username}</TableCell>
                      <TableCell>{userData.email}</TableCell>
                      <TableCell>
                        <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                          {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userData.status === "active" ? "default" : "destructive"}>
                          {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(userData.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {userData.id !== user.id && (
                          <Button
                            size="sm"
                            variant={userData.status === "active" ? "destructive" : "default"}
                            onClick={() => toggleUserStatus(userData.id)}
                          >
                            {userData.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                        )}
                        {userData.id === user.id && <span className="text-sm text-muted-foreground">Current User</span>}
                      </TableCell>
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
