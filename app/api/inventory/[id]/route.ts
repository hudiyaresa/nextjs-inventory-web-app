import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const {
      itemName,
      brand,
      categoryId,
      quantity,
      unitPrice,
      expiryDate,
      source,
      description,
    } = await req.json()

    // Validation
    if (!itemName || !brand || !categoryId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        itemName,
        brand,
        categoryId,
        quantity: Number(quantity),
        unitPrice: unitPrice !== undefined ? Number(unitPrice) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        source,
        description,
        updatedAt: new Date(),
      },
      include: {
        category: true, //include category
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(), // mark as deleted
      },
    })

    return new NextResponse(null, { status: 204 }) // no content
  } catch (error) {
    console.error(error)
    return new NextResponse("Failed to soft delete", { status: 500 })
  }
}
