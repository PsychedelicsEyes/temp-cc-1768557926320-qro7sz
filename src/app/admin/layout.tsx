import AdminShell from "@/components/admin/ui/shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <AdminShell>{children}</AdminShell>

  )
}
