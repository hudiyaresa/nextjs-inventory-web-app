export interface InventoryItem {
  id: string
  itemName: string
  brand: string
  category: string
  source: "purchase" | "transfer" | "donation" | "return"
  destination?: string
  quantity: number
  description?: string
  expiryDate: string
  unitPrice?: number
  lastUpdated: string
  createdAt: string
}

// Mock inventory data
export const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    itemName: "MacBook Pro 16-inch",
    brand: "Apple",
    category: "Electronics",
    source: "purchase",
    quantity: 5,
    description: "Latest MacBook Pro with M3 chip",
    expiryDate: "9999-12-31",
    unitPrice: 2499.99,
    lastUpdated: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "2",
    itemName: "Office Chair",
    brand: "Herman Miller",
    category: "Furniture",
    source: "purchase",
    quantity: 12,
    description: "Ergonomic office chair",
    expiryDate: "9999-12-31",
    unitPrice: 899.99,
    lastUpdated: "2024-01-14T14:20:00Z",
    createdAt: "2024-01-12T11:15:00Z",
  },
  {
    id: "3",
    itemName: "Protein Powder",
    brand: "Optimum Nutrition",
    category: "Supplements",
    source: "donation",
    quantity: 8,
    description: "Whey protein powder, vanilla flavor",
    expiryDate: "2025-06-30",
    unitPrice: 45.99,
    lastUpdated: "2024-01-13T16:45:00Z",
    createdAt: "2024-01-08T13:30:00Z",
  },
  {
    id: "4",
    itemName: "Wireless Mouse",
    brand: "Logitech",
    category: "Electronics",
    source: "purchase",
    quantity: 25,
    description: "Wireless optical mouse",
    expiryDate: "9999-12-31",
    unitPrice: 29.99,
    lastUpdated: "2024-01-12T12:10:00Z",
    createdAt: "2024-01-05T10:20:00Z",
  },
  {
    id: "5",
    itemName: "Coffee Beans",
    brand: "Blue Bottle",
    category: "Food & Beverage",
    source: "purchase",
    quantity: 15,
    description: "Premium arabica coffee beans",
    expiryDate: "2024-12-31",
    unitPrice: 18.99,
    lastUpdated: "2024-01-11T09:30:00Z",
    createdAt: "2024-01-03T14:45:00Z",
  },
]

export const categories = [
  "Electronics",
  "Furniture",
  "Supplements",
  "Food & Beverage",
  "Office Supplies",
  "Clothing",
  "Books",
  "Tools",
  "Other",
]

export const sources = ["purchase", "transfer", "donation", "return"] as const
