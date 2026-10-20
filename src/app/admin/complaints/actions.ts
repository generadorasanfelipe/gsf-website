"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, type AdminUser } from "@/lib/admin/requireAdmin";
import {
  isValidStatus,
  updateComplaintStatus,
  type ComplaintStatus,
} from "@/lib/admin/complaints";
import { addNote } from "@/lib/admin/notes";

export type ActionState = {
  ok: boolean;
  message?: string;
};

async function authOrNull(): Promise<AdminUser | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}

/**
 * Server action: change a report's status. Backed by a POST endpoint that can
 * be hit directly, so it re-verifies the admin session + allowlist here rather
 * than trusting the page gate. The transition is recorded in the audit log
 * under the acting admin's email.
 */
export async function updateStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await authOrNull();
  if (!admin) return { ok: false, message: "No autorizado." };

  const idRaw = formData.get("id");
  const nextRaw = formData.get("status");
  const id = typeof idRaw === "string" ? idRaw.trim() : "";

  if (!id) return { ok: false, message: "Reporte inválido." };
  if (!isValidStatus(nextRaw)) return { ok: false, message: "Estado inválido." };

  const result = await updateComplaintStatus(
    id,
    nextRaw as ComplaintStatus,
    admin.email,
  );
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

/**
 * Server action: add an internal note to a report, attributed to the acting
 * admin. Same direct-access guard as above.
 */
export async function addNoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await authOrNull();
  if (!admin) return { ok: false, message: "No autorizado." };

  const idRaw = formData.get("id");
  const bodyRaw = formData.get("body");
  const id = typeof idRaw === "string" ? idRaw.trim() : "";
  const body = typeof bodyRaw === "string" ? bodyRaw : "";

  if (!id) return { ok: false, message: "Reporte inválido." };

  const result = await addNote(id, admin.email, body);
  if (!result.ok) {
    const msg =
      result.reason === "empty"
        ? "La nota está vacía."
        : result.reason === "too_long"
          ? "La nota es demasiado larga."
          : "No se pudo guardar la nota.";
    return { ok: false, message: msg };
  }

  revalidatePath(`/admin/complaints/${id}`);
  return { ok: true, message: "Nota agregada." };
}
