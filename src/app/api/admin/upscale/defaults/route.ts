import { NextResponse } from "next/server"
import path from "node:path"

function normalizeWin(p: string) {
  return p.replace(/\//g, "\\")
}

export async function GET() {
  // auto-detect : <project>/public/properties
  const input = path.join(process.cwd(), "public", "properties")
  const output = path.join(process.cwd(), "public", "properties_hd")

  return NextResponse.json(
    {
      inputDir: normalizeWin(input),
      outputDir: normalizeWin(output),
      scale: 2,
      format: "webp",
      quality: 92,
    },
    { status: 200 }
  )
}
