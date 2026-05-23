import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quejas y denuncias — Admin GSF",
  robots: { index: false, follow: false },
};

export default function AdminComplaintsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Quejas y denuncias</h1>
      <p className="mt-2 text-sm text-navy-600">
        Listado y gestión del canal de quejas.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-navy-300 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-navy-700">
          Fase 1 — autenticación lista
        </p>
        <p className="mt-2 text-sm text-navy-500">
          Listado de reportes, filtros, detalle, workflow de estado y notas
          internas se entregarán en la Fase 2.
        </p>
      </div>
    </div>
  );
}
