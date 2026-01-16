"use client"

import * as React from "react"

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function AdminTextarea({ className = "", ...props }: Props) {
  return (
    <textarea
      {...props}
      className={[
        // base
        "w-full resize-y rounded-2xl border border-black/15 bg-white",
        "px-4 py-3 text-sm text-black outline-none",
        // placeholder
        "placeholder:text-black/35",
        // focus
        "focus:border-black/30 focus:ring-0",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // custom
        className,
      ].join(" ")}
    />
  )
}
