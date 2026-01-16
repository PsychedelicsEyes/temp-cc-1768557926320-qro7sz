"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function SidebarUser() {
  const { data } = useSession();
  if (!data?.user) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* avatar + name */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-black/15 bg-black/5">
          {data.user.image ? (
            <Image
              src={data.user.image}
              alt={data.user.name ?? "Avatar"}
              fill
              unoptimized
              sizes="36px"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-black">
            {data.user.name ?? "Utilisateur"}
          </div>
          {data.user.email ? (
            <div className="truncate text-[11px] text-black/45">{data.user.email}</div>
          ) : null}
        </div>
      </div>

      {/* logout */}
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-black/60 hover:bg-black/[0.04]"
        aria-label="Se déconnecter"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
