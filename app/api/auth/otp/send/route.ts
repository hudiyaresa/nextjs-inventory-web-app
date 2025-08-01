import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOTPEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.status === "INACTIVE") {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete existing OTPs for this user
    await prisma.otp.deleteMany({
      where: { userId: user.id },
    })

    // Create new OTP
    await prisma.otp.create({
      data: {
        code: otp,
        expiry,
        userId: user.id,
      },
    })

    // Send OTP email
    await sendOTPEmail(email, otp)

    return NextResponse.json({
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("OTP send error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
