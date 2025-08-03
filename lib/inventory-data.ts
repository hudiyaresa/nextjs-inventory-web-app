import { Source } from "@prisma/client"

export function getSourceLabel(source: Source): string {
  return source.charAt(0) + source.slice(1).toLowerCase()
}

export const sources = Object.values(Source)

// Dummy category
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
