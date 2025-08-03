import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface Params {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        category: true,
        lastModifiedUser: true,
      },
    })

    if (!item || item.deletedAt) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("GET /api/inventory/[id] Error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory item" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = params
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

    // Check item
    const existingItem = await prisma.inventoryItem.findUnique({ where: { id } })
    if (!existingItem || existingItem.deletedAt) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
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

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("PUT /api/inventory/[id] Error:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = params

    // Soft delete using set deletedAt to date now
    const existingItem = await prisma.inventoryItem.findUnique({ where: { id } })
    if (!existingItem || existingItem.deletedAt) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    await prisma.inventoryItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ message: "Inventory item deleted" }, { status: 200 })
  } catch (error) {
    console.error("DELETE /api/inventory/[id] Error:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}
