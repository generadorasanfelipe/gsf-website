import type {
  ComplaintStatus,
  ComplaintType,
  ReporterClass,
} from "@/lib/admin/complaints";

export const STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: "Abierto",
  in_progress: "En progreso",
  resolved: "Resuelto",
  closed: "Cerrado",
};

/** Tailwind classes for the status pill. Kept as full literal strings so the
 *  JIT compiler keeps them in the build. */
export const STATUS_BADGE: Record<ComplaintStatus, string> = {
  open: "bg-amber-100 text-amber-800 ring-amber-200",
  in_progress: "bg-sky-100 text-sky-800 ring-sky-200",
  resolved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  closed: "bg-navy-100 text-navy-600 ring-navy-200",
};

export const TYPE_LABEL: Record<ComplaintType, string> = {
  complaint: "Queja",
  grievance: "Reclamo",
  report: "Denuncia",
};

export const CLASS_LABEL: Record<ReporterClass, string> = {
  internal: "Interno",
  external: "Externo",
};

export const CLASS_DEPT: Record<ReporterClass, string> = {
  internal: "Reclamos",
  external: "Relaciones",
};

export const CLASS_BADGE: Record<ReporterClass, string> = {
  internal: "bg-violet-100 text-violet-800 ring-violet-200",
  external: "bg-teal-100 text-teal-800 ring-teal-200",
};

/** Formats an ISO timestamp in Dominican Republic local time for display. */
export function formatDR(iso: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
