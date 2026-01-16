import { ok } from "../_utils/responses"

export const runtime = "nodejs" // utile si tu fais du fs/sharp/etc.

export async function GET() {
  return ok({ status: "up", ts: Date.now() })
}
