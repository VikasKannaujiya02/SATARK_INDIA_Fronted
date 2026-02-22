import { NextResponse } from "next/server"
import { otpStore } from "@/lib/otp-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 })
    }
    const otp = String(Math.floor(1000 + Math.random() * 9000))
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 })
    return NextResponse.json({ success: true, message: "OTP sent" })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    )
  }
}
