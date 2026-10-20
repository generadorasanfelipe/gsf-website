import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordStatusChange } from "@/lib/admin/notes";

export const COMPLAINT_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const COMPLAINT_TYPES = ["complaint", "grievance", "report"] as const;
export type ComplaintType = (typeof COMPLAINT_TYPES)[number];

export const REPORTER_CLASSES = ["internal", "external"] as const;
export type ReporterClass = (typeof REPORTER_CLASSES)[number];

export type Complaint = {
  // The live DB uses a UUID primary key; a bigint identity would arrive as a
  // numeric string too. Treat the id as an opaque string either way.
  id: string;
  reference_id: string;
  reporter_class: ReporterClass;
  type: ComplaintType;
  anonymous: boolean;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string;
  description: string;
  locale: "es" | "en";
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
};

export type ComplaintFilters = {
  status?: ComplaintStatus;
  type?: ComplaintType;
  reporterClass?: ReporterClass;
  from?: string; // YYYY-MM-DD inclusive
  to?: string; // YYYY-MM-DD inclusive
  q?: string; // free-text over reference_id / subject
  page?: number; // 1-based
};

export const PAGE_SIZE = 25;

/** Allowed status transitions. open/in_progress are the active states; a
 *  closed report can be reopened to in_progress if something resurfaces. */
export const STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  open: ["in_progress", "resolved", "closed"],
  in_progress: ["resolved", "closed"],
  resolved: ["closed", "in_progress"],
  closed: ["in_progress"],
};

export function isValidStatus(v: unknown): v is ComplaintStatus {
  return typeof v === "string" && COMPLAINT_STATUSES.includes(v as ComplaintStatus);
}

export type ComplaintListResult = {
  rows: Complaint[];
  total: number;
  page: number;
  pageCount: number;
};

/**
 * Paginated, filtered list for the admin table. Runs with the service-role
 * client — the caller must have passed requireAdmin() first.
 */
export async function listComplaints(
  filters: ComplaintFilters,
): Promise<ComplaintListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const fromIdx = (page - 1) * PAGE_SIZE;
  const toIdx = fromIdx + PAGE_SIZE - 1;

  const { data, error, count } = await filteredComplaintsQuery(filters).range(
    fromIdx,
    toIdx,
  );
  if (error) {
    throw new Error(`[admin] listComplaints failed: ${error.message}`);
  }

  const total = count ?? 0;
  return {
    rows: (data ?? []) as Complaint[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Builds the filtered, newest-first complaints query shared by the paginated
 *  list and the export. Does not apply a row range. */
function filteredComplaintsQuery(filters: ComplaintFilters) {
  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("complaints")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.reporterClass)
    query = query.eq("reporter_class", filters.reporterClass);
  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00`);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999`);
  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim().replace(/[%,]/g, " ");
    query = query.or(`reference_id.ilike.%${term}%,subject.ilike.%${term}%`);
  }

  return query;
}

/**
 * All matching complaints, newest first, without pagination — for CSV export.
 * Capped so a runaway filter can never stream an unbounded response.
 */
export async function listAllComplaints(
  filters: ComplaintFilters,
  limit = 5000,
): Promise<Complaint[]> {
  const { data, error } = await filteredComplaintsQuery(filters).range(
    0,
    limit - 1,
  );
  if (error) {
    throw new Error(`[admin] listAllComplaints failed: ${error.message}`);
  }
  return (data ?? []) as Complaint[];
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(`[admin] getComplaintById failed: ${error.message}`);
  }
  return (data as Complaint) ?? null;
}

/**
 * Status counts for the dashboard header chips. One grouped query would need
 * an RPC; four head-count queries are cheap and index-backed.
 */
export async function getStatusCounts(): Promise<Record<ComplaintStatus, number>> {
  const supabase = getSupabaseAdminClient();
  const entries = await Promise.all(
    COMPLAINT_STATUSES.map(async (status) => {
      const { count } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      return [status, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<ComplaintStatus, number>;
}

/**
 * Updates a report's status, enforcing the allowed transition map. Returns the
 * updated row, or an error reason. Caller must have passed requireAdmin().
 */
export async function updateComplaintStatus(
  id: string,
  next: ComplaintStatus,
  actorEmail: string,
): Promise<{ ok: true; row: Complaint } | { ok: false; reason: string }> {
  const current = await getComplaintById(id);
  if (!current) return { ok: false, reason: "not_found" };
  if (current.status === next) return { ok: true, row: current };
  if (!STATUS_TRANSITIONS[current.status].includes(next)) {
    return { ok: false, reason: "invalid_transition" };
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("complaints")
    .update({ status: next })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return { ok: false, reason: error.message };
  }

  // Audit trail — best-effort, never blocks the status change.
  await recordStatusChange(id, actorEmail, current.status, next);

  return { ok: true, row: data as Complaint };
}
