import { NextResponse } from "next/server"
import { otpStore } from "@/lib/otp-store"
import { signJwt } from "@/lib/jwt-server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
    const otp = typeof body?.otp === "string" ? body.otp.trim() : ""
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      )
    }
    const stored = otpStore.get(phone)
    if (!stored || stored.expires < Date.now()) {
      otpStore.delete(phone)
      return NextResponse.json(
        { error: "OTP expired or invalid" },
        { status: 401 }
      )
    }
    if (stored.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 })
    }
    otpStore.delete(phone)
    const user = { name: "User", phoneNumber: phone }
    const token = signJwt({ userId: phone })
    return NextResponse.json({
      message: "Welcome!",
      user,
      token,
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    )
  }
}
