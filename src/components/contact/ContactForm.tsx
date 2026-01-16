"use client"

import * as React from "react"
import { useMemo, useState } from "react"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type FormState = {
  company: string
  lastName: string
  firstName: string
  address: string
  zip: string
  city: string
  phone: string
  email: string
  message: string
  file: File | null
}

type FieldKey = keyof FormState
type Errors = Partial<Record<FieldKey, string>>

const EMAIL_RE = /^\S+@\S+\.\S+$/

const REQUIRED: Array<FieldKey> = ["lastName", "firstName", "phone", "email", "message"]

const INITIAL_STATE: FormState = {
  company: "",
  lastName: "",
  firstName: "",
  address: "",
  zip: "",
  city: "",
  phone: "",
  email: "",
  message: "",
  file: null,
}

type TextFieldConfig = {
  key: Exclude<FieldKey, "message" | "file">
  label: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  layout?: "row" | "half"
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const fields = useMemo<TextFieldConfig[]>(
    () => [
      { key: "company", label: "Société" },
      { key: "lastName", label: "Nom", required: true },
      { key: "firstName", label: "Prénom", required: true },
      { key: "address", label: "Adresse" },
      { key: "zip", label: "Code postal", layout: "half" },
      { key: "city", label: "Ville", layout: "half" },
      { key: "phone", label: "Téléphone", required: true },
      { key: "email", label: "Email", required: true, type: "email" },
    ],
    []
  )

  function setField<K extends FieldKey>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validateForm(values: FormState): Errors {
    const next: Errors = {}

    for (const k of REQUIRED) {
      const v = values[k]
      if (typeof v === "string" && v.trim().length === 0) {
        next[k] = "Champ requis"
      }
    }

    if (values.email && !EMAIL_RE.test(values.email)) next.email = "Email invalide"
    return next
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      // TODO: brancher ton endpoint /api/contact
      // const body = new FormData()
      // ;(Object.keys(form) as Array<FieldKey>).forEach((k) => {
      //   const v = form[k]
      //   if (v == null) return
      //   body.append(k, v as any)
      // })
      // await fetch("/api/contact", { method: "POST", body })

      await new Promise((r) => setTimeout(r, 600))
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setForm(INITIAL_STATE)
    setErrors({})
    setSent(false)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
          Message envoyé
        </p>
        <h3 className="mt-3 text-[26px] font-light tracking-tight">
          Merci, nous revenons vers vous rapidement.
        </h3>

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center border border-black/15 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/70 hover:bg-black/[0.03]"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Header />
      <div className="space-y-5">
        {fields
          .filter((f) => f.layout !== "half")
          .map((f) => (
            <RowField
              key={f.key}
              label={f.label}
              required={f.required}
              error={errors[f.key]}
            >
              <TextInput
                type={f.type}
                value={String(form[f.key] ?? "")}
                placeholder={f.placeholder}
                onChange={(v) => setField(f.key, v as any)}
                error={errors[f.key]}
              />
            </RowField>
          ))}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields
            .filter((f) => f.layout === "half")
            .map((f) => (
              <StackField
                key={f.key}
                label={f.label}
                required={f.required}
                error={errors[f.key]}
              >
                <TextInput
                  type={f.type}
                  value={String(form[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(v) => setField(f.key, v as any)}
                  error={errors[f.key]}
                />
              </StackField>
            ))}
        </div>
        <RowTextarea
          label="Message"
          required
          value={form.message}
          onChange={(v) => setField("message", v)}
          error={errors.message}
        />
        <RowField label="Pièce jointe">
          <FileInput onChange={(file) => setField("file", file)} />
        </RowField>
      </div>

      <Actions loading={loading} />
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   UI parts                                 */
/* -------------------------------------------------------------------------- */

function Header() {
  return (
    <div className="mb-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
        Formulaire
      </p>
      <h2 className="mt-2 text-[22px] font-light tracking-tight">
        Écrivez-nous
      </h2>
      <div className="mt-4 h-[1px] w-full bg-black/10" />
    </div>
  )
}

function RowField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_1fr] sm:items-center">
      <span className="text-[12px] font-medium text-black/65">
        {label}{" "}
        {required ? <span className="text-black/40">*</span> : null}
      </span>
      <div className="min-w-0">
        {children}
        {error ? <p className="mt-1 text-[11px] text-red-600">{error}</p> : null}
      </div>
    </label>
  )
}

function StackField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-medium text-black/65">
        {label}{" "}
        {required ? <span className="text-black/40">*</span> : null}
      </span>
      <div className="min-w-0">
        {children}
        {error ? <p className="mt-1 text-[11px] text-red-600">{error}</p> : null}
      </div>
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  error?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(
        "w-full rounded-none border bg-white px-3 py-2 text-[13px] text-black/80 placeholder:text-black/30 outline-none",
        "focus:border-black/40",
        error ? "border-red-400" : "border-black/15"
      )}
    />
  )
}

function RowTextarea({
  label,
  required,
  value,
  onChange,
  error,
}: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <label className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_1fr] sm:items-start">
      <span className="pt-2 text-[12px] font-medium text-black/65">
        {label}{" "}
        {required ? <span className="text-black/40">*</span> : null}
      </span>
      <div className="min-w-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className={cx(
            "w-full rounded-none border bg-white px-3 py-2 text-[13px] text-black/80 placeholder:text-black/30 outline-none",
            "focus:border-black/40",
            error ? "border-red-400" : "border-black/15"
          )}
          placeholder="Votre message…"
        />
        {error ? <p className="mt-1 text-[11px] text-red-600">{error}</p> : null}
      </div>
    </label>
  )
}

function FileInput({ onChange }: { onChange: (file: File | null) => void }) {
  return (
    <input
      type="file"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      className="block w-full text-[12px] text-black/60 file:mr-4 file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.22em] file:text-black/70 hover:file:bg-black/10"
    />
  )
}

function Actions({ loading }: { loading: boolean }) {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={loading}
        className={cx(
          "inline-flex items-center justify-center border border-black/15 bg-black px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition",
          loading ? "opacity-60" : "hover:bg-black/85"
        )}
      >
        {loading ? "Envoi…" : "Envoyer"}
      </button>

      <p className="mt-5 text-[12px] leading-relaxed text-black/45">
        * champs obligatoires — Conformément à la loi Informatique et Libertés, vous disposez
        d’un droit d’accès, de rectification et de suppression concernant les données vous
        concernant.
      </p>
    </div>
  )
}
