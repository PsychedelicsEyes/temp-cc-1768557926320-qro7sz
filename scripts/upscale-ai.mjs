import "dotenv/config"
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import sharp from "sharp"

const ROOT = process.cwd()
const DB_PATH = path.join(ROOT, ".data", "admin-jobs.json")

/* -------------------------------------------------- */
/* Utils                                              */
/* -------------------------------------------------- */

function arg(name) {
  const i = process.argv.indexOf(name)
  return i === -1 ? null : process.argv[i + 1]
}

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function isImage(file) {
  return [".jpg", ".jpeg", ".png", ".webp"].includes(
    path.extname(file).toLowerCase()
  )
}

async function walk(dir) {
  const out = []
  for (const it of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, it.name)
    if (it.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

function relFrom(base, file) {
  return path.relative(base, file)
}

function withExt(file, ext) {
  return file.replace(/\.[^.]+$/, "." + ext)
}

/* -------------------------------------------------- */
/* DB                                                 */
/* -------------------------------------------------- */

async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf8")
  return JSON.parse(raw)
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8")
}

async function updateJob(jobId, patch) {
  const db = await readDb()
  const idx = db.jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) return
  db.jobs[idx] = {
    ...db.jobs[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  await writeDb(db)
}

/* -------------------------------------------------- */
/* Real-ESRGAN ONLY                                   */
/* -------------------------------------------------- */

async function upscaleWithRealESRGAN(input, output, scale) {
  const exe = path.join(
    ROOT,
    "tools",
    "realesrgan",
    "realesrgan-ncnn-vulkan.exe"
  )
  const models = path.join(ROOT, "tools", "realesrgan", "models")

  if (!(await exists(exe))) throw new Error("Real-ESRGAN exe introuvable")
  if (!(await exists(models))) throw new Error("Models Real-ESRGAN introuvables")

  const model = "realesrgan-x4plus"
  const s = scale >= 4 ? 4 : 2
  const tmpOut = withExt(output, "png")

  return new Promise((resolve, reject) => {
    const args = [
      "-i", input,
      "-o", tmpOut,
      "-n", model,
      "-s", String(s),
      "-m", models,
      "-f", "png",
    ]

    console.log("  → Real-ESRGAN:", path.basename(input))

    const p = spawn(exe, args, { windowsHide: true })
    let stderr = ""

    p.stderr.on("data", (d) => (stderr += d.toString()))

    p.on("close", async (code) => {
      if (code !== 0)
        return reject(new Error(`Real-ESRGAN failed: ${stderr}`))
      if (!(await exists(tmpOut)))
        return reject(new Error("Output Real-ESRGAN manquant"))
      resolve(tmpOut)
    })

    p.on("error", reject)
  })
}

/* -------------------------------------------------- */
/* Conversion (Sharp uniquement ici)                   */
/* -------------------------------------------------- */

async function convert(tmp, dst, format, quality) {
  let p = sharp(tmp)
  if (format === "webp") p = p.webp({ quality })
  else if (format === "jpg" || format === "jpeg") p = p.jpeg({ quality })
  else if (format === "png") p = p.png()
  await p.toFile(dst)
  await fs.unlink(tmp)
}

/* -------------------------------------------------- */
/* Main                                               */
/* -------------------------------------------------- */

async function main() {
  const jobId = arg("--job")
  if (!jobId) throw new Error("Missing --job")

  const db = await readDb()
  const job = db.jobs.find((j) => j.id === jobId)
  if (!job) throw new Error("Job introuvable")

  const { inputDir, outputDir, scale, format, quality } = job.payload

  await updateJob(jobId, { status: "running", error: null })

  const files = (await walk(inputDir)).filter(isImage)
  await fs.mkdir(outputDir, { recursive: true })

  let ok = 0
  let fail = 0

  for (const src of files) {
    const rel = relFrom(inputDir, src)
    const dst = path.join(outputDir, withExt(rel, format))

    console.log(`\n[${ok + fail + 1}/${files.length}] ${rel}`)

    try {
      await fs.mkdir(path.dirname(dst), { recursive: true })

      const tmp = await upscaleWithRealESRGAN(src, dst, scale)

      if (format === "png") {
        await fs.rename(tmp, dst)
      } else {
        await convert(tmp, dst, format, quality)
      }

      ok++
      console.log("  ✓ OK")
    } catch (e) {
      fail++
      console.error("  ✗ FAIL:", e.message)
    }

    await updateJob(jobId, {
      progress: { total: files.length, ok, fail },
    })
  }

  await updateJob(jobId, {
    status: fail > 0 ? "error" : "done",
    error: fail ? `${fail} échec(s)` : null,
    progress: { total: files.length, ok, fail },
  })

  process.exit(fail ? 1 : 0)
}

main().catch(async (e) => {
  console.error("❌ FATAL:", e.message)
  const jobId = arg("--job")
  if (jobId)
    await updateJob(jobId, { status: "error", error: e.message })
  process.exit(1)
})
