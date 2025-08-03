import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // soft delete check
    const items = await prisma.inventoryItem.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        category: true,
        lastModifiedUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/inventory Error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validation
    if (
      !body.itemName ||
      !body.brand ||
      !body.categoryId ||
      !body.source ||
      !body.quantity ||
      !body.lastModifiedBy
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // New item
    const newItem = await prisma.inventoryItem.create({
      data: {
        itemName: body.itemName,
        brand: body.brand,
        categoryId: body.categoryId,
        source: body.source.toUpperCase(),
        destination: body.destination ?? null,
        quantity: Number(body.quantity),
        description: body.description ?? null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        unitPrice: body.unitPrice ? Number(body.unitPrice) : null,
        lastModifiedBy: body.lastModifiedBy,
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("POST /api/inventory Error:", error)
    return NextResponse.json({ error: "Failed to add inventory item" }, { status: 500 })
  }
}
