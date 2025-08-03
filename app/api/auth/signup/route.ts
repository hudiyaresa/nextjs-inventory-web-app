import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
  });

  const { email, password, name } = schema.parse(data);

  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // ⬇️ Call the send-otp API after user is created
  await fetch(`${process.env.BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return NextResponse.json({ user });
}