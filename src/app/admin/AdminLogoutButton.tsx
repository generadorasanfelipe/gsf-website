"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border border-navy-200 px-3 py-1 text-xs font-medium text-navy-600 hover:border-accent-500 hover:text-accent-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
