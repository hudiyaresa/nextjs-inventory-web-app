import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export const inventoryItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  source: z.enum(["PURCHASE", "TRANSFER", "DONATION", "RETURN", "OTHER"]),
  destination: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  description: z.string().optional(),
  expiryDate: z.date().optional(),
  unitPrice: z.number().min(0, "Unit price must be non-negative").optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})
