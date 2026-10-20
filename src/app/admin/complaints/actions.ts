"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import {
  isValidStatus,
  updateComplaintStatus,
  type ComplaintStatus,
} from "@/lib/admin/complaints";

export type UpdateStatusState = {
  ok: boolean;
  message?: string;
};

/**
 * Server action: change a report's status. Backed by a POST endpoint that can
 * be hit directly, so it re-verifies the admin session + allowlist here rather
 * than trusting the page gate.
 */
export async function updateStatusAction(
  _prev: UpdateStatusState,
  formData: FormData,
): Promise<UpdateStatusState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, message: "No autorizado." };
  }

  const idRaw = formData.get("id");
  const nextRaw = formData.get("status");
  const id = Number(idRaw);

  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, message: "Reporte inválido." };
  }
  if (!isValidStatus(nextRaw)) {
    return { ok: false, message: "Estado inválido." };
  }

  const result = await updateComplaintStatus(id, nextRaw as ComplaintStatus);
  if (!result.ok) {
    const msg =
      result.reason === "invalid_transition"
        ? "Esa transición de estado no está permitida."
        : result.reason === "not_found"
          ? "El reporte no existe."
          : "No se pudo actualizar el estado.";
    return { ok: false, message: msg };
  }

  revalidatePath(`/admin/complaints/${id}`);
  revalidatePath("/admin/complaints");
  return { ok: true, message: "Estado actualizado." };
}
