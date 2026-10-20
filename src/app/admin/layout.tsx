import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import AdminLogoutButton from "./AdminLogoutButton";

export const metadata: Metadata = {
  title: "Admin — Generadora San Felipe",
  description: "Panel interno de gestión de quejas y denuncias.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <header className="border-b border-navy-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/admin/complaints"
            className="text-sm font-semibold uppercase tracking-wider text-navy-900"
          >
            GSF — Panel Interno
          </Link>
          <div className="flex items-center gap-4 text-xs">
            {user?.email && (
              <span className="hidden text-navy-500 sm:inline">
                {user.email}
              </span>
            )}
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">{children}</div>
    </div>
  );
}
