"use client"

export default function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none " +
        "placeholder:text-black/35 focus:border-black/30 " +
        (props.className ?? "")
      }
    />
  )
}
