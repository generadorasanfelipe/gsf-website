import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/requireAdmin";
import {
  listComplaints,
  getStatusCounts,
  COMPLAINT_STATUSES,
  type ComplaintFilters,
  type ComplaintStatus,
  type ComplaintType,
  type ReporterClass,
} from "@/lib/admin/complaints";
import {
  STATUS_LABEL,
  STATUS_BADGE,
  TYPE_LABEL,
  CLASS_LABEL,
  CLASS_BADGE,
  formatDR,
} from "@/lib/admin/labels";
import ComplaintsFilters from "./ComplaintsFilters";

export const metadata: Metadata = {
  title: "Quejas y denuncias — Admin GSF",
  robots: { index: false, follow: false },
};

// Admin data is request-specific and must never be cached.
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

function buildFilters(sp: SearchParams): ComplaintFilters {
  const status = str(sp.status);
  const type = str(sp.type);
  const cls = str(sp.class);
  const pageNum = Number(str(sp.page));
  return {
    status: COMPLAINT_STATUSES.includes(status as ComplaintStatus)
      ? (status as ComplaintStatus)
      : undefined,
    type: (["complaint", "grievance", "report"] as const).includes(
      type as ComplaintType,
    )
      ? (type as ComplaintType)
      : undefined,
    reporterClass: (["internal", "external"] as const).includes(
      cls as ReporterClass,
    )
      ? (cls as ReporterClass)
      : undefined,
    from: str(sp.from),
    to: str(sp.to),
    q: str(sp.q),
    page: Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1,
  };
}

const FILTER_KEYS = ["status", "type", "class", "from", "to", "q"] as const;

/** Preserve the active filters when building a page link. */
function pageHref(sp: SearchParams, page: number): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const val = str(sp[key]);
    if (val) params.set(key, val);
  }
  params.set("page", String(page));
  return `/admin/complaints?${params.toString()}`;
}

/** Download link for the CSV export, carrying the active filters. */
function exportHref(sp: SearchParams): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const val = str(sp[key]);
    if (val) params.set(key, val);
  }
  const qs = params.toString();
  return `/api/admin/complaints/export${qs ? `?${qs}` : ""}`;
}

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/complaints");

  const sp = await searchParams;
  const filters = buildFilters(sp);

  const [list, counts] = await Promise.all([
    listComplaints(filters),
    getStatusCounts(),
  ]);
  const totalAll = COMPLAINT_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-navy-900">
            Quejas y denuncias
          </h1>
          <p className="text-sm text-navy-600">
            {totalAll} reporte{totalAll === 1 ? "" : "s"} en total · canal de
            quejas y denuncias
          </p>
        </div>
        <a
          href={exportHref(sp)}
          className="inline-flex items-center gap-2 rounded-lg border border-navy-300 px-4 py-2 text-sm font-medium text-navy-700 hover:border-navy-500 hover:bg-navy-50"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar CSV
        </a>
      </div>

      {/* Status summary chips */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COMPLAINT_STATUSES.map((s) => {
          const active = filters.status === s;
          return (
            <Link
              key={s}
              href={active ? "/admin/complaints" : `/admin/complaints?status=${s}`}
              className={`rounded-xl border p-4 transition-colors ${
                active
                  ? "border-navy-400 bg-navy-50"
                  : "border-navy-200 bg-white hover:border-navy-300"
              }`}
            >
              <div
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${STATUS_BADGE[s]}`}
              >
                {STATUS_LABEL[s]}
              </div>
              <div className="mt-2 text-2xl font-bold text-navy-900">
                {counts[s]}
              </div>
            </Link>
          );
        })}
      </div>

      <ComplaintsFilters
        initial={{
          type: filters.type ?? "",
          class: filters.reporterClass ?? "",
          from: filters.from ?? "",
          to: filters.to ?? "",
          q: filters.q ?? "",
          status: filters.status ?? "",
        }}
      />

      {/* Results table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-navy-200 bg-white">
        {list.rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-navy-500">
            No hay reportes que coincidan con los filtros.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-200 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Referencia</th>
                  <th className="px-4 py-3 font-semibold">Clasif.</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Asunto</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {list.rows.map((c) => (
                  <tr key={c.id} className="hover:bg-navy-50/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/complaints/${c.id}`}
                        className="font-mono text-xs font-semibold text-navy-900 hover:text-accent-600"
                      >
                        {c.reference_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${CLASS_BADGE[c.reporter_class]}`}
                      >
                        {CLASS_LABEL[c.reporter_class]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy-700">
                      {TYPE_LABEL[c.type]}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <Link
                        href={`/admin/complaints/${c.id}`}
                        className="line-clamp-1 text-navy-800 hover:text-accent-600"
                      >
                        {c.subject}
                      </Link>
                      {c.anonymous && (
                        <span className="ml-2 align-middle text-[10px] uppercase tracking-wide text-amber-700">
                          anónimo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${STATUS_BADGE[c.status]}`}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-navy-500">
                      {formatDR(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {list.pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-navy-500">
            Página {list.page} de {list.pageCount}
          </span>
          <div className="flex gap-2">
            {list.page > 1 && (
              <Link
                href={pageHref(sp, list.page - 1)}
                className="rounded-lg border border-navy-300 px-3 py-1.5 text-navy-700 hover:bg-navy-50"
              >
                Anterior
              </Link>
            )}
            {list.page < list.pageCount && (
              <Link
                href={pageHref(sp, list.page + 1)}
                className="rounded-lg border border-navy-300 px-3 py-1.5 text-navy-700 hover:bg-navy-50"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
