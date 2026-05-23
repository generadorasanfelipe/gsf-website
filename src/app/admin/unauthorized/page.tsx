import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso denegado — Admin GSF",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold text-navy-900">Acceso no autorizado</h1>
      <p className="mt-3 text-sm text-navy-600 leading-relaxed">
        Tu cuenta no está autorizada para acceder al panel interno. Si crees
        que esto es un error, contacta al administrador del sistema.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
      >
        Volver al sitio público
      </Link>
    </div>
  );
}
