import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/requireAdmin";
import { getComplaintById } from "@/lib/admin/complaints";
import {
  STATUS_LABEL,
  STATUS_BADGE,
  TYPE_LABEL,
  CLASS_LABEL,
  CLASS_BADGE,
  CLASS_DEPT,
  formatDR,
} from "@/lib/admin/labels";
import StatusControl from "./StatusControl";

export const metadata: Metadata = {
  title: "Detalle de reporte — Admin GSF",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-navy-800">{children}</dd>
    </div>
  );
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const c = await getComplaintById(id);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/complaints"
        className="text-sm text-navy-500 hover:text-accent-600"
      >
        ← Volver al listado
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${CLASS_BADGE[c.reporter_class]}`}
            >
              {CLASS_LABEL[c.reporter_class]}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${STATUS_BADGE[c.status]}`}
            >
              {STATUS_LABEL[c.status]}
            </span>
          </div>
          <h1 className="mt-2 font-mono text-lg font-bold text-navy-900">
            {c.reference_id}
          </h1>
        </div>
      </div>

      {/* Status workflow */}
      <div className="mt-6 rounded-2xl border border-navy-200 bg-white p-5">
        <StatusControl id={c.id} current={c.status} />
      </div>

      {/* Report body */}
      <div className="mt-6 rounded-2xl border border-navy-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">{c.subject}</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy-700">
          {c.description}
        </p>
      </div>

      {/* Metadata */}
      <dl className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border border-navy-200 bg-white p-6 sm:grid-cols-2">
        <Field label="Tipo">{TYPE_LABEL[c.type]}</Field>
        <Field label="Departamento responsable">
          {CLASS_DEPT[c.reporter_class]}
        </Field>
        <Field label="Idioma del reportante">
          {c.locale === "es" ? "Español" : "Inglés"}
        </Field>
        <Field label="Recibido">{formatDR(c.created_at)}</Field>
        <Field label="Última actualización">{formatDR(c.updated_at)}</Field>

        <div className="sm:col-span-2 border-t border-navy-100 pt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
            Contacto del reportante
          </h3>
          {c.anonymous ? (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
              ⚠ Reporte anónimo — sin datos de contacto.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nombre">{c.name ?? "—"}</Field>
              <Field label="Email">
                {c.email ? (
                  <a
                    href={`mailto:${c.email}`}
                    className="text-navy-700 underline hover:text-accent-600"
                  >
                    {c.email}
                  </a>
                ) : (
                  "—"
                )}
              </Field>
              {c.phone && (
                <Field label="Teléfono">
                  <a
                    href={`tel:${c.phone}`}
                    className="text-navy-700 underline hover:text-accent-600"
                  >
                    {c.phone}
                  </a>
                </Field>
              )}
            </div>
          )}
        </div>
      </dl>
    </div>
  );
}
