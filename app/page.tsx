import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Package, BarChart3, Users, Globe, Search, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Advanced Inventory
              <span className="text-primary"> Management</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Professional inventory management with real-time tracking, advanced analytics, and enterprise-grade
              security. Built for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalog">Browse Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for professional inventory management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Inventory Tracking</CardTitle>
                <CardDescription>
                  Advanced tracking with expiry alerts, low stock warnings, and automated categorization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards with charts, trends, and actionable insights for better decision making
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Role-based access control with admin capabilities and user activity tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Google OAuth, OTP authentication, password encryption, and audit logging
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>
                  Powerful search and filtering across all inventory attributes with pagination
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Public Catalog</CardTitle>
                <CardDescription>
                  Share inventory publicly with customizable views and responsive design
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Powered by Next.js, TypeScript, Prisma, and PostgreSQL for maximum performance and reliability
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-muted rounded-lg">Next.js 14</div>
              <div className="p-4 bg-muted rounded-lg">TypeScript</div>
              <div className="p-4 bg-muted rounded-lg">Prisma ORM</div>
              <div className="p-4 bg-muted rounded-lg">PostgreSQL</div>
              <div className="p-4 bg-muted rounded-lg">NextAuth.js</div>
              <div className="p-4 bg-muted rounded-lg">Tailwind CSS</div>
              <div className="p-4 bg-muted rounded-lg">Recharts</div>
              <div className="p-4 bg-muted rounded-lg">Zod Validation</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Inventory?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join businesses worldwide using our advanced inventory management system
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
