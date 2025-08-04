import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
      },
    })

    return NextResponse.json(inventoryItems)
  } catch (error) {
    console.error("Failed to fetch inventory:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
