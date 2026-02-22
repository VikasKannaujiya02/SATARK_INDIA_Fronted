import { createHmac } from "crypto"

const JWT_SECRET =
  process.env.JWT_SECRET || "satark-india-secret-key-change-in-production"

function base64UrlEncode(str: string | Buffer): string {
  return (Buffer.isBuffer(str) ? str : Buffer.from(str, "utf8"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export function signJwt(payload: { userId: string }, expiresInSeconds = 7 * 24 * 3600): string {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const payloadEnc = { ...payload, iat: now, exp: now + expiresInSeconds }
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payloadEnc))
  const signatureInput = `${headerB64}.${payloadB64}`
  const signature = createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest()
  const signatureB64 = base64UrlEncode(signature)
  return `${signatureInput}.${signatureB64}`
}
