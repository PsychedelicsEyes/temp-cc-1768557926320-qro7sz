import { NextResponse } from "next/server"
import { createUpscaleJob } from "@/lib/admin/store"
import type { CreateUpscaleJobInput } from "@/lib/admin/types"
import { spawn } from "node:child_process"
import path from "node:path"

function isObj(v: any): v is Record<string, any> {
  return typeof v === "object" && v !== null
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function cleanPayload(raw: any): CreateUpscaleJobInput {
  if (!isObj(raw)) throw new Error("Body JSON invalide")

  const inputDir = String(raw.inputDir ?? "").trim()
  const outputDir = String(raw.outputDir ?? "").trim()

  const scaleNum = Number(raw.scale ?? 2)
  const scale = (scaleNum === 3 ? 3 : scaleNum === 4 ? 4 : 2) as 2 | 3 | 4

  const format = (String(raw.format ?? "webp").toLowerCase() as any) as
    | "webp"
    | "jpg"
    | "png"

  const quality = clamp(Number(raw.quality ?? 92), 1, 100)
  const useAI = raw.useAI !== false // true par défaut

  if (!inputDir) throw new Error("inputDir requis")
  if (!outputDir) throw new Error("outputDir requis")
  if (!["webp", "jpg", "png"].includes(format)) throw new Error("format invalide")

  return { inputDir, outputDir, scale, format, quality, useAI }
}

function spawnWorker(jobId: string) {
  const script = path.join(process.cwd(), "scripts", "upscale-ai.mjs")
  const logFile = path.join(process.cwd(), ".data", `upscale-${jobId}.log`)
  
  console.log("[Upscale API] 🚀 Démarrage du worker")
  console.log("[Upscale API] Job ID:", jobId)
  console.log("[Upscale API] Script:", script)
  console.log("[Upscale API] Logs:", logFile)
  
  // Utiliser fs.openSync pour obtenir un file descriptor
  const fs = require("fs")
  
  // S'assurer que le dossier .data existe
  const dataDir = path.dirname(logFile)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Ouvrir le fichier log et obtenir le file descriptor
  const logFd = fs.openSync(logFile, "a")
  
  try {
    const child = spawn(process.execPath, [script, "--job", jobId], {
      cwd: process.cwd(),
      detached: true,
      stdio: ["ignore", logFd, logFd], // stdout et stderr vers le file descriptor
      windowsHide: true,
    })
    
    child.on("error", (err) => {
      console.error("[Upscale API] ❌ Erreur spawn:", err)
      try {
        fs.appendFileSync(logFile, `\n[SPAWN ERROR] ${err.message}\n`)
      } catch {}
    })
    
    child.on("spawn", () => {
      console.log("[Upscale API] ✓ Worker spawné, PID:", child.pid)
    })
    
    child.unref()
    
    // Fermer le file descriptor après un court délai (le child process l'a hérité)
    setTimeout(() => {
      try {
        fs.closeSync(logFd)
      } catch {}
    }, 100)
    
    console.log("[Upscale API] ✓ Commande lancée")
  } catch (err) {
    console.error("[Upscale API] ❌ Erreur lors du spawn:", err)
    try {
      fs.closeSync(logFd)
    } catch {}
    throw err
  }
}

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? ""
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: 'Expected application/json' },
      { status: 415 }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  let payload: CreateUpscaleJobInput
  try {
    payload = cleanPayload(body)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Body invalide" }, { status: 400 })
  }

  console.log("[Upscale] Payload:", payload)

  const job = await createUpscaleJob(payload)
  spawnWorker(job.id)

  return NextResponse.json({ job }, { status: 200 })
}