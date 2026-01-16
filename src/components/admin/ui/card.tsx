"use client"

export default function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-black/10 bg-white p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}
