import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { otpSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = otpSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find valid OTP
    const validOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: otp,
        expiry: {
          gt: new Date(),
        },
      },
    })

    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Delete used OTP
    await prisma.otp.delete({
      where: { id: validOtp.id },
    })

    return NextResponse.json({
      message: "OTP verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("OTP verify error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
