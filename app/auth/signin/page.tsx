"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { Mail, Lock, Smartphone } from "lucide-react"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [otpData, setOtpData] = useState({ email: "", otp: "" })
  const router = useRouter()
  const { toast } = useToast()

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpData.email }),
      })

      if (response.ok) {
        setOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "Check your email for the verification code.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Failed to send OTP",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpData),
      })

      if (response.ok) {
        // Sign in the user after OTP verification
        const result = await signIn("credentials", {
          email: otpData.email,
          password: "otp-verified", // Special flag for OTP login
          redirect: false,
        })

        if (!result?.error) {
          toast({
            title: "Welcome!",
            description: "You have been successfully signed in.",
          })
          router.push("/dashboard")
        }
      } else {
        const error = await response.json()
        toast({
          title: "Verification failed",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credentials">
                    <Lock className="mr-2 h-4 w-4" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="otp">
                    <Smartphone className="mr-2 h-4 w-4" />
                    OTP
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credentials">
                  <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="otp">
                  {!otpSent ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp-email">Email</Label>
                        <Input
                          id="otp-email"
                          type="email"
                          placeholder="Enter your email"
                          value={otpData.email}
                          onChange={(e) => setOtpData({ ...otpData, email: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp-code">Verification Code</Label>
                        <Input
                          id="otp-code"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otpData.otp}
                          onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                          maxLength={6}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setOtpSent(false)}
                      >
                        Back
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Separator />
                <div className="mt-6">
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn("google")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {"Don't have an account? "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Demo Accounts:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Admin:</strong> admin@inventory.com / admin123
                  </p>
                  <p>
                    <strong>User:</strong> user@inventory.com / user123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
