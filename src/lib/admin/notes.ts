import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ComplaintStatus } from "@/lib/admin/complaints";

export type ComplaintNote = {
  id: string;
  complaint_id: string;
  author_email: string;
  body: string;
  created_at: string;
};

export type ComplaintHistory = {
  id: string;
  complaint_id: string;
  actor_email: string;
  from_status: ComplaintStatus | null;
  to_status: ComplaintStatus;
  created_at: string;
};

export const MAX_NOTE_LENGTH = 2000;

/** Internal notes for a report, oldest first. Caller must pass requireAdmin(). */
export async function listNotes(complaintId: string): Promise<ComplaintNote[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("complaint_notes")
    .select("*")
    .eq("complaint_id", complaintId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`[admin] listNotes failed: ${error.message}`);
  return (data ?? []) as ComplaintNote[];
}

export async function addNote(
  complaintId: string,
  authorEmail: string,
  body: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  if (trimmed.length > MAX_NOTE_LENGTH) return { ok: false, reason: "too_long" };

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("complaint_notes").insert({
    complaint_id: complaintId,
    author_email: authorEmail,
    body: trimmed,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/** Status-change audit trail for a report, oldest first. */
export async function listHistory(
  complaintId: string,
): Promise<ComplaintHistory[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("complaint_history")
    .select("*")
    .eq("complaint_id", complaintId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`[admin] listHistory failed: ${error.message}`);
  return (data ?? []) as ComplaintHistory[];
}

/**
 * Appends a status-transition row. Best-effort: a failure here must not block
 * the status change itself, so callers log and continue rather than throw.
 */
export async function recordStatusChange(
  complaintId: string,
  actorEmail: string,
  fromStatus: ComplaintStatus,
  toStatus: ComplaintStatus,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("complaint_history").insert({
    complaint_id: complaintId,
    actor_email: actorEmail,
    from_status: fromStatus,
    to_status: toStatus,
  });
  if (error) {
    console.error("[admin] recordStatusChange failed:", error.message);
  }
}
