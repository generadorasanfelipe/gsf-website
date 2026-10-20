import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/requireAdmin";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Admin GSF",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Already signed in and allowlisted? Skip the form, go straight in.
  const admin = await getAdminUser();
  if (admin) {
    const sp = await searchParams;
    const next = sp.next;
    const target =
      typeof next === "string" && next.startsWith("/admin")
        ? next
        : "/admin/complaints";
    redirect(target);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-navy-900">Panel interno</h1>
      <p className="mt-2 text-sm text-navy-600">
        Acceso restringido al personal autorizado. Introduce tu correo
        institucional y te enviaremos un enlace de acceso de un solo uso.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
